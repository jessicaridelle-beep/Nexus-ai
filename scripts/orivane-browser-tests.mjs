import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import assert from "node:assert/strict";
const reportPath=process.env.ORIVANE_BROWSER_REPORT||"/tmp/orivane-browser-report.json";
const checks=[];
let stage="start";
const check=async(name,fn)=>{stage="start";try{await fn();checks.push({name,status:"pass"});}catch(e){const code=e?.name==="TimeoutError"?"timeout":e?.name==="AssertionError"?"assertion_failed":"browser_error";checks.push({name,status:"fail",code,stage});console.log("Failed browser check:",name,code,stage);}};
const root=process.cwd();
const mime={".html":"text/html",".js":"application/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png"};
let browser,server;
const LIVE="https://jessicaridelle-beep.github.io/Nexus-ai/";
const API="https://nexus-ai-api.jessicaridelle.workers.dev";
const card=(type,question,options)=>"[ORIVANE_CARD]"+JSON.stringify({type,question,options})+"[/ORIVANE_CARD]";
const sse=(reply)=>({status:200,contentType:"text/event-stream",body:[{orivaneEvent:"answer-started"},{response:reply.slice(0,5)},{response:reply.slice(5)},{orivaneEvent:"done"}].map(x=>"data: "+JSON.stringify(x)+"\n\n").join("")});
const json=reply=>({status:200,contentType:"application/json",body:JSON.stringify({reply})});
const submitSelector="#chatForm button[type=submit]";
async function withPage(url,fixture,fn){
 const context=await browser.newContext({locale:"en-US",serviceWorkers:"block"});
 try{
  const page=await context.newPage();page.setDefaultTimeout(15000);
  const errors=[];page.on("pageerror",()=>errors.push("uncaught_page_error"));
  let requests=0;
  if(fixture){
   await page.route(API+"/**",async route=>{
    const req=route.request(),u=new URL(req.url());
    const headers={"access-control-allow-origin":new URL(url).origin,"access-control-allow-credentials":"true","access-control-allow-methods":"POST,GET,OPTIONS","access-control-allow-headers":req.headers()["access-control-request-headers"]||"content-type"};
    if(req.method()==="OPTIONS")return route.fulfill({status:204,headers});
    if(req.method()==="POST"&&!u.searchParams.get("action")){
      requests++;const res=fixture(requests,req.postDataJSON());return route.fulfill({...res,headers});
    }
    return route.fulfill({status:200,contentType:"application/json",headers,body:JSON.stringify({ok:true,user:null,authenticated:false})});
   });
   await page.route("**/*",route=>{const u=new URL(route.request().url());if(u.origin===new URL(url).origin||u.origin===API)return route.fallback();return route.abort();});
  }
  stage="page_load";await page.goto(url,{waitUntil:"domcontentloaded",timeout:30000});
  stage="composer_ready";await page.locator("#promptInput").waitFor({state:"visible"});
  await fn(page,()=>requests);
  stage="page_error_check";assert.equal(errors.length,0,"uncaught browser JavaScript error");
 }finally{await context.close();}
}
async function send(page,text){
 const rows=page.locator("#chatContent .assistant-message:not(.orivane-typing)");
 const before=await rows.count();
 stage="fill_prompt";await page.locator("#promptInput").fill(text);
 stage="submit_prompt";await page.locator(submitSelector).click();
 stage="wait_reply";
 await page.waitForFunction(({before,selector})=>{
   const rows=document.querySelectorAll("#chatContent .assistant-message:not(.orivane-typing)");
   return rows.length>before&&!document.querySelector(selector)?.disabled;
 },{before,selector:submitSelector},{timeout:65000});
 stage="reply_rendered";return rows.last();
}
async function body(row){return row.locator(".assistant-message-content").innerText();}
try{
 const {chromium}=await import("playwright");
 browser=await chromium.launch({headless:true,...(process.env.ORIVANE_CHROME_PATH?{executablePath:process.env.ORIVANE_CHROME_PATH}:{})});
 server=http.createServer((req,res)=>{
   try{
    const pathname=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname);
    const file=path.resolve(root,"."+ (pathname==="/"?"/index.html":pathname));
    if(!file.startsWith(root+path.sep)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
    res.writeHead(200,{"content-type":mime[path.extname(file)]||"application/octet-stream"});fs.createReadStream(file).pipe(res);
   }catch{res.writeHead(404);res.end();}
 });
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 const local="http://127.0.0.1:"+server.address().port+"/";
 await check("Browser: typed streamed reply renders bold, italics, and clickable link",()=>withPage(local,()=>sse("**Bold** and *italic*. [Example](https://example.com/)"),async page=>{
  const row=await send(page,"Formatting test");
  stage="bold_render";assert.equal(await row.locator(".assistant-message-content strong").innerText(),"Bold");
  stage="italic_render";assert.equal(await row.locator(".assistant-message-content em").innerText(),"italic");
  stage="link_render";assert.equal(await row.locator(".assistant-message-content a").getAttribute("href"),"https://example.com/");
  assert.ok(!(await body(row)).includes("**"));
 }));
 await check("Browser: unfinished bold is repaired and reported",()=>withPage(local,()=>json("Here is **bold..."),async page=>{
  const row=await send(page,"Unfinished markup test");
  stage="unfinished_bold_render";assert.ok((await body(row)).includes("bold..."));assert.ok(!(await body(row)).includes("**"));assert.equal(await row.locator(".assistant-message-content strong").innerText(),"bold...");
  const events=await page.evaluate(()=>JSON.parse(localStorage.getItem("orivane-report-local-v1")||"[]"));
  stage="unfinished_bold_report";assert.ok(events.some(e=>e.code==="browser_unclosed_bold"&&e.count>0));
 }));
 await check("Browser: clarification card appears without refreshing and submits typed answer",()=>withPage(local,n=>json(n===1?card("clarification","Which color?",[]):"Answer received"),async(page,count)=>{
  const row=await send(page,"Ask a clarification");
  stage="clarification_render";const field=row.locator(".orivane-interactive-card input");
  await field.fill("Blue");stage="clarification_submit";await row.locator(".orivane-interactive-card button").click();
  await page.waitForFunction(()=>!document.querySelector("#chatForm button[type=submit]")?.disabled&&Array.from(document.querySelectorAll("#chatContent .assistant-message")).at(-1)?.textContent.includes("Answer received"));
  assert.equal(count(),2);
  assert.ok(!(await body(row)).includes("ORIVANE_CARD"));
 }));
 await check("Browser: ordinary clarification stays plain text",()=>withPage(local,()=>json("Which color?"),async page=>{
  const row=await send(page,"Ask a normal question");assert.equal(await body(row),"Which color?");assert.equal(await row.locator(".orivane-interactive-card").count(),0);
 }));
 await check("Browser: poll and checklist controls work without refresh",()=>withPage(local,n=>json(n===1?card("poll","Choose",["Blue","Green"]):card("checklist","Tasks",["One","Two"])),async(page,count)=>{
  const row=await send(page,"Make a poll");
  await row.locator(".orivane-interactive-card button").first().click();
  await page.locator(".orivane-interactive-card input[type=checkbox]").first().waitFor();
  await page.waitForFunction(()=>!document.querySelector("#chatForm button[type=submit]")?.disabled);
  const boxes=page.locator(".orivane-interactive-card input[type=checkbox]");assert.equal(await boxes.count(),2);
  await boxes.first().check();assert.equal(await boxes.first().isChecked(),true);assert.equal(count(),2);
 }));
 await check("Browser: empty stream retries and records failure",()=>withPage(local,n=>n===1?sse(""):json("Recovered"),async(page,count)=>{
  const row=await send(page,"Retry test");assert.equal(count(),2);assert.ok((await body(row)).includes("Recovered"));
  const events=await page.evaluate(()=>JSON.parse(localStorage.getItem("orivane-report-local-v1")||"[]"));
  assert.ok(events.some(e=>e.code==="browser_empty_stream"));
 }));
 await check("Browser: inline code and file fences stay literal",()=>withPage(local,()=>json("Example: \x60**literal**\x60\n\n\x60\x60\x60file:example.txt\n**unchanged**\n\x60\x60\x60"),async page=>{
  const row=await send(page,"Code test");
  stage="inline_code_render";assert.equal(await row.locator(".assistant-message-content p code").innerText(),"**literal**");
  stage="file_code_render";assert.ok((await row.locator(".assistant-message-content pre code").innerText()).includes("**unchanged**"));
  stage="file_download_control";assert.equal(await row.getByRole("button",{name:"Download file",exact:true}).count(),1);
 }));
 await check("Browser: expandable answers, saved replies and follow-up drafts",()=>withPage(local,()=>json("Main answer.\n\n> [!TIP]\n> **Useful advice**\n\n> [!DETAILS]\n> Extra detail"),async(page,count)=>{
  const row=await send(page,"Test new chat tools");
  assert.equal(await row.locator(".orivane-callout-tip strong").first().innerText(),"Tip");
  const detail=row.locator("details.orivane-callout-details");
  assert.equal(await detail.getAttribute("open"),null);
  await detail.locator("summary").click();
  assert.notEqual(await detail.getAttribute("open"),null);
  await row.getByRole("button",{name:"Save reply",exact:true}).click();
  await page.getByRole("button",{name:"Saved replies",exact:true}).click();
  assert.ok((await page.locator("#orivaneSavedReplies").innerText()).includes("Main answer"));
  await row.getByRole("button",{name:"Follow-up",exact:true}).click();
  await row.getByRole("button",{name:"Shorter",exact:true}).click();
  assert.ok((await page.locator("#promptInput").inputValue()).includes("Make this reply shorter"));
  assert.equal(count(),1);
  await page.locator("#orivaneSavedReplies").getByRole("button",{name:"Remove",exact:true}).click();
  assert.ok((await page.locator("#orivaneSavedReplies").innerText()).includes("No saved replies"));
 }));
 if(process.env.ORIVANE_LIVE_TEST==="true"){
  await check("Live: deployed ORIVANE receives a typed prompt and renders its reply",()=>withPage(LIVE,null,async page=>{
   const row=await send(page,"For a harmless formatting check, reply with the word Bold in bold, Italic in italics, and a clickable link to https://example.com/. Keep it short.");
   const text=await body(row);assert.ok(text.trim().length>0);
   assert.ok(!(text.includes("**")||text.includes("[ORIVANE_CARD]")));
   assert.ok(await row.locator(".assistant-message-content strong").count());
   assert.ok(await row.locator(".assistant-message-content em").count());
   assert.ok(await row.locator('.assistant-message-content a[href^="https://example.com"]').count());
  }));
 }else checks.push({name:"Live: deployed ORIVANE",status:"skip",code:"scheduled_or_manual_only"});
}catch{checks.push({name:"Browser: test environment starts",status:"fail",code:"browser_setup_failed"});}
finally{
 if(browser)await browser.close().catch(()=>{});
 if(server)await new Promise(resolve=>server.close(resolve));
 fs.writeFileSync(reportPath,JSON.stringify({checks},null,2)+"\n");
 console.log("Browser diagnostics:",checks.filter(x=>x.status==="pass").length,"passed,",checks.filter(x=>x.status==="fail").length,"failed");
 if(checks.some(x=>x.status==="fail"))process.exitCode=1;
}
