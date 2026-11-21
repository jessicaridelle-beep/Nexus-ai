/* ORIVANE Feature Suite 2.4 — pins, full-text search, branches, backup, model comparison and draft history */
(()=>{"use strict";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const KEYS={chats:"orivane-chat-history-v1",pins:"orivane-pinned-chats-v1",drafts:"orivane-code-drafts-v1",versions:"orivane-code-draft-versions-v1"};
const read=(k,f=[])=>{try{const v=JSON.parse(localStorage.getItem(k)||"null");return v??f}catch{return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
const style=el("style");style.textContent=`
.orivane-pin{border:0;background:transparent;color:var(--muted);padding:3px 6px;cursor:pointer}.orivane-pin.is-pinned{color:var(--accent)}.history-item.is-pinned{order:-1}.orivane-full-search{width:100%;margin-top:7px;padding:9px 11px;border:1px solid var(--line);border-radius:9px;background:var(--panel);color:var(--text)}.orivane-branch{margin-left:8px}.orivane-suite-modal{position:fixed;inset:0;z-index:1200;background:#03050ad9;backdrop-filter:blur(14px);display:grid;place-items:center;padding:16px}.orivane-suite-modal[hidden]{display:none}.orivane-suite-card{width:min(850px,100%);max-height:88vh;overflow:auto;background:var(--panel);color:var(--text);border:1px solid var(--line);border-radius:18px;padding:22px;box-shadow:0 24px 80px #0008}.orivane-suite-card h2{margin:0 0 8px}.orivane-suite-card p{color:var(--muted);font-size:13px;line-height:1.6}.orivane-suite-close{float:right;border:1px solid var(--line);background:transparent;color:var(--text);border-radius:9px;padding:7px 11px}.orivane-suite-actions{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.orivane-suite-actions button,.orivane-suite-card button{border:1px solid var(--line);background:var(--panel2);color:var(--text);border-radius:9px;padding:9px 12px;cursor:pointer}.orivane-suite-primary{background:var(--accent)!important;color:#17100a!important;border-color:transparent!important;font-weight:700}.orivane-compare-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.orivane-compare-grid article{min-width:0;border:1px solid var(--line);border-radius:12px;padding:13px;white-space:pre-wrap;overflow-wrap:anywhere;max-height:48vh;overflow:auto;font-size:13px}.orivane-compare-grid h3{margin:0 0 9px;font-size:14px}.orivane-suite-input{width:100%;box-sizing:border-box;padding:11px;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--text)}.orivane-suite-status{font-size:12px;color:var(--muted)}.orivane-version{display:flex;justify-content:space-between;gap:10px;align-items:center;border:1px solid var(--line);border-radius:10px;padding:10px;margin:8px 0}.orivane-version small{display:block;color:var(--muted)}@media(max-width:600px){.orivane-compare-grid{grid-template-columns:1fr}}
`;document.head.append(style);
function decorateHistory(){
 const box=$("#chatHistory");if(!box)return;
 let search=$("#orivaneFullHistorySearch");
 if(!search){
  search=el("input","orivane-full-search");search.id="orivaneFullHistorySearch";search.type="search";
  search.placeholder="Search saved chats and messages…";search.setAttribute("aria-label","Search saved chats and messages");
  box.parentElement.insertBefore(search,box);
  search.addEventListener("input",()=>applyFullSearch(search.value));
 }
 const pins=new Set(read(KEYS.pins,[]));
 box.querySelectorAll(".history-item").forEach(row=>{
  const id=row.dataset.chatId;if(!id)return;const pinned=pins.has(id);row.classList.toggle("is-pinned",pinned);
  let b=row.querySelector(".orivane-pin");if(!b){b=el("button","orivane-pin");b.type="button";b.title="Pin conversation";b.setAttribute("aria-label","Pin conversation");const del=row.querySelector(".history-delete");if(del)row.insertBefore(b,del);else row.append(b);}
  const pinLabel=pinned?"★":"☆";if(b.textContent!==pinLabel)b.textContent=pinLabel;b.classList.toggle("is-pinned",pinned);b.setAttribute("aria-pressed",String(pinned));
  b.onclick=e=>{e.stopPropagation();const next=new Set(read(KEYS.pins,[]));if(next.has(id))next.delete(id);else next.add(id);write(KEYS.pins,[...next]);decorateHistory();};
 });
 const rows=[...box.querySelectorAll(".history-item")];const sorted=[...rows].sort((a,b)=>Number(pins.has(b.dataset.chatId))-Number(pins.has(a.dataset.chatId)));if(sorted.some((r,i)=>r!==rows[i]))sorted.forEach(r=>box.append(r));
 const fullSearch=$("#orivaneFullHistorySearch");if(fullSearch)applyFullSearch(fullSearch.value);
}
function applyFullSearch(value){const box=$("#chatHistory");if(!box)return;const q=String(value||"").trim().toLowerCase();const chats=read(KEYS.chats);box.querySelectorAll(".history-item").forEach(row=>{const chat=chats.find(x=>x.id===row.dataset.chatId);const hay=(chat?.title||"")+" "+(chat?.messages||[]).map(m=>m.content||"").join(" ");row.hidden=!!q&&!hay.toLowerCase().includes(q);});}
const historyBox=$("#chatHistory");if(historyBox)new MutationObserver(decorateHistory).observe(historyBox,{childList:true,subtree:true});
decorateHistory();
const modal=el("div","orivane-suite-modal");modal.hidden=true;const card=el("section","orivane-suite-card");card.setAttribute("role","dialog");card.setAttribute("aria-modal","true");const close=el("button","orivane-suite-close","Close");close.type="button";const heading=el("h2","","Workspace tools");const desc=el("p","","Portable backups and model comparison. Your data stays in this browser unless you export it.");const body=el("div");card.append(close,heading,desc,body);modal.append(card);document.body.append(modal);
function open(title,description,content){heading.textContent=title;desc.textContent=description;body.replaceChildren(content);modal.hidden=false;close.focus();}
function shut(){modal.hidden=true}close.onclick=shut;modal.addEventListener("click",e=>{if(e.target===modal)shut()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.hidden)shut()});
function makeBackup(){
 const data={format:"orivane-workspace-backup",version:1,createdAt:new Date().toISOString(),items:{}};
 for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k||!k.startsWith("orivane-")||/(secret|auth|token|visitor-id|session|password|api-key)/i.test(k))continue;data.items[k]=localStorage.getItem(k);}
 return data;
}
function backupUI(){
 const wrap=el("div"),p=el("p","","Export chats, projects, prompts, memories, settings and drafts into one JSON file. Private unlock and session identifiers are excluded. Keep the file somewhere safe.");const actions=el("div","orivane-suite-actions");
 const exportBtn=el("button","orivane-suite-primary","↓ Download workspace backup");exportBtn.onclick=()=>{const blob=new Blob([JSON.stringify(makeBackup(),null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=el("a");a.href=url;a.download="orivane-backup-"+new Date().toISOString().slice(0,10)+".json";a.click();URL.revokeObjectURL(url);status.textContent="Backup downloaded."};
 const importBtn=el("button","","Choose backup to restore");const file=el("input");file.type="file";file.accept=".json,application/json";file.hidden=true;importBtn.onclick=()=>file.click();
 const status=el("p","orivane-suite-status","Restoring adds or replaces matching ORIVANE data keys. It does not upload anything.");file.onchange=async()=>{const f=file.files?.[0];if(!f)return;try{const parsed=JSON.parse(await f.text());if(parsed.format!=="orivane-workspace-backup"||!parsed.items||typeof parsed.items!=="object")throw Error("That file is not an ORIVANE backup.");if(!confirm("Restore this backup on this device? Existing matching data will be replaced."))return;for(const [k,v] of Object.entries(parsed.items)){if(k.startsWith("orivane-")&&!/(secret|auth|token|visitor-id|session|password|api-key)/i.test(k)&&typeof v==="string")localStorage.setItem(k,v);}status.textContent="Backup restored. Refresh ORIVANE to reload all restored data."; }catch(e){status.textContent=e.message||"Could not restore that backup."}file.value="";};
 actions.append(exportBtn,importBtn);wrap.append(p,actions,file,status);return wrap;
}
function compareUI(){
 const wrap=el("div"),label=el("label","","Prompt to compare"),input=el("textarea","orivane-suite-input");input.rows=4;input.placeholder="Ask the same question to two response modes…";input.value=$("#promptInput")?.value||"";
 const actions=el("div","orivane-suite-actions"),run=el("button","orivane-suite-primary","Compare Fast vs Pro");run.type="button";const status=el("p","orivane-suite-status","This makes two separate AI requests. Model availability depends on your ORIVANE Worker configuration.");const results=el("div","orivane-compare-grid");
 run.onclick=async()=>{const prompt=input.value.trim();if(!prompt)return;run.disabled=true;status.textContent="Generating both answers…";results.replaceChildren();try{const prefs=read("orivane-personal-admin-v1",{});const ask=async mode=>{const response=await fetch("https://nexus-ai-api.jessicaridelle.workers.dev",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:prompt.slice(0,2000)}],mode,localModel:["fast","thinking","pro"].includes(prefs.model)?prefs.model:"auto",localTemperature:prefs.temperature,localMaxTokens:prefs.maxTokens,localAIInstructions:String(prefs.instructions||"").slice(0,1200)})});const data=await response.json();if(!response.ok)throw Error(data.error||"Request failed");if(typeof data.reply!=="string")throw Error("No answer returned");return data.reply;};const [fast,pro]=await Promise.all([ask("fast"),ask("pro")]);for(const [name,value] of [["FAST",fast],["PRO",pro]]){const article=el("article"),h=el("h3","",name);article.append(h,document.createTextNode(value));results.append(article);}status.textContent="Comparison complete. The labels describe response modes, not guaranteed different model providers.";}catch(e){status.textContent=e.message||"Comparison failed."}finally{run.disabled=false;}};
 wrap.append(label,input,actions,status,results);return wrap;
}
function addQuickAction(id,label,fn){const bar=$(".tool-quick-actions");if(!bar||$("#"+id))return;const b=el("button","",label);b.id=id;b.type="button";b.addEventListener("click",fn);bar.append(b);}
addQuickAction("orivaneBackupOpen","⇧ Workspace backup",()=>open("Workspace backup","Move your ORIVANE data between devices with a local backup file. This is manual transfer, not automatic cloud sync.",backupUI()));
addQuickAction("orivaneCompareOpen","⇄ Compare answers",()=>open("Model comparison","Compare two response modes using the same prompt.",compareUI()));
function branchAssistant(row){
 if(row.dataset.branchReady)return;row.dataset.branchReady="1";const actions=row.querySelector(".message-actions");if(!actions)return;
 const b=el("button","orivane-branch","Branch from here");b.type="button";b.title="Start a new conversation using messages up to this answer";
 b.onclick=()=>{try{const rows=$$("#chatContent .assistant-message, #chatContent .user-message");const index=rows.indexOf(row);if(index<0||!Array.isArray(conversation))throw Error("This conversation cannot be branched.");const branch=conversation.slice(0,index+1).map(m=>({...m}));if(!branch.length)throw Error("No messages to branch.");$("#newChat")?.click();conversation.length=0;conversation.push(...branch);const target=$("#chatContent");target.replaceChildren();branch.forEach(m=>addMessage(m.role,m.content,true));if($("#welcome"))$("#welcome").hidden=true;if($("#chatNote"))$("#chatNote").textContent="Branch created. Continue the conversation to save it as a new chat.";shut();}catch(e){alert(e.message||"Could not create branch.");}};
 actions.append(b);
}
function decorateMessages(){ $$("#chatContent .assistant-message").forEach(branchAssistant); }
const chat=$("#chatContent");if(chat)new MutationObserver(decorateMessages).observe(chat,{childList:true,subtree:true});decorateMessages();
// Preserve previous code-draft snapshots whenever Code Studio saves a changed draft.
const originalSet=Storage.prototype.setItem;
Storage.prototype.setItem=function(key,value){
 if(key===KEYS.drafts){try{const before=JSON.parse(this.getItem(key)||"[]"),after=JSON.parse(String(value)||"[]");const versions=read(KEYS.versions,[]);for(const item of after){const prior=before.find(x=>x.name===item.name);if(prior&&prior.code!==item.code){versions.unshift({name:item.name,code:prior.code,savedAt:Date.now()});}}if(versions.length)originalSet.call(this,KEYS.versions,JSON.stringify(versions.slice(0,100)));}catch{}}
 return originalSet.call(this,key,value);
};
function addDraftHistory(){
 const title=$(".studio-head h2");if(!title||title.textContent!=="Code Studio")return;const row=$(".studio-body .studio-form-row");if(!row||$("#orivaneDraftHistory"))return;
 const b=el("button","studio-button","◷ Version history");b.id="orivaneDraftHistory";b.type="button";row.append(b);
 b.onclick=()=>{const wrap=el("div");const list=el("div");const versions=read(KEYS.versions,[]);if(!versions.length)list.append(el("p","","No previous versions captured yet. Save a draft again after changing it to create a restore point."));versions.slice(0,30).forEach(v=>{const item=el("div","orivane-version"),info=el("div");info.append(el("b","",v.name),el("small","",new Date(v.savedAt).toLocaleString()));const restore=el("button","","Restore");restore.type="button";restore.onclick=()=>{if(!confirm("Restore this earlier version into Code Studio?"))return;const current=read(KEYS.drafts,[]),i=current.findIndex(x=>x.name===v.name);if(i>=0){current[i]={...current[i],code:v.code,updated:Date.now()};write(KEYS.drafts,current);}const code=$(".studio-body .studio-code");if(code)code.value=v.code;const status=$(".studio-body .studio-status");if(status)status.textContent="Previous version restored. Save draft to keep it.";shut();};item.append(info,restore);list.append(item);});wrap.append(list);open("Code draft history","Restore an earlier saved version.",wrap);};
}
const studios=$(".studio-body");if(studios)new MutationObserver(addDraftHistory).observe(studios,{childList:true,subtree:true});addDraftHistory();
window.ORIVANE_FEATURE_SUITE={backup:makeBackup,refreshPins:decorateHistory};
})();