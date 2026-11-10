/* ORIVANE Admin Panel — read-only project controls and system status. */
(()=>{
"use strict";
const API="https://nexus-ai-api.jessicaridelle.workers.dev/";
const $=id=>document.getElementById(id);
let overlay=null;
function openPanel(){
 if(overlay){overlay.hidden=false;refresh();return;}
 overlay=document.createElement("div");overlay.className="owner-overlay";overlay.id="orivaneAdminPanel";
 const card=document.createElement("section");card.className="owner-card";card.setAttribute("role","dialog");card.setAttribute("aria-modal","true");
 const close=document.createElement("button");close.className="owner-close";close.type="button";close.textContent="×";close.setAttribute("aria-label","Close");close.addEventListener("click",()=>overlay.hidden=true);
 const kicker=document.createElement("div");kicker.className="owner-kicker";kicker.textContent="ORIVANE · ADMIN";
 const title=document.createElement("h2");title.className="owner-title";title.textContent="Admin Command Center";
 const sub=document.createElement("p");sub.className="owner-sub";sub.textContent="Project overview · System status · Quick access";
 const header=document.createElement("div");header.className="owner-head";header.append(kicker,title,sub,close);card.append(header);
 const grid=document.createElement("div");grid.className="owner-grid";
 function tile(label,value,detail){const el=document.createElement("article");el.className="owner-tile";const small=document.createElement("small"),strong=document.createElement("strong"),p=document.createElement("p");small.textContent=label;strong.textContent=value;p.textContent=detail;el.append(small,strong,p);grid.append(el);return {value:strong,detail:p};}
 const api=tile("API STATUS","Checking…","Cloudflare Worker");
 const ai=tile("AI MODELS","Loading…","Fast · Thinking · Pro");
 const build=tile("BUILD VERSION","—","ORIVANE application build");
 const features=tile("WORKSPACE","Available","Chat · Canvas · GIF Studio · Projects");
 card.append(grid);
 const actions=document.createElement("div");actions.className="owner-actions";
 const refreshButton=document.createElement("button");refreshButton.type="button";refreshButton.textContent="↻ Refresh status";refreshButton.addEventListener("click",refresh);
 const repo=document.createElement("a");repo.href="https://github.com/jessicaridelle-beep/Nexus-ai";repo.target="_blank";repo.rel="noopener noreferrer";repo.textContent="Open GitHub repository ↗";
 const site=document.createElement("a");site.href="https://jessicaridelle-beep.github.io/Nexus-ai/";site.target="_blank";site.rel="noopener noreferrer";site.textContent="Open live website ↗";
 actions.append(refreshButton,repo,site);card.append(actions);
 const note=document.createElement("p");note.className="owner-foot";note.textContent="This version provides project visibility and quick links. Sensitive account, billing, deployment, and database controls are not exposed in this public panel.";card.append(note);
 overlay.append(card);overlay.addEventListener("click",e=>{if(e.target===overlay)overlay.hidden=true;});document.body.append(overlay);
 async function refresh(){
  api.value.textContent="Checking…";ai.value.textContent="Loading…";
  try{
   const [hr,ir]=await Promise.all([fetch(API+"?action=health",{cache:"no-store"}),fetch(API+"?action=site-info",{cache:"no-store"})]);
   if(!hr.ok||!ir.ok)throw new Error("Status endpoint unavailable");
   const health=await hr.json(),info=await ir.json(),models=info.modelsByMode||{};
   api.value.textContent=health.services?.aiChat?"Online":"Degraded";
   api.detail.textContent="Secure auth: "+(health.services?.secureAuth?"available":"not ready")+" · AI chat: "+(health.services?.aiChat?"available":"unavailable");
   ai.value.textContent="3 configured";
   ai.detail.textContent="Fast: "+(models.fast||"—")+" · Thinking: "+(models.thinking||"—")+" · Pro: "+(models.pro||"—");
   build.value.textContent=info.version||"Unknown";
  }catch(error){api.value.textContent="Unavailable";api.detail.textContent="Could not retrieve live system status.";ai.value.textContent="Unavailable";build.value.textContent="—";}
 }
 refresh();
}
const profile=$("profileOpen");
if(profile&&!$("adminPanelOpen")){
 const button=document.createElement("button");button.type="button";button.id="adminPanelOpen";button.className="header-action";button.textContent="♛ Admin Panel";button.addEventListener("click",openPanel);profile.after(button);
}
window.ORIVANE_ADMIN_PANEL={open:openPanel};
})();