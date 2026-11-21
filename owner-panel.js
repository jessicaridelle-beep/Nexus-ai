/* ORIVANE Personal + Owner Admin Center.
   Local appearance/preferences stay in this browser.
   Shared AI policy and website change notes require the authenticated owner account. */
(()=> {
"use strict";
const API="https://nexus-ai-api.jessicaridelle.workers.dev/",KEY="orivane-personal-admin-v1",CHANGE_KEY="orivane-website-change-log-v1";
const defaults={appName:"ORIVANE",assistantName:"ORIVANE",accent:"#ff8a32",welcome:"Where will your curiosity take you?",instructions:"",defaultMode:"fast",model:"auto",temperature:.6,maxTokens:1200,research:false,websiteNotes:""};
const $=id=>document.getElementById(id);
const read=()=>{try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return {...defaults}}};
let cfg=read(),overlay=null,globalData={instructions:"",changeLog:""};
function node(tag,attrs={},txt){const n=document.createElement(tag);for(const [k,v] of Object.entries(attrs)){if(k==="class")n.className=v;else n.setAttribute(k,v)}if(txt!==undefined)n.textContent=txt;return n}
function input(parent,label,type,value,attrs={}){const l=node("label",{class:"admin-field"});l.append(node("span",{},label));const x=node(type==="textarea"?"textarea":"input",type==="textarea"?attrs:{type,...attrs});x.value=value;l.append(x);parent.append(l);return x}
function recordChange(summary){try{const list=JSON.parse(localStorage.getItem(CHANGE_KEY)||"[]");list.unshift({at:new Date().toISOString(),summary:String(summary).slice(0,220)});localStorage.setItem(CHANGE_KEY,JSON.stringify(list.slice(0,20)))}catch{}}
function apply(){
 document.documentElement.style.setProperty("--accent",cfg.accent);document.documentElement.style.setProperty("--accent2",cfg.accent);
 const brand=document.querySelector(".brand");if(brand){brand.setAttribute("aria-label",cfg.appName);const label=brand.querySelector(":scope > span:last-child");if(label)label.textContent=cfg.appName}
 document.title=cfg.appName+" — Personal AI Workspace";
 const h=document.querySelector("#welcome h1");if(h)h.textContent=cfg.welcome;
 document.querySelectorAll(".assistant-message .message-body>b").forEach(x=>x.textContent=cfg.assistantName+" 🟠");
}
async function api(action,options={}){const r=await fetch(API+"?action="+encodeURIComponent(action),{credentials:"include",cache:"no-store",...options});let d={};try{d=await r.json()}catch{}if(!r.ok)throw new Error(d.error||"Request failed ("+r.status+").");return d}
async function ownerStatus(){const d=await api("auth-me");const user=d.authenticated?d.user:null;if(user?.role==="owner")return {user,ownerInfo:null};let ownerInfo=null;try{ownerInfo=await api("auth-owner-status")}catch{}return {user,ownerInfo}}
function open(){
 if(overlay){overlay.hidden=false;return}
 overlay=node("div",{class:"owner-overlay"});const card=node("section",{class:"owner-card admin-card",role:"dialog","aria-modal":"true"});
 const close=node("button",{class:"owner-close",type:"button","aria-label":"Close"},"×");close.onclick=()=>overlay.hidden=true;
 const head=node("div",{class:"owner-head"}),intro=node("div");
 intro.append(node("div",{class:"owner-kicker"},"ORIVANE · ADMIN CONTROL CENTER"),node("h2",{class:"owner-title"},"Control Center"),node("p",{class:"owner-sub"},"Appearance and personal AI settings are local. Global AI controls are available only to the authenticated owner account."));
 head.append(intro,close);card.append(head);
 const tabs=node("div",{class:"admin-tabs"}),content=node("div",{class:"admin-content"});card.append(tabs,content);overlay.append(card);overlay.onclick=e=>{if(e.target===overlay)overlay.hidden=true};document.body.append(overlay);
 let active="Overview";const names=["Overview","Appearance","AI controls","Global AI","Visitors","Admin Lab"];
 function render(){
  tabs.replaceChildren();names.forEach(name=>{const b=node("button",{type:"button",class:name===active?"active":""},name);b.onclick=()=>{active=name;render()};tabs.append(b)});content.replaceChildren();
  if(active==="Overview"){
   const grid=node("div",{class:"owner-grid"});
   [["LOCAL NAME",cfg.appName,"Only this browser"],["DEFAULT MODE",cfg.defaultMode.toUpperCase(),"Your preferred response mode"],["MODEL",cfg.model==="auto"?"Automatic":cfg.model.toUpperCase(),"Configured model routing"],["GLOBAL POLICY","Owner protected","Applies to every visitor after saving"]].forEach(([a,b,c])=>{const t=node("article",{class:"owner-tile"});t.append(node("small",{},a),node("strong",{},b),node("p",{},c));grid.append(t)});
   content.append(grid,node("p",{class:"owner-foot"},"The AI receives your current local website settings on your messages. Shared website notes and global AI instructions are loaded securely by the Worker for every visitor."));
  }
  if(active==="Appearance"){
   const form=node("div",{class:"admin-form"});
   const app=input(form,"Website / interface name","text",cfg.appName,{maxlength:"32"});
   const assistant=input(form,"Assistant display name","text",cfg.assistantName,{maxlength:"32"});
   const accent=input(form,"Accent colour","color",cfg.accent);
   const welcome=input(form,"Welcome headline","textarea",cfg.welcome,{rows:"2",maxlength:"100"});
   const actions=node("div",{class:"admin-inline-actions"});
   const reset=node("button",{class:"owner-secondary",type:"button"},"↺ Reset names");
   reset.onclick=()=>{cfg.appName=defaults.appName;cfg.assistantName=defaults.assistantName;app.value=cfg.appName;assistant.value=cfg.assistantName;localStorage.setItem(KEY,JSON.stringify(cfg));apply();recordChange("Reset the local website and assistant display names to ORIVANE.");reset.textContent="Names reset ✓"};
   const save=node("button",{class:"owner-primary",type:"button"},"Save appearance");
   save.onclick=()=>{
    const oldName=cfg.appName,oldAssistant=cfg.assistantName;
    cfg.appName=app.value.trim().slice(0,32)||defaults.appName;
    cfg.assistantName=assistant.value.trim().slice(0,32)||defaults.assistantName;
    cfg.accent=/^#[\\da-f]{6}$/i.test(accent.value)?accent.value:defaults.accent;
    cfg.welcome=welcome.value.trim().slice(0,100)||defaults.welcome;
    localStorage.setItem(KEY,JSON.stringify(cfg));apply();
    const changes=[];if(oldName!==cfg.appName)changes.push("local interface name: "+cfg.appName);if(oldAssistant!==cfg.assistantName)changes.push("local assistant label: "+cfg.assistantName);changes.push("local accent colour or welcome headline updated");
    recordChange("Appearance settings changed — "+changes.join("; "));
    save.textContent="Saved on this device ✓";
   };
   actions.append(reset,save);form.append(node("p",{class:"owner-foot"},"These changes affect this browser only, not the public branding for other visitors."),actions);content.append(form);
  }
  if(active==="AI controls"){
   const form=node("div",{class:"admin-form"}),modeLabel=node("label",{class:"admin-field"});modeLabel.append(node("span",{},"Default response mode"));
   const mode=node("select");[["fast","Fast"],["thinking","Thinking"],["pro","Pro"]].forEach(([v,t])=>mode.append(node("option",{value:v},t)));mode.value=cfg.defaultMode;modeLabel.append(mode);form.append(modeLabel);
   const modelLabel=node("label",{class:"admin-field"});modelLabel.append(node("span",{},"AI model"));const model=node("select");[["auto","Automatic"],["fast","GLM 4.7 Flash"],["thinking","GPT-OSS 20B"],["pro","GPT-OSS 120B"]].forEach(([v,t])=>model.append(node("option",{value:v},t)));model.value=cfg.model;modelLabel.append(model);form.append(modelLabel);
   const temp=input(form,"Creativity (0–1.2)","number",cfg.temperature,{min:"0",max:"1.2",step:".1"});
   const tokens=input(form,"Maximum answer length (256–2000 tokens)","number",cfg.maxTokens,{min:"256",max:"2000",step:"64"});
   const instructions=input(form,"Personal AI instructions","textarea",cfg.instructions,{rows:"4",maxlength:"1200",placeholder:"How should the AI respond on this device?"});
   const checkLabel=node("label",{class:"admin-check"}),check=node("input",{type:"checkbox"});check.checked=cfg.research;checkLabel.append(check,node("span",{},"Enable research mode by default"));form.append(checkLabel,node("p",{class:"owner-foot"},"These preferences apply only to your browser. Use Global AI for rules shared with every visitor."));
   const save=node("button",{class:"owner-primary",type:"button"},"Save personal AI settings");
   save.onclick=()=>{cfg.defaultMode=["fast","thinking","pro"].includes(mode.value)?mode.value:"fast";cfg.model=["auto","fast","thinking","pro"].includes(model.value)?model.value:"auto";cfg.temperature=Math.max(0,Math.min(1.2,Number(temp.value)||0));cfg.maxTokens=Math.max(256,Math.min(2000,Number(tokens.value)||1200));cfg.instructions=instructions.value.slice(0,1200);cfg.research=check.checked;localStorage.setItem(KEY,JSON.stringify(cfg));localStorage.setItem("orivane-response-mode",cfg.defaultMode);apply();window.dispatchEvent(new Event("orivane-admin-settings-updated"));recordChange("Personal AI preferences updated: mode "+cfg.defaultMode+", model "+cfg.model+", research "+(cfg.research?"on":"off")+".");save.textContent="Saved on this device ✓"};
   form.append(save);content.append(form);
  }
  if(active==="Global AI")renderGlobal();
  if(active==="Admin Lab"){
   const grid=node("div",{class:"owner-grid"});
   const stats=[["BROWSER",navigator.userAgent],["SCREEN",window.screen.width+" × "+window.screen.height],["VIEWPORT",window.innerWidth+" × "+window.innerHeight],["STORAGE",(()=>{let bytes=0;for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)||"";if(k.startsWith("orivane-"))bytes+=(k.length+(localStorage.getItem(k)||"").length)*2;}return (bytes/1024).toFixed(1)+" KB · ORIVANE data"})()]];
   stats.forEach(([label,value])=>{const tile=node("article",{class:"owner-tile"});tile.append(node("small",{},label),node("strong",{},String(value)),node("p",{},"Local device diagnostic"));grid.append(tile)});
   content.append(grid);
   const status=node("p",{class:"owner-status"},"Admin Lab tools affect this browser only. They do not change server permissions or other visitors' settings.");content.append(status);
   const actions=node("div",{class:"admin-inline-actions"});
   const diagnostics=node("button",{class:"owner-primary",type:"button"},"Run diagnostics");
   diagnostics.onclick=()=>{const checks=[["Local storage",(()=>{try{const k="orivane-diagnostic-test";localStorage.setItem(k,"ok");localStorage.removeItem(k);return "OK"}catch{return "Unavailable"}})()],["Chat history",(()=>{try{const v=JSON.parse(localStorage.getItem("orivane-chat-history-v1")||"[]");return Array.isArray(v)?v.length+" saved":"Invalid format"}catch{return "Unreadable"}})()],["Projects",(()=>{try{const v=JSON.parse(localStorage.getItem("orivane-projects-v1")||"[]");return Array.isArray(v)?v.length+" saved":"Invalid format"}catch{return "Unreadable"}})()],["API reachability","See Control Center health check"]];status.textContent=checks.map(x=>x[0]+": "+x[1]).join(" · ");};
   const randomTheme=node("button",{class:"owner-secondary",type:"button"},"✦ Random accent");
   randomTheme.onclick=()=>{const colours=["#ff8a32","#48a9ff","#a78bfa","#50c99a","#ff6b9d","#e8c547","#24c8b5"];cfg.accent=colours[Math.floor(Math.random()*colours.length)];localStorage.setItem(KEY,JSON.stringify(cfg));apply();recordChange("Admin Lab generated a random local accent colour.");status.textContent="New accent applied: "+cfg.accent;};
   const focus=node("button",{class:"owner-secondary",type:"button"},"◉ Toggle focus mode");
   focus.onclick=()=>{const enabled=!document.body.classList.contains("orivane-focus-mode");document.body.classList.toggle("orivane-focus-mode",enabled);let css=document.getElementById("orivaneFocusStyle");if(!css){css=node("style",{id:"orivaneFocusStyle"},"body.orivane-focus-mode .sidebar,body.orivane-focus-mode .topbar,body.orivane-focus-mode .tool-dock{opacity:.18;transition:opacity .2s}body.orivane-focus-mode .sidebar:hover,body.orivane-focus-mode .topbar:hover,body.orivane-focus-mode .tool-dock:hover{opacity:1}");document.head.append(css);}focus.textContent=enabled?"◉ Exit focus mode":"◉ Toggle focus mode";status.textContent=enabled?"Focus mode enabled. Hover navigation areas to reveal them.":"Focus mode disabled.";};
   const easter=node("button",{class:"owner-secondary",type:"button"},"🎲 Surprise me");
   easter.onclick=()=>{const lines=["ORIVANE is now running on pure curiosity.","Orange energy protocol: activated.","Secret level unlocked: you found the Admin Lab.","Today's mission: build something brilliant.","System status: dangerously creative."];status.textContent=lines[Math.floor(Math.random()*lines.length)];};
   const backup=node("button",{class:"owner-secondary",type:"button"},"⇧ Workspace backup");
   backup.onclick=()=>{const b=document.getElementById("orivaneBackupOpen");if(b)b.click();else status.textContent="Open Workspace backup from the chat tools.";};
   const compare=node("button",{class:"owner-secondary",type:"button"},"⇄ Compare answers");
   compare.onclick=()=>{const b=document.getElementById("orivaneCompareOpen");if(b)b.click();else status.textContent="Open Compare answers from the chat tools.";};
   actions.append(diagnostics,randomTheme,focus,easter,backup,compare);content.append(actions);
   content.append(node("p",{class:"owner-foot"},"Admin Lab is a local toolbox: diagnostics, random accent generator, focus mode, surprise messages, workspace backup and answer comparison. Global AI settings remain protected by authenticated owner access."));
  }
  if(active==="Visitors"){
   const grid=node("div",{class:"owner-grid"}),a=node("article",{class:"owner-tile"}),b=node("article",{class:"owner-tile"});
   a.append(node("small",{},"VISITORS ACTIVE NOW"),node("strong",{id:"visitorActive"},"Loading…"),node("p",{},"Approximate anonymous sessions active in the last 90 seconds"));
   b.append(node("small",{},"UNIQUE BROWSERS · 24H"),node("strong",{id:"visitorDay"},"Loading…"),node("p",{},"Approximate unique browser IDs active in the last 24 hours"));
   grid.append(a,b);content.append(grid);const refresh=node("button",{class:"owner-primary",type:"button"},"↻ Refresh visitor count");refresh.onclick=refreshVisitors;content.append(refresh,node("p",{class:"owner-foot"},"The counter uses random browser IDs and timestamps only; no names, emails or chat contents are collected."));refreshVisitors();
  }
 }
 async function renderGlobal(){
  const form=node("div",{class:"admin-form"});content.append(node("p",{class:"owner-foot"},"Global instructions affect ORIVANE for every visitor, including you. Only the account assigned Admin access can read or change these settings."));
  const status=node("p",{class:"owner-status"},"Checking owner access…");content.append(status);
  try{
   const access=await ownerStatus();const user=access.user;if(!user||user.role!=="owner"){const ownerName=access.ownerInfo?.ownerUsername;status.textContent=!user?(ownerName?"Not signed in. Global AI belongs to the owner account: "+ownerName+".":"Not signed in. Sign in with the account assigned as the ORIVANE owner."):(ownerName?"Signed in as "+user.username+", but Global AI is assigned to the owner account: "+ownerName+".":"Signed in as "+user.username+", but this account does not have the owner role.");status.classList.add("error");const signIn=node("button",{class:"owner-primary",type:"button"},user?"Switch account / sign in":"Open sign in");signIn.onclick=()=>{const profile=document.getElementById("profileOpen");if(profile)profile.click();else status.textContent="Open Profile / Sign in from the sidebar, then return to Global AI."};content.append(signIn);return}
   const data=await api("global-ai-settings");globalData={instructions:data.instructions||"",changeLog:data.changeLog||""};
   const instructions=input(form,"Global AI instructions","textarea",globalData.instructions,{rows:"6",maxlength:"4000",placeholder:"Set ORIVANE's shared tone, response rules, and priorities for everyone…"});
   const notes=input(form,"Shared website change log / site notes","textarea",globalData.changeLog,{rows:"7",maxlength:"8000",placeholder:"Describe website changes, new features, removed features, important UI behaviour, and how they work. ORIVANE receives these notes in every visitor's chat."});
   const note=node("p",{class:"owner-foot"},"Website source files are also read from the public GitHub repository when users ask about the website, code, features, or updates. Put important changes here so ORIVANE can understand them immediately, even if a question is not specifically about code. Do not put passwords, API keys, or private data here.");
   const save=node("button",{class:"owner-primary",type:"button"},"Save global AI settings");
   save.onclick=async()=>{save.disabled=true;status.textContent="Saving shared settings…";try{const result=await api("global-ai-settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({instructions:instructions.value,changeLog:notes.value})});globalData={instructions:result.instructions||"",changeLog:result.changeLog||""};recordChange("Shared global AI instructions / website change notes updated.");status.textContent="Saved globally ✓ These settings now apply to all visitors, including you.";status.classList.remove("error");status.classList.add("success");save.textContent="Saved globally ✓"}catch(e){status.textContent=e.message;status.classList.add("error")}finally{save.disabled=false}};
   form.append(note,save);content.append(form);status.textContent="Signed in as "+user.username+" · Owner access verified.";
  }catch(e){status.textContent=e.message;status.classList.add("error")}
 }
 render();
}
async function refreshVisitors(){try{let id=localStorage.getItem("orivane-anon-visitor-id");if(!id){id=crypto.randomUUID();localStorage.setItem("orivane-anon-visitor-id",id)}await fetch(API+"?action=visitor-heartbeat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({visitorId:id})});const r=await fetch(API+"?action=visitor-stats",{cache:"no-store"});if(!r.ok)throw Error();const d=await r.json();if($("visitorActive"))$("visitorActive").textContent=d.activeNow??"—";if($("visitorDay"))$("visitorDay").textContent=d.visits24h??"—"}catch{if($("visitorActive"))$("visitorActive").textContent="Unavailable";if($("visitorDay"))$("visitorDay").textContent="Unavailable"}}
function heartbeat(){let id=localStorage.getItem("orivane-anon-visitor-id");if(!id){id=crypto.randomUUID();localStorage.setItem("orivane-anon-visitor-id",id)}fetch(API+"?action=visitor-heartbeat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({visitorId:id})}).catch(()=>{})}
apply();
let ownerAuthRenderVersion=0;
function installOwnerEntry(){
 const unlocked=localStorage.getItem("orivane-secret-unlocked-v1")==="1";
 const profile=$("profileOpen"),sidebar=$("sidebar");
 $("adminPanelOpen")?.remove();$("adminPanelSidebarOpen")?.remove();
 delete window.ORIVANE_ADMIN_PANEL;
 if(!unlocked)return;
 if(profile){
  const top=node("button",{type:"button",id:"adminPanelOpen",class:"header-action"},"♛ Admin Panel");
  top.onclick=open;profile.after(top);
 }
 if(sidebar){
  const side=node("button",{type:"button",id:"adminPanelSidebarOpen",class:"secret-unlock admin-sidebar-entry"},"♛ Open Admin Panel");
  side.onclick=open;
  const secret=$("secretUnlock");if(secret)secret.after(side);else sidebar.append(side);
 }
 // The local panel is unlocked by the phrase; privileged server actions still
 // independently verify the authenticated owner role via ownerStatus().
 window.ORIVANE_ADMIN_PANEL={open};
}
function installSecretUnlock(){
 const sidebar=$("sidebar");
 if(!sidebar)return;
 let button=$("secretUnlock");
 if(!button){
  button=node("button",{type:"button",id:"secretUnlock",class:"secret-unlock"},"⌁ Secret");
  button.setAttribute("aria-label","Unlock the hidden admin panel entry");
  button.onclick=()=>{
   const entered=window.prompt("Enter the secret code");
   if(entered===null)return;
   if(entered!=="categorised under 14"){window.alert("Incorrect secret code.");return}
   localStorage.setItem("orivane-secret-unlocked-v1","1");
   button.textContent="✓ Secret unlocked";
   installOwnerEntry();
   window.alert("Secret accepted. Admin Panel is unlocked. Global AI and server-side controls still require owner sign-in.");
  };
  sidebar.append(button);
 }
 if(localStorage.getItem("orivane-secret-unlocked-v1")==="1")button.textContent="✓ Secret unlocked";
}
installSecretUnlock();
installOwnerEntry();
window.addEventListener("orivane-auth-updated",installOwnerEntry);
heartbeat();setInterval(heartbeat,30000);
})();