import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import vm from "node:vm";
import assert from "node:assert/strict";

const root=process.cwd();
const git=spawnSync("git",["ls-files","-z"],{encoding:"utf8"});
if(git.status!==0)throw Error("Cannot list tracked files.");
const files=git.stdout.split("\0").filter(Boolean);
const checks=[];
function check(name,fn){try{fn();checks.push({name,status:"pass"});}catch{checks.push({name,status:"fail"});}}
for(const file of files){
  if(/\.(?:js|mjs|cjs)$/.test(file))check("JavaScript syntax: "+file,()=>{
    const args=file.endsWith(".cjs")?["--check",file]:["--input-type=module","--check"];
    const result=spawnSync(process.execPath,args,{input:fs.readFileSync(file,"utf8"),encoding:"utf8"});
    assert.equal(result.status,0);
  });
  if(/\.json$/.test(file)&&file!=="Orivane-report.json")check("JSON syntax: "+file,()=>JSON.parse(fs.readFileSync(file,"utf8")));
}
check("HTML local assets exist",()=>{
  const html=fs.readFileSync("index.html","utf8");
  for(const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)){
    const value=match[1].split(/[?#]/)[0];
    if(!value||/^(?:[a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(value))continue;
    assert.ok(fs.existsSync(path.resolve(root,value)));
  }
});
check("Service worker cached assets exist",()=>{
  const source=fs.readFileSync("sw.js","utf8");
  for(const match of source.matchAll(/new URL\("(\.\/[^"]*)", BASE\)/g)){
    const value=match[1].split(/[?#]/)[0];assert.ok(fs.existsSync(path.resolve(root,value)));
  }
});
check("Chat asset versions match service worker",()=>{
  const html=fs.readFileSync("index.html","utf8"),sw=fs.readFileSync("sw.js","utf8");
  for(const file of [...new Set([...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))\?v=\d+"/g)].map(m=>m[1]))]){
    const re=new RegExp(file.replace(".","\\.")+"\\?v=\\d+");
    assert.ok(html.match(re));assert.equal(html.match(re)[0],sw.match(re)?.[0]);
  }
});
const worker=fs.readFileSync("worker.js","utf8");
const browser=fs.readFileSync("script.js","utf8");
function extract(source,start,end){
  const a=source.indexOf(start),b=source.indexOf(end,a+start.length);
  assert.ok(a>=0&&b>a);return source.slice(a,b);
}
check("Reply watchdog catches known empty and error replies",()=>{
  const ctx=vm.createContext({});
  vm.runInContext(extract(worker,"function orivaneUnclosedBold(","function orivaneDiagnosticToken("),ctx);
  const checkReply=text=>Array.from(ctx.orivaneReplyIssues(text));
  assert.deepEqual(checkReply(""),["empty_reply"]);
  assert.deepEqual(checkReply("The AI stream returned an empty response."),["error_reply"]);
  assert.deepEqual(checkReply("Hello! 🔑"),[]);
  assert.deepEqual(checkReply("[ORIVANE_CARD]{bad}[/ORIVANE_CARD]"),["invalid_card"]);
  assert.deepEqual(checkReply('[ORIVANE_CARD]{"type":"poll","question":"Pick","options":["A","B"]}[/ORIVANE_CARD]'),[]);
  const clarification='[ORIVANE_CARD]{"type":"clarification","question":"Which color?","options":[]}[/ORIVANE_CARD]';
  assert.deepEqual(checkReply(clarification),[]);
  assert.deepEqual(checkReply("Before "+clarification+" after"),[]);
  assert.deepEqual(checkReply("\x60\x60\x60json\n"+clarification+"\n\x60\x60\x60"),[]);
  assert.deepEqual(checkReply("\x60\x60\x60text\n[ORIVANE_CARD] literal\n\x60\x60\x60"),[]);
});
check("Stream token readers handle supported model packets",()=>{
  const packets=[
    [{response:"a"},"a"],[{token:"b"},"b"],[{type:"response.output_text.delta",delta:"c"},"c"],
    [{choices:[{delta:{content:"d"}}]},"d"],[{choices:[{delta:{content:[{type:"text",text:"e"}]}}]},"e"],
    [{type:"content_block_delta",delta:{type:"text_delta",text:"f"}},"f"],
    [{type:"response.reasoning_text.delta",delta:"hidden"},""]
  ];
  const ctx=vm.createContext({});
  vm.runInContext(extract(worker,"function orivaneDiagnosticToken(","async function orivaneReportTable("),ctx);
  vm.runInContext(extract(browser,"function orivaneStreamToken(","async function sendMessage("),ctx);
  for(const [packet,expected] of packets){assert.equal(ctx.orivaneDiagnosticToken(packet),expected);assert.equal(ctx.orivaneStreamToken(packet),expected);}
});
check("Empty stream fallback and diagnostics wired",()=>{
  assert.ok(browser.includes('retryAI("browser_empty_stream")'));assert.ok(browser.includes("orivaneBrowserReport([reason])"));
  assert.ok(browser.includes("requestAI(false)"));
  assert.ok(worker.includes('["empty_stream"]'));
  assert.ok(worker.includes("orivaneReportRecord"));
});
check("AI usage limits are distinguished from reconnect failures",()=>{
 const ctx=vm.createContext({});
 vm.runInContext(extract(worker,"function orivaneModelFailure(","export default {"),ctx);
 vm.runInContext(extract(browser,"function orivaneUsageLimit(","async function sendMessage("),ctx);
 assert.equal(ctx.orivaneModelFailure({code:4006}).status,429);
 assert.equal(ctx.orivaneModelFailure({message:"daily free allocation"}).code,"model_quota");
 assert.ok(ctx.orivaneUsageLimit(429,"model_quota").includes("daily"));
 assert.ok(ctx.orivaneUsageLimit(429,"model_rate_limited").includes("rate-limiting"));
 assert.equal(ctx.orivaneUsageLimit(502,"model_provider_error"),"");
 assert.ok(browser.includes("if(streamedLimit)throw Error(streamedLimit)"));
});
check("Chat links are clickable and unsafe schemes rejected",()=>{
  const makeNode=tag=>({tag,children:[],append(...items){this.children.push(...items);},appendChild(item){this.children.push(item);}});
  const ctx=vm.createContext({URL,document:{createElement:makeNode,createTextNode:text=>({tag:"#text",text})}});
  vm.runInContext(extract(browser,"function appendLink(","function getGifUrlFromText("),ctx);
  vm.runInContext(extract(browser,"function orivaneInline(","function orivaneMarkdown("),ctx);
  const links=text=>{const n=makeNode("div");ctx.orivaneInline(n,text);return n.children.filter(x=>x.tag==="a");};
  assert.equal(links("Visit https://example.com/test.")[0].href,"https://example.com/test");
  assert.equal(links("www.example.com")[0].href,"https://www.example.com/");
  assert.equal(links("[Read more](https://example.com/wiki/Test_(topic))")[0].href,"https://example.com/wiki/Test_(topic)");
  assert.equal(links("<https://example.com>")[0].href,"https://example.com/");
  assert.equal(links("\x60https://example.com\x60").length,0);
  const n=makeNode("div");assert.equal(ctx.appendLink(n,"javascript:alert(1)","bad"),null);
  assert.equal(links("https://example.com")[0].rel,"noopener noreferrer");
});
check("Streaming Markdown and readable copy formatting",()=>{
  const makeNode=tag=>({tag,children:[],classList:{remove(){}},append(...items){this.children.push(...items);},appendChild(item){this.children.push(item);},replaceChildren(...items){this.children=items;}});
  const ctx=vm.createContext({URL,document:{createElement:makeNode,createDocumentFragment:()=>makeNode("fragment"),createTextNode:text=>({tag:"#text",text})}});
  vm.runInContext(extract(browser,"function appendLink(","function getGifUrlFromText("),ctx);
  vm.runInContext(extract(browser,"function orivaneInline(","function orivaneMarkdown("),ctx);
  const target=makeNode("div");ctx.orivaneStreamPreview(target,"**Bold** *italic* ~~old~~");
  const tags=target.children[0].children.map(n=>n.tag);
  assert.ok(tags.includes("strong"));assert.ok(tags.includes("em"));assert.ok(tags.includes("del"));
  assert.equal(ctx.orivanePlainText("**Bold** *italic* ~~old~~"),"Bold italic old");
  assert.equal(ctx.orivanePlainText("\x60**literal**\x60"),"**literal**");
  assert.equal(ctx.orivanePlainText("[Read more](https://example.com)"),"Read more (https://example.com)");
});
check("Clarification card hides raw protocol and accepts empty choices",()=>{
  const ctx=vm.createContext({});
  vm.runInContext(extract(browser,"function orivaneParseCard(","function orivaneReadableReply("),ctx);
  const question="Could you tell me what you’re referring to with “7” – a number, a device (like iPhone 7), a software version, or something else?";
  const raw="[ORIVANE_CARD]"+JSON.stringify({type:"clarification",question,options:[]})+"[/ORIVANE_CARD]";
  const result=ctx.orivaneParseCard(raw);
  assert.equal(result.text,"");assert.equal(result.card.question,question);assert.equal(result.card.options.length,0);assert.equal(result.invalid,false);
  assert.equal(ctx.orivaneParseCard(raw.slice(0,-12),true).text,"");
  assert.equal(ctx.orivaneParseCard(raw,true).card.type,"clarification");
  assert.equal(ctx.orivaneParseCard("[ORIVANE_CARD]{bad}[/ORIVANE_CARD]").invalid,true);
});
check("Live replies use the same rich renderer as saved messages",()=>{
  const source=fs.readFileSync("control-center.js","utf8");
  const original=()=>({rendered:true});
  const window={addMessage:original,sendMessage:async value=>value};
  const ctx=vm.createContext({window,tone:()=>{},$:()=>null});
  vm.runInContext(extract(source,"function installTypingAnimation(","let themeStudio;"),ctx);
  ctx.installTypingAnimation();
  assert.equal(window.addMessage,original);
  assert.equal(window.addMessage("assistant","[ORIVANE_CARD]...").rendered,true);
  assert.equal(window.sendMessage.__orivaneTypingWrapped,true);
  assert.ok(!/window\.addMessage\s*=/.test(source));
});
check("Visible chat watchdog catches raw bold and missing cards",()=>{
  const makeNode=(text,card=false)=>({
    querySelector(selector){if(selector===".assistant-message-content")return {cloneNode(){return {textContent:text,querySelectorAll(){return [];}}}};return card?{}:null;}
  });
  const ctx=vm.createContext({});
  vm.runInContext(extract(browser,"function orivaneParseCard(","function orivaneReadableReply("),ctx);
  vm.runInContext(extract(browser,"function orivaneUnclosedBold(","function orivaneCheckRenderedReply("),ctx);
  assert.deepEqual(Array.from(ctx.orivaneRenderIssues(makeNode("**Bold**"),"**Bold**")),["raw_bold"]);
  assert.equal(ctx.orivaneRenderIssues(makeNode("Bold"),"**Bold**").length,0);
  assert.equal(ctx.orivaneRenderIssues(makeNode("**literal**"),"\x60**literal**\x60").length,0);
  const raw='[ORIVANE_CARD]{"type":"clarification","question":"Which one?","options":[]}[/ORIVANE_CARD]';
  assert.ok(ctx.orivaneRenderIssues(makeNode(raw),raw).includes("missing_card"));
  assert.equal(ctx.orivaneRenderIssues(makeNode("",true),raw).length,0);
});
check("Unclosed bold detected on server and browser; literal code preserved",()=>{
  for(const [source,end] of [[worker,"function orivaneReplyIssues("],[browser,"function orivaneRenderIssues("]]){
    const ctx=vm.createContext({});
    vm.runInContext(extract(source,"function orivaneUnclosedBold(",end),ctx);
    for(const [input,found,expected] of [["**bold...",true,"**bold...**"],["**bold**",false,"**bold**"],["**good** then **unfinished",true,"**good** then **unfinished**"],["*bold**",true,"**bold**"],["**bold*",true,"**bold**"],["\x60**literal\x60",false,"\x60**literal\x60"],["\\**literal",false,"\\**literal"],["2**3",false,"2**3"],["\x60\x60\x60\n**code\n\x60\x60\x60",false,"\x60\x60\x60\n**code\n\x60\x60\x60"]]){
      const r=ctx.orivaneUnclosedBold(input,true);assert.equal(r.found,found);assert.equal(r.text,expected);
    }
  }
  const ctx=vm.createContext({});
  vm.runInContext(extract(worker,"function orivaneUnclosedBold(","function orivaneDiagnosticToken("),ctx);
  assert.ok(ctx.orivaneReplyIssues("**bold...").includes("markdown_unclosed_bold"));
  assert.equal(ctx.orivaneReplyIssues("**bold**").includes("markdown_unclosed_bold"),false);
  assert.ok(browser.includes('codes.push("browser_unclosed_bold")'));
});
try{
  const {webcrypto}=await import("node:crypto");
  const origin="https://jessicaridelle-beep.github.io",secret="fixture-only-not-a-real-admin-password",validToken="A".repeat(43);
  const records=new Map();
  let owner=null;
  const db={prepare(sql){return {run:async()=>({}),bind(...args){return {first:async()=>{if(sql.startsWith("SELECT token_hash")){const expiry=records.get(args[0]);return expiry>args[1]?{token_hash:args[0]}:null;}throw Error("Unexpected test query");}};}}}};
  const ctx=vm.createContext({crypto:webcrypto,encoder:new TextEncoder(),toB64:v=>Buffer.from(v).toString("base64url"),SITE_ORIGIN:origin,currentUser:async()=>owner,Uint8Array});
  vm.runInContext(extract(worker,"function readCookie(","async function allowRateLimit("),ctx);
  vm.runInContext(extract(worker,'const ORIVANE_ADMIN_COOKIE=',"async function verifyStripeSignature("),ctx);
  const env={DB:db,ORIVANE_ADMIN_CODE:secret};
  const request=(cookie="",site=origin)=>new Request("https://example.com",{headers:{Origin:site,Cookie:cookie}});
  assert.equal(await ctx.orivaneAdminCodeMatches(secret,env),true);
  assert.equal(await ctx.orivaneAdminCodeMatches("wrong-code",env),false);
  assert.equal(await ctx.orivaneAdminCodeMatches(secret,{DB:db}),false);
  assert.equal(await ctx.orivaneAdminAccess(request(),env),null);
  const hash=await ctx.orivaneAdminTokenHash(validToken,env);
  const cookie="orivane_admin_session="+validToken;
  records.set(hash,Math.floor(Date.now()/1000)+60);
  assert.equal((await ctx.orivaneAdminAccess(request(cookie),env)).source,"admin");
  assert.equal(await ctx.orivaneAdminAccess(request("orivane_admin_session="+"B".repeat(43)),env),null);
  assert.equal(await ctx.orivaneAdminAccess(request(cookie,"https://untrusted.example"),env),null);
  assert.equal(await ctx.orivaneAdminAccess(request(cookie),{DB:db,ORIVANE_ADMIN_CODE:secret+"-rotated"}),null);
  records.set(hash,0);
  assert.equal(await ctx.orivaneAdminAccess(request(cookie),env),null);
  owner={role:"user",username:"test-user"};
  assert.equal(await ctx.orivaneAdminAccess(request(),env),null);
  owner={role:"owner",username:"test-owner"};
  assert.equal((await ctx.orivaneAdminAccess(request(),env)).source,"owner");
  assert.ok(ctx.orivaneAdminCookie(validToken).includes("HttpOnly; Secure;"));
  const panel=fs.readFileSync("owner-panel.js","utf8");
  assert.ok(panel.includes('await api("admin-login"'));
  assert.ok(panel.includes('await api("admin-session")'));
  assert.ok(!panel.includes('localStorage.getItem("orivane-secret-unlocked-v1")'));
  assert.ok(!panel.includes('window.prompt("Enter the secret code")'));
  checks.push({name:"Admin session rejects forged, expired and wrong-origin access",status:"pass"});
}catch{checks.push({name:"Admin session rejects forged, expired and wrong-origin access",status:"fail"});}
const allowedCodes=new Set(JSON.parse(worker.match(/const ORIVANE_REPORT_CODES = new Set\((\[[^\n]+\])\);/)[1]));
check("Browser diagnostic codes match server allowlist",()=>{
  const browserCodes=JSON.parse(browser.match(/const ORIVANE_BROWSER_CODES=new Set\((\[[^\n]+\])\);/)[1]);
  for(const code of browserCodes)assert.ok(allowedCodes.has(code),code);
  assert.ok(allowedCodes.has("image_quota"));assert.ok(allowedCodes.has("browser_render_unresolved"));
});
check("Report card loads scheduled and live data independently",()=>{
  const panel=fs.readFileSync("owner-panel.js","utf8");
  assert.ok(panel.includes("Promise.allSettled"));assert.ok(panel.includes('api("orivane-report")'));assert.ok(panel.includes("Bot list · recorded events"));assert.ok(panel.includes("scheduledRuntimeStatus"));
});
check("Automatic cache repair is scoped and idempotent",()=>{
  const result=spawnSync(process.execPath,["--input-type=module","-e",'import { selfTest } from "./scripts/orivane-auto-repair.mjs"; selfTest();'],{encoding:"utf8"});
  assert.equal(result.status,0);
});
check("GitHub report identity rejects wrong repository, workflow and expired claims",()=>{
 const ctx=vm.createContext({});
 vm.runInContext(extract(worker,"const ORIVANE_REPORT_ISSUER=","function orivaneDecodeJwt("),ctx);
 const now=1800000000,repo="jessicaridelle-beep/Nexus-ai";
 const claims={iss:"https://token.actions.githubusercontent.com",aud:"orivane-diagnostics-read",repository_id:"1443488586",repository:repo,ref:"refs/heads/main",workflow_ref:repo+"/.github/workflows/orivane-diagnostics.yml@refs/heads/main",event_name:"schedule",runner_environment:"github-hosted",exp:now+300,nbf:now-5,iat:now-5};
 assert.ok(ctx.orivaneReportClaimsValid(claims,now));
 for(const bad of [{repository_id:"0"},{workflow_ref:"wrong"},{ref:"refs/heads/other"},{event_name:"pull_request"},{aud:"wrong"},{exp:now-1}])assert.equal(ctx.orivaneReportClaimsValid({...claims,...bad},now),false);
});
const modes=new Set(["fast","thinking","pro","unknown"]);
let runtimeStatus="not_configured",runtime=[],runtimeDetail="no_credentials";
async function readRuntime(token,method){
 try{
   const response=await fetch("https://nexus-ai-api.jessicaridelle.workers.dev/?action=orivane-report",{headers:{Authorization:"Bearer "+token},signal:AbortSignal.timeout(15000),redirect:"error"});
   if(!response.ok){runtimeStatus="unavailable";runtimeDetail=method+"_http_"+response.status;return false;}
   const result=await response.json();
   if(result.name!=="Orivane-report"||result.schema!==1||!Array.isArray(result.runtime)){runtimeStatus="unavailable";runtimeDetail=method+"_invalid_response";return false;}
   runtime=result.runtime.slice(0,4000).filter(r=>r&&allowedCodes.has(r.code)&&modes.has(r.mode)&&/^\d{4}-\d{2}-\d{2}$/.test(r.day)&&Number.isSafeInteger(r.count)&&r.count>0).map(({day,code,mode,count})=>({day,code,mode,count}));
   runtimeStatus="received";runtimeDetail=method+"_verified";return true;
 }catch{runtimeStatus="unavailable";runtimeDetail=method+"_network_error";return false;}
}
const legacyToken=process.env.ORIVANE_REPORT_TOKEN||"";
if(legacyToken)await readRuntime(legacyToken,"legacy");
if(runtimeStatus!=="received"&&process.env.ACTIONS_ID_TOKEN_REQUEST_URL&&process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN){
 try{
   const url=new URL(process.env.ACTIONS_ID_TOKEN_REQUEST_URL);
   url.searchParams.set("audience","orivane-diagnostics-read");
   const response=await fetch(url,{headers:{Authorization:"Bearer "+process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN},redirect:"error",signal:AbortSignal.timeout(10000)});
   if(!response.ok){runtimeStatus="authentication_unavailable";runtimeDetail="oidc_token_http_"+response.status;}
   else {
    const data=await response.json();
    if(typeof data.value!=="string"||data.value.length>16000)throw Error();
    await readRuntime(data.value,"oidc");
   }
 }catch{runtimeStatus="authentication_unavailable";runtimeDetail="oidc_token_error";}
}
let autoRepair={status:"not_run",repairs:[]};
if(process.env.ORIVANE_REPAIR_REPORT){
 try{
  const result=JSON.parse(fs.readFileSync(process.env.ORIVANE_REPAIR_REPORT,"utf8"));
  if(!["failed","proposed","no_changes"].includes(result.status)||!Array.isArray(result.repairs))throw Error();
  autoRepair={status:result.status,repairs:result.repairs.filter(r=>["cache_version","cache_missing"].includes(r.kind)&&/^[A-Za-z0-9_-]+\.(js|css)$/.test(r.file)&&(r.from==="missing"||/^\d+$/.test(r.from))&&/^\d+$/.test(r.to)).slice(0,100)};
 }catch{autoRepair={status:"unavailable",repairs:[]};}
}
let browserChecks={status:"not_run",passed:0,failed:0,skipped:0,checks:[]};
if(process.env.ORIVANE_BROWSER_REPORT){
  try{
    const browserReport=JSON.parse(fs.readFileSync(process.env.ORIVANE_BROWSER_REPORT,"utf8"));
    if(!Array.isArray(browserReport.checks)||!browserReport.checks.length)throw Error();
    const results=browserReport.checks.slice(0,100).map(c=>{
      if(!c||typeof c.name!=="string"||!["pass","fail","skip"].includes(c.status))throw Error();
      return {name:c.name.slice(0,180),status:c.status,...(typeof c.code==="string"&&/^[a-z_]+$/.test(c.code)?{code:c.code}:{}),...(typeof c.stage==="string"&&/^[a-z_]{1,60}$/.test(c.stage)?{stage:c.stage}:{})};
    });
    browserChecks={status:"completed",passed:results.filter(c=>c.status==="pass").length,failed:results.filter(c=>c.status==="fail").length,skipped:results.filter(c=>c.status==="skip").length,checks:results};
  }catch{
    browserChecks={status:"unavailable",passed:0,failed:1,skipped:0,checks:[{name:"Browser test report unavailable",status:"fail",code:"report_missing"}]};
  }
}
const failed=checks.filter(c=>c.status==="fail").length;
const report={name:"Orivane-report",schema:1,generatedAt:new Date().toISOString(),commit:spawnSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).stdout?.trim()||process.env.GITHUB_SHA||null,codeChecks:{passed:checks.length-failed,failed,checks},browserChecks,autoRepair,runtimeStatus,runtimeDetail,runtime,privacy:"Aggregate diagnostic codes only. No chat messages, user identities, IP addresses, API keys, or raw exception messages.",limits:"Syntax and targeted smoke tests cannot detect every logic bug or verify every factual answer. Runtime counts require authenticated read-only access. Automatic source repair is limited to verified local cache entries and versions; other bugs require review."};
fs.writeFileSync("Orivane-report.json",JSON.stringify(report,null,2)+"\n");
console.log("ORIVANE code checks:",checks.length-failed,"passed;",failed,"failed. Runtime report:",runtimeStatus);
if(failed||browserChecks.failed)process.exitCode=1;
