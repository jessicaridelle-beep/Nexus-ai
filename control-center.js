/* ORIVANE Control Center — local-first widgets, themes, organisation and optional sounds */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const safeRead=(key,fallback)=>{try{const value=JSON.parse(localStorage.getItem(key)||"null");return value??fallback;}catch{return fallback;}};
const safeWrite=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
const HISTORY_KEY="orivane-chat-history-v1",FOLDER_KEY="orivane-chat-folders-v1",THEME_KEY="orivane-theme-preset-v1",SOUND_KEY="orivane-sounds-enabled";
const themes={
 ember:{name:"Ember",swatch:"linear-gradient(120deg,#090b12,#ff8a32)",vars:["#090b12","#10141e","#131927","#f4f5fa","#929bad","#ff8a32","#ffc16e","rgba(188,200,226,.13)","rgba(0,0,0,.22)"]},
 arctic:{name:"Arctic",swatch:"linear-gradient(120deg,#f2f7fd,#3988d8)",vars:["#edf2f8","#ffffff","#e3ebf5","#182233","#65748a","#2676d2","#6eb5ff","rgba(36,63,96,.15)","rgba(35,55,80,.12)"]},
 violet:{name:"Nebula",swatch:"linear-gradient(120deg,#100d1b,#a78bfa)",vars:["#0d0b16","#171326","#211a35","#f5f0ff","#a99fbd","#a78bfa","#d5b8ff","rgba(205,180,255,.15)","rgba(0,0,0,.28)"]},
 forest:{name:"Forest",swatch:"linear-gradient(120deg,#0a1512,#50c99a)",vars:["#09130f","#101e18","#16271f","#effaf3","#94aa9c","#50c99a","#a4edc9","rgba(174,225,195,.14)","rgba(0,0,0,.25)"]}
};
let audioContext=null;
function soundEnabled(){return localStorage.getItem(SOUND_KEY)==="true";}
function tone(kind="tap"){
 if(!soundEnabled())return;
 try{
  const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;
  audioContext=audioContext||new Ctx();if(audioContext.state==="suspended")audioContext.resume();
  const osc=audioContext.createOscillator(),gain=audioContext.createGain(),now=audioContext.currentTime;
  osc.type="sine";osc.frequency.setValueAtTime(kind==="reply"?660:kind==="send"?440:520,now);
  osc.frequency.exponentialRampToValueAtTime(kind==="reply"?880:kind==="send"?520:620,now+.075);
  gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.035,now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+.11);
  osc.connect(gain);gain.connect(audioContext.destination);osc.start(now);osc.stop(now+.12);
 }catch{}
}
function applyTheme(key){
 const theme=themes[key]||themes.ember,vars=theme.vars,style=document.body.style;
 ["--bg","--panel","--panel2","--text","--muted","--accent","--accent2","--line","--shadow"].forEach((name,i)=>style.setProperty(name,vars[i]));
 document.body.dataset.orivaneTheme=key;document.body.classList.toggle("light",key==="arctic");
 localStorage.setItem(THEME_KEY,key);
 document.querySelectorAll(".orivane-theme-choice").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.theme===key)));
 const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=vars[0];
}
function buildThemeStudio(){
 const overlay=document.createElement("div");overlay.className="orivane-control-overlay";overlay.id="orivaneThemeOverlay";overlay.hidden=true;
 const modal=document.createElement("section");modal.className="orivane-control-modal";modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.setAttribute("aria-labelledby","orivaneThemeTitle");
 const close=document.createElement("button");close.className="orivane-control-close";close.type="button";close.textContent="×";close.setAttribute("aria-label","Close theme studio");
 const title=document.createElement("h2");title.id="orivaneThemeTitle";title.textContent="Theme studio";
 const intro=document.createElement("p");intro.textContent="Choose a colour system for this device. Your selection is saved locally.";
 const grid=document.createElement("div");grid.className="orivane-theme-grid";
 Object.entries(themes).forEach(([key,t])=>{const b=document.createElement("button");b.type="button";b.className="orivane-theme-choice";b.dataset.theme=key;b.setAttribute("aria-pressed","false");const sw=document.createElement("span");sw.className="orivane-theme-swatch";sw.style.background=t.swatch;const name=document.createElement("span");name.textContent=t.name;b.append(sw,name);b.addEventListener("click",()=>{applyTheme(key);tone("tap");});grid.append(b);});
 modal.append(close,title,intro,grid);overlay.append(modal);document.body.append(overlay);
 function shut(){overlay.hidden=true;}
 close.addEventListener("click",shut);overlay.addEventListener("click",e=>{if(e.target===overlay)shut();});
 return {open:()=>{overlay.hidden=false;document.querySelectorAll(".orivane-theme-choice").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.theme===document.body.dataset.orivaneTheme)));},close:shut};
}
function buildDashboard(){
 const dashboard=document.createElement("section");dashboard.className="orivane-dashboard";dashboard.id="orivaneDashboard";dashboard.setAttribute("aria-label","ORIVANE dashboard widgets");
 const head=document.createElement("div");head.className="orivane-dashboard-head";
 const heading=document.createElement("div"),h=document.createElement("h2"),sub=document.createElement("p");h.textContent="Control center";sub.textContent="Your workspace at a glance · Local device stats";heading.append(h,sub);
 const clock=document.createElement("div");clock.className="orivane-dashboard-clock";clock.id="orivaneLiveClock";head.append(heading,clock);
 const grid=document.createElement("div");grid.className="orivane-widget-grid";
 const makeWidget=(id,label,value,detail)=>{const card=document.createElement("div");card.className="orivane-widget";const l=document.createElement("span");l.className="orivane-widget-label";l.textContent=label;const v=document.createElement("strong");v.className="orivane-widget-value";v.id=id;v.textContent=value;const d=document.createElement("small");d.className="orivane-widget-detail";d.id=id+"Detail";d.textContent=detail;card.append(l,v,d);grid.append(card);};
 makeWidget("orivaneDate","TODAY","—","Local date");
 makeWidget("orivaneConnection","CONNECTION","Checking…","Browser network status");
 makeWidget("orivaneChatCount","CONVERSATIONS","0 saved","Stored on this device");
 makeWidget("orivaneProjectCount","PROJECTS","0 saved","Stored on this device");
 const actions=document.createElement("div");actions.className="orivane-widget-actions";
 const action=(label,fn)=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.addEventListener("click",()=>{tone("tap");fn();});actions.append(b);};
 action("＋ New chat",()=>$("newChat")?.click());
 action("⌘ Command centre",()=>openCommandPalette());
 action("🎨 Theme studio",()=>themeStudio.open());
 const sound=document.createElement("button");sound.type="button";sound.id="orivaneSoundToggle";actions.append(sound);
 function updateSoundLabel(){sound.textContent=soundEnabled()?"♪ Sounds: on":"♪ Sounds: off";sound.setAttribute("aria-pressed",String(soundEnabled()));}
 sound.addEventListener("click",()=>{localStorage.setItem(SOUND_KEY,String(!soundEnabled()));updateSoundLabel();if(soundEnabled())tone("tap");});
 updateSoundLabel();dashboard.append(head,grid,actions);
 const anchor=document.querySelector(".chat-shell");if(anchor)anchor.parentNode.insertBefore(dashboard,anchor);
 function tick(){const now=new Date();clock.textContent=now.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"})+" · "+Intl.DateTimeFormat().resolvedOptions().timeZone; $("orivaneDate").textContent=now.toLocaleDateString(undefined,{weekday:"short",day:"numeric",month:"short"});}
 tick();setInterval(tick,1000);
 function updateCounts(){const chats=safeRead(HISTORY_KEY,[]),projects=safeRead("orivane-projects-v1",[]);$("orivaneChatCount").textContent=chats.length+" saved";$("orivaneProjectCount").textContent=projects.length+" saved";}
 updateCounts();setInterval(updateCounts,12000);
 const net=()=>{const online=navigator.onLine;$("orivaneConnection").textContent=online?"Online":"Offline";$("orivaneConnectionDetail").textContent=online?"Browser has network access":"Check your internet connection";};
 window.addEventListener("online",net);window.addEventListener("offline",net);net();
 const apiCheck=async()=>{const value=$("orivaneConnection"),detail=$("orivaneConnectionDetail");if(!navigator.onLine)return;detail.textContent="Checking ORIVANE API…";try{const response=await fetch("https://nexus-ai-api.jessicaridelle.workers.dev/?action=health",{headers:{Accept:"application/json"},cache:"no-store",signal:AbortSignal.timeout?AbortSignal.timeout(7000):undefined});if(!response.ok)throw new Error("Unavailable");value.textContent="Online · API";detail.textContent="Health endpoint reachable; model availability may vary";}catch{value.textContent="Online · API unknown";detail.textContent="Browser is online; API health check did not complete";}};
 apiCheck();setInterval(apiCheck,60000);
 return dashboard;
}
function buildAmbient(){
 if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
 const canvas=document.createElement("canvas");canvas.id="orivaneParticleCanvas";canvas.setAttribute("aria-hidden","true");document.body.prepend(canvas);
 const ctx=canvas.getContext("2d");if(!ctx)return;
 let width=0,height=0,raf=0,particles=[];
 const resize=()=>{const ratio=Math.min(window.devicePixelRatio||1,1.5);width=window.innerWidth;height=window.innerHeight;canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);particles=Array.from({length:Math.min(42,Math.max(18,Math.floor(width*height/36000)))},()=>({x:Math.random()*width,y:Math.random()*height,vx:(Math.random()-.5)*.16,vy:(Math.random()-.5)*.16,r:.7+Math.random()*1.6,a:.12+Math.random()*.22}));};
 const draw=()=>{raf=0;if(document.hidden)return;ctx.clearRect(0,0,width,height);const accent=getComputedStyle(document.body).getPropertyValue("--accent").trim()||"#ff8a32";particles.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>width)p.vx*=-1;if(p.y<0||p.y>height)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=accent;ctx.globalAlpha=p.a;ctx.fill();for(let j=i+1;j<particles.length;j++){const q=particles[j],dx=p.x-q.x,dy=p.y-q.y,dist=Math.hypot(dx,dy);if(dist<105){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.globalAlpha*(1-dist/105);ctx.strokeStyle=accent;ctx.globalAlpha=.045*(1-dist/105);ctx.lineWidth=.7;ctx.stroke();}}});ctx.globalAlpha=1;raf=requestAnimationFrame(draw);};
 const start=()=>{if(!raf&&!document.hidden)raf=requestAnimationFrame(draw);},stop=()=>{if(raf)cancelAnimationFrame(raf);raf=0;};
 resize();start();window.addEventListener("resize",()=>{resize();start();});document.addEventListener("visibilitychange",()=>document.hidden?stop():start());
}
function buildHistoryTools(){
 const box=$("chatHistory");if(!box||box.dataset.organised==="true")return;
 box.dataset.organised="true";
 const tools=document.createElement("div");tools.className="orivane-history-tools";
 const search=document.createElement("input");search.type="search";search.placeholder="Search chats…";search.setAttribute("aria-label","Search saved chats");
 const filter=document.createElement("select");filter.setAttribute("aria-label","Filter chats by folder");
 ["All folders","General","Gaming","School","Projects","Personal","Work"].forEach((label,i)=>{const opt=document.createElement("option");opt.value=i===0?"all":label;opt.textContent=label;filter.append(opt);});
 tools.append(search,filter);box.parentNode.insertBefore(tools,box);
 const folders=safeRead(FOLDER_KEY,{});
 const apply=()=>{const query=search.value.trim().toLowerCase(),folder=filter.value;box.querySelectorAll(".history-item").forEach(row=>{const title=row.querySelector(".history-open")?.textContent.toLowerCase()||"",id=row.dataset.chatId||"",category=folders[id]||"General";row.hidden=!!((query&&!title.includes(query))||(folder!=="all"&&category!==folder));});};
 const decorate=()=>{box.querySelectorAll(".history-item").forEach(row=>{if(row.querySelector(".history-folder"))return;const id=row.dataset.chatId;if(!id)return;const select=document.createElement("select");select.className="history-folder";select.setAttribute("aria-label","Conversation folder");["General","Gaming","School","Projects","Personal","Work"].forEach(name=>{const opt=document.createElement("option");opt.value=name;opt.textContent=name;select.append(opt);});select.value=folders[id]||"General";select.addEventListener("click",e=>e.stopPropagation());select.addEventListener("change",()=>{folders[id]=select.value;safeWrite(FOLDER_KEY,folders);apply();});row.append(select);});apply();};
 new MutationObserver(decorate).observe(box,{childList:true});search.addEventListener("input",apply);filter.addEventListener("change",apply);decorate();
}
function openCommandPalette(){
 const overlay=$("commandPaletteOverlay");if(!overlay)return;
 overlay.hidden=false;document.body.classList.add("dialog-open");
 const search=overlay.querySelector("#orivaneCommandSearch");if(search){search.value="";search.focus();search.dispatchEvent(new Event("input"));}
}
function enhanceCommandPalette(){
 const overlay=$("commandPaletteOverlay"),grid=overlay?.querySelector(".command-grid");if(!grid)return;
 const search=document.createElement("input");search.id="orivaneCommandSearch";search.type="search";search.placeholder="Search actions…";search.setAttribute("aria-label","Search quick actions");search.style.cssText="width:100%;margin:8px 0 13px;padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--text)";
 grid.parentNode.insertBefore(search,grid);
 search.addEventListener("input",()=>{const q=search.value.trim().toLowerCase();grid.querySelectorAll("button").forEach(b=>b.hidden=!b.textContent.toLowerCase().includes(q));});
 const add=(label,run)=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.addEventListener("click",()=>{overlay.hidden=true;document.body.classList.remove("dialog-open");run();});grid.append(b);};
 add("Open theme studio",()=>themeStudio.open());
 add("Toggle sound effects",()=>{$("orivaneSoundToggle")?.click();});
 add("Start a new conversation",()=>$("newChat")?.click());
 add("Scroll to control center",()=>$("orivaneDashboard")?.scrollIntoView({behavior:"smooth",block:"start"}));
}
function addTypingIndicator(){
 const row=document.createElement("div");row.className="assistant-message orivane-typing";row.setAttribute("role","status");row.setAttribute("aria-label","ORIVANE is typing");
 const icon=document.createElement("span");icon.className="message-icon";icon.textContent="O";const body=document.createElement("div");body.className="message-body";const label=document.createElement("b");label.textContent="ORIVANE is thinking";const dots=document.createElement("span");dots.className="orivane-typing-dots";dots.textContent=" ···";body.append(label,dots);row.append(icon,body);$("chatContent")?.append(row);return row;
}
function installTypingAnimation(){
 if(typeof window.addMessage!=="function")return;
 const original=window.addMessage;
 window.addMessage=function(role,text,restore=false){
  if(role!=="assistant"||restore||window.matchMedia("(prefers-reduced-motion: reduce)").matches){return original(role,text,restore);}
  const row=document.createElement("div");row.className="assistant-message";const icon=document.createElement("span");icon.className="message-icon";icon.textContent="O";const body=document.createElement("div");body.className="message-body";const title=document.createElement("b");title.textContent="ORIVANE 🟠";const p=document.createElement("div");p.className="assistant-message-content";const actions=document.createElement("div");actions.className="message-actions";
  const copy=document.createElement("button");copy.type="button";copy.textContent="Copy";copy.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(p.textContent);copy.textContent="Copied!";setTimeout(()=>copy.textContent="Copy",1200);}catch{copy.textContent="Select text to copy";}});
  const speak=document.createElement("button");speak.type="button";speak.textContent="Read aloud";speak.addEventListener("click",()=>{if(!("speechSynthesis"in window))return;if(window.speechSynthesis.speaking){window.speechSynthesis.cancel();speak.textContent="Read aloud";return;}const utterance=new SpeechSynthesisUtterance(p.textContent);utterance.onend=()=>speak.textContent="Read aloud";speak.textContent="Stop";window.speechSynthesis.speak(utterance);});
  actions.append(copy,speak);body.append(title,p,actions);row.append(icon,body);$("chatContent")?.append(row);
  const content=String(text??"");let index=0;
  const step=()=>{index=Math.min(content.length,index+Math.max(3,Math.ceil(content.length/180)));p.textContent=content.slice(0,index);if(index<content.length){setTimeout(step,Math.min(18,Math.max(7,1100/Math.max(content.length,1))));}else{tone("reply");}};
  step();return row;
 };
 const originalSend=window.sendMessage;
 if(typeof originalSend==="function"&&!originalSend.__orivaneTypingWrapped){
  const wrapped=async value=>{const indicator=addTypingIndicator();tone("send");try{return await originalSend(value);}finally{indicator.remove();}};
  wrapped.__orivaneTypingWrapped=true;window.sendMessage=wrapped;
 }
}
let themeStudio;
function init(){
 applyTheme(localStorage.getItem(THEME_KEY)||"ember");
 themeStudio=buildThemeStudio();
 buildDashboard();buildAmbient();buildHistoryTools();enhanceCommandPalette();installTypingAnimation();
 $("commandPaletteOpen")?.addEventListener("click",()=>{const search=$("orivaneCommandSearch");if(search){search.value="";setTimeout(()=>search.focus(),0);}});
 document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openCommandPalette();}});
 document.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>tone("tap"),{passive:true}));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
