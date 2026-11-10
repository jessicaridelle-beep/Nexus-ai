/* ORIVANE private owner activation + CEO command panel.
   The one-time setup phrase is verified only by the Worker secret JR_SETUP_CODE.
   This file intentionally contains no activation phrase or owner credential. */
(()=>{
"use strict";
const API="https://nexus-ai-api.jessicaridelle.workers.dev/";
const $=id=>document.getElementById(id);
let activeOverlay=null;
function makeOverlay(id,kind,title,subtitle){
 const overlay=document.createElement("div");overlay.className="owner-overlay";overlay.id=id;overlay.hidden=true;
 const card=document.createElement("section");card.className="owner-card "+(kind||"");card.setAttribute("role","dialog");card.setAttribute("aria-modal","true");
 const close=document.createElement("button");close.className="owner-close";close.type="button";close.textContent="×";close.setAttribute("aria-label","Close");
 close.addEventListener("click",()=>closeOverlay());
 const kicker=document.createElement("div");kicker.className="owner-kicker";kicker.textContent="ORIVANE · PRIVATE ACCESS";
 const h=document.createElement("h2");h.className="owner-title";h.textContent=title;
 const p=document.createElement("p");p.className="owner-sub";p.textContent=subtitle;
 card.append(close,kicker,h,p);overlay.append(card);overlay.addEventListener("click",e=>{if(e.target===overlay)closeOverlay();});document.body.append(overlay);
 return {overlay,card};
}
function closeOverlay(){if(activeOverlay){activeOverlay.hidden=true;activeOverlay=null;}}
function showOverlay(overlay){if(activeOverlay)activeOverlay.hidden=true;activeOverlay=overlay;overlay.hidden=false;}
const setup=makeOverlay("orivaneOwnerSetup","setup","Activate owner access","One-time founder verification. This creates the protected JR owner account; the activation phrase is never saved in this browser.");
const setupForm=document.createElement("form");setupForm.className="owner-form";
function field(labelText,type,placeholder,autocomplete){const wrap=document.createElement("div"),label=document.createElement("label"),input=document.createElement("input");label.textContent=labelText;input.type=type;input.placeholder=placeholder;input.autocomplete=autocomplete;input.required=true;wrap.append(label,input);setupForm.append(wrap);return input;}
const phrase=field("ONE-TIME ACTIVATION PHRASE","password","Enter your private activation phrase","off");phrase.minLength=16;phrase.maxLength=256;
const password=field("CREATE YOUR OWNER PASSWORD","password","At least 10 characters","new-password");password.minLength=10;password.maxLength=128;
const confirm=field("CONFIRM OWNER PASSWORD","password","Enter it again","new-password");confirm.minLength=10;confirm.maxLength=128;
const warning=document.createElement("div");warning.className="owner-warning";warning.textContent="The activation phrase is checked by ORIVANE's server and can only be used once. Choose a separate owner password for future sign-ins.";
const status=document.createElement("div");status.className="owner-status";status.setAttribute("role","status");
const submit=document.createElement("button");submit.className="owner-primary";submit.type="submit";submit.textContent="Verify and activate CEO access";
setupForm.append(warning,submit,status);setup.card.append(setupForm);
setupForm.addEventListener("submit",async e=>{
 e.preventDefault();if(password.value!==confirm.value){status.className="owner-status error";status.textContent="The passwords do not match.";return;}
 submit.disabled=true;status.className="owner-status";status.textContent="Verifying with the secure backend…";
 try{
  const result=await authIframeRequest("auth-owner-claim",{username:"JR",password:password.value,setupCode:phrase.value});
  if(!result.ok||!result.user)throw new Error(result.error||"Owner activation failed.");
  phrase.value="";password.value="";confirm.value="";
  if(typeof showSignedIn==="function")showSignedIn(result.user);
  status.className="owner-status success";status.textContent="Owner account activated. The one-time phrase has been consumed.";
  setTimeout(()=>{closeOverlay();openDashboard(result.user);},700);
 }catch(error){status.className="owner-status error";status.textContent=error.message||"Activation failed. Try again later.";}
 finally{submit.disabled=false;}
});
const dash=makeOverlay("orivaneCeoPanel","","CEO Command Center","Private owner workspace · Controls are available only to the authenticated owner account.");
const header=document.createElement("div");header.className="owner-head";
const heading=document.createElement("div");heading.append(dash.card.querySelector(".owner-kicker"),dash.card.querySelector(".owner-title"),dash.card.querySelector(".owner-sub"));
const chip=document.createElement("span");chip.className="owner-chip";chip.textContent="✦ OWNER VERIFIED";header.append(heading,chip);
const grid=document.createElement("div");grid.className="owner-grid";
function tile(label,value,detail){const el=document.createElement("article");el.className="owner-tile";const small=document.createElement("small"),strong=document.createElement("strong"),p=document.createElement("p");small.textContent=label;strong.textContent=value;p.textContent=detail;el.append(small,strong,p);grid.append(el);return strong;}
const apiValue=tile("API STATUS","Checking…","Secure Worker health endpoint");
const modelValue=tile("ACTIVE MODELS","Loading…","Fast · Thinking · Pro model routing");
const authValue=tile("OWNER ACCESS","Verified","Authenticated server-side owner role");
const versionValue=tile("BUILD VERSION","—","Current ORIVANE application build");
dash.card.append(header,grid);
const actions=document.createElement("div");actions.className="owner-actions";
const refresh=document.createElement("button");refresh.type="button";refresh.textContent="↻ Refresh system status";
refresh.addEventListener("click",loadStatus);
const repo=document.createElement("a");repo.href="https://github.com/jessicaridelle-beep/Nexus-ai";repo.target="_blank";repo.rel="noopener noreferrer";repo.textContent="Open source repository ↗";
const live=document.createElement("a");live.href="https://jessicaridelle-beep.github.io/Nexus-ai/";live.target="_blank";live.rel="noopener noreferrer";live.textContent="Open live ORIVANE ↗";
const signout=document.createElement("button");signout.type="button";signout.textContent="Sign out";
signout.addEventListener("click",async()=>{try{await authIframeRequest("auth-logout",{});location.reload();}catch(error){authValue.textContent="Sign-out error";}});
actions.append(refresh,repo,live,signout);dash.card.append(actions);
const foot=document.createElement("p");foot.className="owner-foot";foot.textContent="This first release is a protected owner dashboard for identity and system visibility. It does not yet expose live model editing, deployment, or database mutation controls.";dash.card.append(foot);
async function loadStatus(){
 apiValue.textContent="Checking…";modelValue.textContent="Loading…";
 try{
  const [healthResponse,infoResponse]=await Promise.all([fetch(API+"?action=health",{cache:"no-store"}),fetch(API+"?action=site-info",{cache:"no-store"})]);
  if(!healthResponse.ok||!infoResponse.ok)throw new Error("The Worker status endpoints are unavailable.");
  const health=await healthResponse.json(),info=await infoResponse.json();
  apiValue.textContent="Online";modelValue.textContent="3 configured";versionValue.textContent=info.version||"Unknown";
  const models=info.modelsByMode||{};grid.querySelectorAll(".owner-tile")[1].querySelector("p").textContent="Fast: "+(models.fast||"—")+" · Thinking: "+(models.thinking||"—")+" · Pro: "+(models.pro||"—");
  grid.querySelectorAll(".owner-tile")[0].querySelector("p").textContent="Secure auth: "+(health.services?.secureAuth?"available":"not ready")+" · AI: "+(health.services?.aiChat?"available":"unavailable");
 }catch(error){apiValue.textContent="Unavailable";modelValue.textContent="Status unavailable";versionValue.textContent="—";}
}
function openDashboard(user){
 if(!user||user.role!=="owner"){closeOverlay();return;}
 showOverlay(dash.overlay);loadStatus();
}
function openSetup(){if(window.signedInUser&&window.signedInUser.role==="owner"){openDashboard(window.signedInUser);return;}showOverlay(setup.overlay);}
function syncOwnerEntry(){
 const user=typeof signedInUser!=="undefined"?signedInUser:null;
 let button=$("profileOpen");
 if(user&&user.role==="owner"){
  if(! $("ownerPanelOpen")){button=document.createElement("button");button.type="button";button.id="ownerPanelOpen";button.className="header-action";button.textContent="♛ CEO Panel";$("profileOpen")?.after(button);button.addEventListener("click",()=>openDashboard(user));}
 }else{$("ownerPanelOpen")?.remove();}
}
const profileButton=$("profileOpen");
if(profileButton){new MutationObserver(syncOwnerEntry).observe(profileButton,{childList:true,characterData:true,subtree:true});}
setInterval(syncOwnerEntry,1500);
function handleRoute(){
 if(location.hash==="#/vault/activate"){history.replaceState(null,"",location.pathname+location.search+"#/");openSetup();}
 else if(location.hash==="#/vault/ceo"){history.replaceState(null,"",location.pathname+location.search+"#/");const user=typeof signedInUser!=="undefined"?signedInUser:null;if(user?.role==="owner")openDashboard(user);}
}
window.addEventListener("hashchange",handleRoute);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",handleRoute);else handleRoute();
})();