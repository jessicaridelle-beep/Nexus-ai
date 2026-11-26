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
  for(const file of ["script.js","owner-panel.js","style.css"]){
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
  vm.runInContext(extract(worker,"function orivaneReplyIssues(","function orivaneDiagnosticToken("),ctx);
  const checkReply=text=>Array.from(ctx.orivaneReplyIssues(text));
  assert.deepEqual(checkReply(""),["empty_reply"]);
  assert.deepEqual(checkReply("The AI stream returned an empty response."),["error_reply"]);
  assert.deepEqual(checkReply("Hello! 🔑"),[]);
  assert.deepEqual(checkReply("[ORIVANE_CARD]{bad}[/ORIVANE_CARD]"),["invalid_card"]);
  assert.deepEqual(checkReply('[ORIVANE_CARD]{"type":"poll","question":"Pick","options":["A","B"]}[/ORIVANE_CARD]'),[]);
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
  assert.ok(browser.includes('orivaneBrowserReport(["browser_empty_stream"])'));
  assert.ok(browser.includes("requestAI(false)"));
  assert.ok(worker.includes('["empty_stream"]'));
  assert.ok(worker.includes("orivaneReportRecord"));
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
const allowedCodes=new Set(["reply_checked","empty_reply","empty_stream","stream_interrupted","malformed_stream","error_reply","invalid_card","model_failure","web_unavailable","web_billing_required","web_no_results","website_unavailable","image_failure","browser_empty_stream","browser_retry_ok","browser_retry_failed","browser_reply_error","browser_invalid_card","browser_runtime_error","browser_network_error","browser_reply_checked"]);
const modes=new Set(["fast","thinking","pro","unknown"]);
let runtimeStatus="not_configured",runtime=[];
if(process.env.ORIVANE_REPORT_TOKEN){
  try{
    const response=await fetch("https://nexus-ai-api.jessicaridelle.workers.dev/?action=orivane-report",{headers:{Authorization:"Bearer "+process.env.ORIVANE_REPORT_TOKEN},signal:AbortSignal.timeout(15000),redirect:"error"});
    if(!response.ok)throw Error();
    const result=await response.json();
    if(result.name!=="Orivane-report"||result.schema!==1||!Array.isArray(result.runtime))throw Error();
    runtime=result.runtime.slice(0,4000).filter(r=>r&&allowedCodes.has(r.code)&&modes.has(r.mode)&&/^\d{4}-\d{2}-\d{2}$/.test(r.day)&&Number.isSafeInteger(r.count)&&r.count>0).map(({day,code,mode,count})=>({day,code,mode,count}));
    runtimeStatus="received";
  }catch{runtimeStatus="unavailable";}
}
const failed=checks.filter(c=>c.status==="fail").length;
const report={name:"Orivane-report",schema:1,generatedAt:new Date().toISOString(),commit:process.env.GITHUB_SHA||null,codeChecks:{passed:checks.length-failed,failed,checks},runtimeStatus,runtime,privacy:"Aggregate diagnostic codes only. No chat messages, user identities, IP addresses, API keys, or raw exception messages.",limits:"Syntax and targeted smoke tests cannot detect every logic bug or verify every factual answer. Runtime counts require the read-only report token."};
fs.writeFileSync("Orivane-report.json",JSON.stringify(report,null,2)+"\n");
console.log("ORIVANE code checks:",checks.length-failed,"passed;",failed,"failed. Runtime report:",runtimeStatus);
if(failed)process.exitCode=1;
