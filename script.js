const ORIVANE_API_URL = "https://nexus-ai-api.jessicaridelle.workers.dev";
const form=document.getElementById("chatForm"),input=document.getElementById("promptInput"),content=document.getElementById("chatContent"),sendButton=form.querySelector('[type="submit"]'),chatNote=document.querySelector(".chat-note"),welcome=document.getElementById("welcome"),sidebar=document.getElementById("sidebar");
const MEMORY_KEY="orivane-memory-v1",MEMORY_FLAG="orivane-memory-enabled";
const conversation=[];
let memoryEnabled=localStorage.getItem(MEMORY_FLAG)==="true";
let researchEnabled=(function(){try{return JSON.parse(localStorage.getItem("orivane-personal-admin-v1")||"{}").research===true}catch{return false}})(),studyEnabled=false;
let attachedContext="";
const MODE_KEY="orivane-response-mode";
let responseMode=localStorage.getItem(MODE_KEY)||(function(){try{return JSON.parse(localStorage.getItem("orivane-personal-admin-v1")||"{}").defaultMode||"fast"}catch{return "fast"}})();
const modePicker=document.getElementById("modePicker"),modeMenu=document.getElementById("modeMenu"),modePickerLabel=document.getElementById("modePickerLabel");
const modeNames={fast:"Fast",thinking:"Thinking",pro:"Pro"};
function setResponseMode(mode){if(!modeNames[mode])return;responseMode=mode;localStorage.setItem(MODE_KEY,mode);modePickerLabel.textContent=modeNames[mode];modeMenu.hidden=true;modePicker.setAttribute("aria-expanded","false");document.querySelectorAll(".mode-option").forEach(option=>{const active=option.dataset.mode===mode;option.classList.toggle("active",active);option.setAttribute("aria-selected",String(active));});}
window.addEventListener("orivane-admin-settings-updated",()=>{try{const c=JSON.parse(localStorage.getItem("orivane-personal-admin-v1")||"{}");if(modeNames[c.defaultMode])setResponseMode(c.defaultMode);researchEnabled=c.research===true;if(researchButton)setMode(researchButton,researchEnabled,"⌕ Research");}catch{}});
modePicker?.addEventListener("click",()=>{modeMenu.hidden=!modeMenu.hidden;modePicker.setAttribute("aria-expanded",String(!modeMenu.hidden));});
modeMenu?.querySelectorAll("[data-mode]").forEach(option=>option.addEventListener("click",()=>setResponseMode(option.dataset.mode)));
document.addEventListener("click",event=>{if(!event.target.closest(".mode-picker-wrap")&&modeMenu&&!modeMenu.hidden){modeMenu.hidden=true;modePicker.setAttribute("aria-expanded","false");}});
setResponseMode(responseMode);
const emojiChoices=["😀","😂","✨","🧡","🔥","👀","🤔","🎮","🚀","😭","💀","😎","🎉","🤖"];
function saveMemory(){if(memoryEnabled)localStorage.setItem(MEMORY_KEY,JSON.stringify(conversation.slice(-30)));}
function renderMemoryButton(){const b=document.getElementById("memoryButton");if(!b)return;b.textContent=memoryEnabled?"Memory on":"Memory off";b.classList.toggle("memory-on",memoryEnabled);b.title=memoryEnabled?"Memory is on: conversations are saved on this device. Tap to turn off and erase saved memory.":"Memory is off: tap to save conversations on this device.";}
function appendLink(parent,url,label){const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=label||url;a.className="message-link";parent.appendChild(a);}
function getGifUrlFromText(text){const urls=String(text).match(/https?:\/\/[^\s<>"']+/g)||[];return urls.map(raw=>raw.replace(/[),.!?]+$/,"")).find(raw=>{try{const u=new URL(raw),h=u.hostname.toLowerCase(),p=u.pathname.toLowerCase();return u.protocol==="https:"&&(h==="media.tenor.com"||h==="media.giphy.com"||h==="static.klipy.com"||h==="static1.klipy.com"||h==="static2.klipy.com"||(h.endsWith(".giphy.com")&&(p.endsWith(".gif")||p.endsWith(".webp")||p.endsWith(".mp4")))||(h.endsWith(".tenor.com")&&(p.endsWith(".gif")||p.endsWith(".webp")||p.endsWith(".mp4")))||(h.endsWith(".klipy.com")&&(p.endsWith(".gif")||p.endsWith(".webp")||p.endsWith(".mp4"))));}catch{return false;}})||null;}
function renderMessageText(container,text){const url=getGifUrlFromText(text);if(!url){container.textContent=text;return;}const clean=text.replace(url,"").trim();if(clean)container.append(document.createTextNode(clean+" "));const img=document.createElement("img");img.className="chat-gif";img.src=url;img.alt="GIF";img.loading="lazy";img.onerror=()=>{img.remove();appendLink(container,url,"Open GIF ↗");};container.appendChild(img);}
function addMessage(role,text,restore=false){if(role==="user"){const el=document.createElement("div");el.className="user-message";renderMessageText(el,text);content.appendChild(el);return;}
 const row=document.createElement("div");row.className="assistant-message";const icon=document.createElement("span");icon.className="message-icon";icon.textContent="O";const body=document.createElement("div");body.className="message-body";const title=document.createElement("b");title.textContent=(()=>{try{return JSON.parse(localStorage.getItem("orivane-personal-admin-v1")||"{}").assistantName||"ORIVANE"}catch{return "ORIVANE"}})()+" 🟠";const p=document.createElement("div");p.className="assistant-message-content";renderMessageText(p,text);const actions=document.createElement("div");actions.className="message-actions";const copy=document.createElement("button");copy.type="button";copy.textContent="Copy";copy.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(text);copy.textContent="Copied!";setTimeout(()=>copy.textContent="Copy",1400);}catch{copy.textContent="Select text to copy";}});actions.append(copy);const speak=document.createElement("button");speak.type="button";speak.textContent="Read aloud";speak.addEventListener("click",()=>{if(!("speechSynthesis" in window)){speak.textContent="Not supported";return;}if(window.speechSynthesis.speaking){window.speechSynthesis.cancel();speak.textContent="Read aloud";return;}const utterance=new SpeechSynthesisUtterance(text);utterance.onend=()=>speak.textContent="Read aloud";utterance.onerror=()=>speak.textContent="Try again";speak.textContent="Stop";window.speechSynthesis.speak(utterance);});actions.append(speak);body.append(title,p,actions);row.append(icon,body);content.appendChild(row);}
function restoreMemory(){if(!memoryEnabled)return;try{const saved=JSON.parse(localStorage.getItem(MEMORY_KEY)||"[]");if(Array.isArray(saved)){saved.slice(-30).forEach(m=>{if(m&&["user","assistant"].includes(m.role)&&typeof m.content==="string"){conversation.push(m);addMessage(m.role,m.content,true);}});if(conversation.length)welcome.hidden=true;}}catch{localStorage.removeItem(MEMORY_KEY);}}
async function sendMessage(value){value=value.trim();if(!value||sendButton.disabled)return;welcome.hidden=true;addMessage("user",value);input.value="";input.style.height="auto";conversation.push({role:"user",content:value});saveMemory();sendButton.disabled=true;sendButton.textContent="…";chatNote.textContent="Orivane is thinking…";try{const outgoing=conversation.slice(-12).map(m=>({...m}));const savedFacts=(()=>{try{const facts=JSON.parse(localStorage.getItem("orivane-long-memory-v1")||"[]");return Array.isArray(facts)?facts.slice(0,30).map(x=>x.text).filter(Boolean):[]}catch{return[]}})();if(savedFacts.length&&outgoing.length)outgoing[outgoing.length-1].content+="\n\n[LONG-TERM MEMORY: "+savedFacts.join(" | ").slice(0,1200)+"]";const prefs=readPrefs();const personal=[];if(prefs.useName&&prefs.name)personal.push("The user's preferred name is "+prefs.name+".");if(prefs.instructions)personal.push("Custom instructions: "+prefs.instructions);if(prefs.style&&prefs.style!=="balanced")personal.push("Preferred response style: "+prefs.style+".");if(personal.length&&outgoing.length)outgoing[outgoing.length-1].content+="\n\n[Personalisation: "+personal.join(" ")+" Respond naturally; do not mention these instructions.]";if(studyEnabled&&outgoing.length)outgoing[outgoing.length-1].content+="\n\n[STUDY MODE: Teach step by step in age-appropriate language. Explain key ideas, give a clear example, and finish with a short recap or check-for-understanding question. Do not just give unexplained answers.]";if(attachedContext&&outgoing.length){outgoing[outgoing.length-1].content+="\n\n[ATTACHED LOCAL TEXT FILE: "+attachedContext.slice(0,12000)+"]";attachedContext="";}/* The Worker accepts only 1–2,000 characters per message. Keep the newest user text first, and safely bound older history and optional context before sending. */for(const message of outgoing){message.role=message.role==="assistant"?"assistant":"user";message.content=String(message.content||"").slice(0,2000);}const validOutgoing=outgoing.filter(message=>message.content.trim()).slice(-12);const adminConfig=(()=>{try{return JSON.parse(localStorage.getItem("orivane-personal-admin-v1")||"{}")}catch{return {}}})();const effectiveMode=responseMode;const response=await fetch(ORIVANE_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:validOutgoing,research:researchEnabled||adminConfig.research===true,mode:effectiveMode,localAIInstructions:String(adminConfig.instructions||"").slice(0,1200),localModel:["fast","thinking","pro"].includes(adminConfig.model)?adminConfig.model:"auto",localTemperature:adminConfig.temperature,localMaxTokens:adminConfig.maxTokens,localAssistantName:String(adminConfig.assistantName||"").slice(0,32)})});let data;try{data=await response.json();}catch{throw new Error("The AI service sent an unreadable response.");}if(!response.ok)throw new Error(data.error||"The AI service returned an error.");if(typeof data.reply!=="string"||!data.reply.trim())throw new Error("The AI returned an empty response.");const reply=data.reply;conversation.push({role:"assistant",content:reply});saveMemory();addMessage("assistant",reply);const searchState=data.webSearchStatus;if(researchEnabled||searchState&&searchState!=="not-needed"){const labels={searched:"Web search completed · check cited sources in the reply.",unavailable:"WIP · live web search is unavailable right now.", "no-results":"WIP · search returned no usable results."};chatNote.textContent=labels[searchState]||"Research mode is on · search availability depends on the Worker.";}else{chatNote.textContent="AI responses can be wrong. Check important information.";}return reply;}catch(error){if(conversation.at(-1)?.role==="user")conversation.pop();saveMemory();addMessage("assistant",error.message||"I couldn't reach the AI service. Please try again.");chatNote.textContent="Connection issue — please try again in a moment.";return null;}finally{sendButton.disabled=false;sendButton.textContent="↑";content.scrollIntoView({behavior:"smooth",block:"end"});}}
let voiceModeActive=false,voiceRecognition=null,voiceFinalText="",voiceListening=false;
const voicePanel=document.getElementById("voiceMode"),voiceStatus=document.getElementById("voiceModeStatus"),voiceTranscript=document.getElementById("voiceTranscript"),voiceListenButton=document.getElementById("voiceListen"),voiceSendButton=document.getElementById("voiceSend"),voiceOrb=document.getElementById("voiceOrb");
function setVoiceStatus(message,state=""){voiceStatus.textContent=message;voiceOrb.classList.toggle("is-listening",state==="listening");voiceOrb.classList.toggle("is-speaking",state==="speaking");}
function startVoiceListening(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){setVoiceStatus("Speech recognition isn't supported here. Try Chrome.");return;}if(!voiceModeActive||voiceListening)return;try{voiceRecognition=new SR();voiceRecognition.lang=navigator.language||"en-US";voiceRecognition.continuous=true;voiceRecognition.interimResults=true;voiceRecognition.maxAlternatives=1;voiceListening=true;voiceListenButton.textContent="■ Stop listening";setVoiceStatus("Listening… speak naturally.", "listening");voiceRecognition.onresult=e=>{let interim="";for(let i=e.resultIndex;i<e.results.length;i++){const phrase=e.results[i][0]?.transcript||"";if(e.results[i].isFinal)voiceFinalText+=(voiceFinalText?" ":"")+phrase.trim();else interim+=phrase;}voiceTranscript.textContent=(voiceFinalText+" "+interim).trim()||"Listening…";voiceSendButton.disabled=!voiceFinalText.trim();};voiceRecognition.onerror=e=>{voiceListening=false;voiceListenButton.textContent="🎙 Start listening";setVoiceStatus("Microphone issue: "+e.error+". Try starting again.");};voiceRecognition.onend=()=>{voiceListening=false;voiceListenButton.textContent="🎙 Start listening";if(voiceModeActive&&voiceStatus.textContent.startsWith("Listening"))setVoiceStatus("Paused. Send your message or start listening again.");};voiceRecognition.start();}catch{voiceListening=false;voiceListenButton.textContent="🎙 Start listening";setVoiceStatus("Couldn't start the microphone. Check browser permission.");}}
function stopVoiceListening(){if(voiceRecognition){try{voiceRecognition.stop();}catch{}voiceRecognition=null;}voiceListening=false;voiceListenButton.textContent="🎙 Start listening";voiceOrb.classList.remove("is-listening");}
function speakVoiceReply(text){return new Promise(resolve=>{if(!("speechSynthesis" in window)){resolve();return;}window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang=navigator.language||"en-US";utterance.rate=1;utterance.onstart=()=>setVoiceStatus("ORIVANE is speaking…","speaking");utterance.onend=()=>resolve();utterance.onerror=()=>resolve();window.speechSynthesis.speak(utterance);});}
function closeVoiceMode(){voiceModeActive=false;stopVoiceListening();if("speechSynthesis"in window)window.speechSynthesis.cancel();voicePanel.hidden=true;setVoiceStatus("Voice mode closed.");}
document.getElementById("voiceInput")?.addEventListener("click",()=>{voiceModeActive=true;voiceFinalText="";voiceTranscript.textContent="Your speech will appear here…";voiceSendButton.disabled=true;voicePanel.hidden=false;setVoiceStatus("Tap Start listening when you're ready.");});
document.getElementById("voiceModeClose")?.addEventListener("click",closeVoiceMode);
voiceListenButton?.addEventListener("click",()=>{if(voiceListening)stopVoiceListening();else startVoiceListening();});
voiceSendButton?.addEventListener("click",async()=>{const spoken=voiceFinalText.trim();if(!spoken)return;stopVoiceListening();voiceFinalText="";voiceTranscript.textContent="Sending: "+spoken;voiceSendButton.disabled=true;setVoiceStatus("ORIVANE is thinking…");const reply=await sendMessage(spoken);if(!voiceModeActive)return;if(reply){await speakVoiceReply(reply);}if(voiceModeActive){voiceTranscript.textContent="Ready for your next message.";startVoiceListening();}});
form.addEventListener("submit",e=>{e.preventDefault();sendMessage(input.value);});
input.addEventListener("input",()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,160)+"px";});
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();form.requestSubmit();}});
document.querySelectorAll("[data-prompt]").forEach(button=>button.addEventListener("click",()=>sendMessage(button.dataset.prompt)));
document.getElementById("newChat").addEventListener("click",()=>{conversation.length=0;content.replaceChildren();if(memoryEnabled)localStorage.removeItem(MEMORY_KEY);welcome.hidden=false;chatNote.textContent="New conversation started.";input.value="";sidebar.classList.remove("open");document.getElementById("currentPage").textContent="Chat";window.scrollTo({top:0,behavior:"smooth"});});
const desktopSidebarQuery=window.matchMedia("(min-width: 801px)");
if(localStorage.getItem("orivane-sidebar-collapsed")==="true"&&desktopSidebarQuery.matches)document.body.classList.add("sidebar-collapsed");
document.getElementById("menuButton").setAttribute("aria-label","Toggle navigation");
document.getElementById("menuButton").setAttribute("title","Collapse or open navigation");
document.getElementById("menuButton").addEventListener("click",()=>{
 if(desktopSidebarQuery.matches){
  const collapsed=document.body.classList.toggle("sidebar-collapsed");
  localStorage.setItem("orivane-sidebar-collapsed",String(collapsed));
 }else{
  sidebar.classList.toggle("open");
 }
});
document.getElementById("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("light");localStorage.setItem("orivane-theme",document.body.classList.contains("light")?"light":"dark");});
if(localStorage.getItem("orivane-theme")==="light")document.body.classList.add("light");
document.querySelectorAll(".side-link").forEach(button=>button.addEventListener("click",()=>{if(button.dataset.view!=="chat"){chatNote.textContent=button.dataset.view==="projects"?"Projects workspace opened.":"Saved ideas are planned for a future update.";setTimeout(()=>{if(chatNote.textContent.includes("planned for a future update"))chatNote.textContent="Orivane can make mistakes. Check important information.";},3500);}else document.getElementById("currentPage").textContent="Chat";document.querySelectorAll(".side-link").forEach(b=>b.classList.toggle("active",b===button));sidebar.classList.remove("open");}));
document.getElementById("memoryButton").addEventListener("click",()=>{memoryEnabled=!memoryEnabled;localStorage.setItem(MEMORY_FLAG,String(memoryEnabled));if(memoryEnabled){saveMemory();chatNote.textContent="Memory on: this device will remember up to 30 recent messages.";}else{localStorage.removeItem(MEMORY_KEY);chatNote.textContent="Memory off: saved conversation data was cleared from this device.";}renderMemoryButton();});
document.getElementById("emojiButton").addEventListener("click",()=>{const emoji=emojiChoices[Math.floor(Math.random()*emojiChoices.length)];const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;input.value=input.value.slice(0,start)+emoji+input.value.slice(end);input.focus();input.setSelectionRange(start+emoji.length,start+emoji.length);input.dispatchEvent(new Event("input"));});
renderMemoryButton();restoreMemory();

/* Profile and personalisation settings */
const PREF_KEY="orivane-preferences-v1",PROFILE_KEY="orivane-profile-v1";
const readPrefs=()=>{try{return JSON.parse(localStorage.getItem(PREF_KEY)||"{}")}catch{return {}}};
function openDialog(id){document.getElementById(id).hidden=false;document.body.classList.add("dialog-open");}
function closeDialog(id){document.getElementById(id).hidden=true;if(!document.querySelector(".overlay:not([hidden])"))document.body.classList.remove("dialog-open");}
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeDialog(b.dataset.close)));
document.querySelectorAll(".overlay").forEach(o=>o.addEventListener("click",e=>{if(e.target===o)closeDialog(o.id);}));
let profileMode="register";
let signedInUser=null;
const authUrl="https://nexus-ai-api.jessicaridelle.workers.dev/";
 async function authIframeRequest(action,values={},method="POST"){
  const url=new URL(authUrl);url.searchParams.set("action",action);
  const options={method,credentials:"include",cache:"no-store"};
  if(method!=="GET"){const body=new URLSearchParams();for(const [key,value] of Object.entries(values))body.set(key,String(value));options.headers={"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"};options.body=body.toString();}
  let response;
  try{response=await fetch(url.toString(),options);}catch(error){console.warn("ORIVANE account network request failed:",error);throw new Error("Secure account connection failed. Please check your connection and reload.");}
  let data={};try{data=await response.json();}catch{}
  if(!response.ok)throw new Error(data.error||"Secure account request failed ("+response.status+").");
  return data;
 }
 function profileStatus(message){document.getElementById("profileStatus").textContent=message;}
function setProfileMode(mode){profileMode=mode;document.getElementById("profileSubmit").textContent=mode==="register"?"Create account":"Sign in";document.getElementById("profilePassword").autocomplete=mode==="register"?"new-password":"current-password";document.getElementById("profileModeSwitch").textContent=mode==="register"?"Already have an account? Sign in":"Need an account? Create one";profileStatus(mode==="register"?"Create a username and a password of at least 10 characters. JR is reserved.":"Enter your username and password to sign in.");}
function showSignedIn(user){signedInUser=user;localStorage.setItem(PROFILE_KEY,user.username);document.getElementById("profileOpen").textContent=user.username;document.getElementById("profileSignout").hidden=false;document.getElementById("profileSubmit").hidden=true;document.getElementById("profileModeSwitch").hidden=true;document.getElementById("profileName").value=user.username;document.getElementById("profileName").disabled=true;document.getElementById("profilePassword").hidden=true;profileStatus("Signed in as "+user.username+(user.role==="owner"?" · Owner account":"")+".");}
async function checkAuth(){try{const d=await authIframeRequest("auth-me",{},"GET");if(d.authenticated&&d.user)showSignedIn(d.user);}catch(error){console.warn("ORIVANE account status could not be checked:",error.message);}}
document.getElementById("profileOpen").addEventListener("click",()=>{document.getElementById("profileName").value=localStorage.getItem(PROFILE_KEY)||"";openDialog("profileOverlay");if(signedInUser)showSignedIn(signedInUser);else setProfileMode("register");});
document.getElementById("profileModeSwitch").addEventListener("click",()=>setProfileMode(profileMode==="register"?"login":"register"));
document.getElementById("profileForm").addEventListener("submit",async e=>{e.preventDefault();const username=document.getElementById("profileName").value.trim(),password=document.getElementById("profilePassword").value;const button=document.getElementById("profileSubmit");button.disabled=true;profileStatus(profileMode==="register"?"Creating your account…":"Signing in…");try{const d=await authIframeRequest(profileMode==="register"?"auth-register":"auth-login",{username,password});if(!d.ok||!d.user)throw new Error(d.error||"Authentication failed.");document.getElementById("profilePassword").value="";showSignedIn(d.user);}catch(err){profileStatus(err.message||"The account request failed. Please try again.");}finally{button.disabled=false;}});
document.getElementById("profileSignout").addEventListener("click",async()=>{try{await authIframeRequest("auth-logout",{});}catch(error){profileStatus(error.message);}signedInUser=null;localStorage.removeItem(PROFILE_KEY);document.getElementById("profileOpen").textContent="Profile / Sign in";document.getElementById("profileName").disabled=false;document.getElementById("profilePassword").hidden=false;document.getElementById("profileSubmit").hidden=false;document.getElementById("profileModeSwitch").hidden=false;document.getElementById("profileSignout").hidden=true;setProfileMode("login");});
document.getElementById("googleSignin").addEventListener("click",()=>profileStatus("Google sign-in is waiting for the ORIVANE Google OAuth credentials. No account was created."));
checkAuth();
function loadSettings(){const p=readPrefs();document.getElementById("displayName").value=p.name||"";document.getElementById("customInstructions").value=p.instructions||"";document.getElementById("responseStyle").value=p.style||"balanced";document.getElementById("useName").checked=!!p.useName;document.getElementById("themeChoice").value=localStorage.getItem("orivane-theme")||"dark";document.getElementById("memorySetting").checked=memoryEnabled;}
document.getElementById("settingsOpen").addEventListener("click",()=>{loadSettings();openDialog("settingsOverlay");});
document.querySelectorAll("[data-settings-tab]").forEach(tab=>tab.addEventListener("click",()=>{document.querySelectorAll("[data-settings-tab]").forEach(t=>t.classList.toggle("active",t===tab));document.querySelectorAll("[data-settings-pane]").forEach(p=>p.hidden=p.dataset.settingsPane!==tab.dataset.settingsTab);}));
function hasOffensivePreferredName(value){
  const normal=value.normalize("NFKD").toLowerCase().replace(/[\\u0300-\\u036f]/g,"").replace(/[0@]/g,"o").replace(/[1!|]/g,"i").replace(/[3]/g,"e").replace(/[4]/g,"a").replace(/[5$]/g,"s").replace(/[7]/g,"t").replace(/[^a-z]/g,"");
  const blocked=["fuck","shit","bitch","bastard","asshole","motherfucker","cunt","nigger","nigga","fag","faggot","retard","whore","slut"];
  return blocked.some(word=>normal.includes(word));
}
document.getElementById("saveSettings").addEventListener("click",()=>{const p={name:document.getElementById("displayName").value.trim(),instructions:document.getElementById("customInstructions").value.trim(),style:document.getElementById("responseStyle").value,useName:document.getElementById("useName").checked};if(hasOffensivePreferredName(p.name)){document.getElementById("settingsStatus").textContent="Please choose a respectful preferred name. That name can't be saved.";return;}localStorage.setItem(PREF_KEY,JSON.stringify(p));const theme=document.getElementById("themeChoice").value;document.body.classList.toggle("light",theme==="light");localStorage.setItem("orivane-theme",theme);memoryEnabled=document.getElementById("memorySetting").checked;localStorage.setItem(MEMORY_FLAG,String(memoryEnabled));if(!memoryEnabled)localStorage.removeItem(MEMORY_KEY);else saveMemory();renderMemoryButton();document.getElementById("settingsStatus").textContent="Saved!";setTimeout(()=>document.getElementById("settingsStatus").textContent="Changes save on this device.",1800);});
document.getElementById("clearMemory").addEventListener("click",()=>{localStorage.removeItem(MEMORY_KEY);conversation.length=0;content.replaceChildren();document.getElementById("settingsStatus").textContent="Saved chat memory cleared.";});
const savedProfile=localStorage.getItem(PROFILE_KEY);if(savedProfile)document.getElementById("profileOpen").textContent=savedProfile;


/* ORIVANE power tools */
const researchButton=document.getElementById("researchMode"),studyButton=document.getElementById("studyMode");
function setMode(button,on,label){button.setAttribute("aria-pressed",String(on));button.classList.toggle("mode-active",on);button.classList.toggle("tool-card-active",on);button.title=label+(on?" is enabled":" is disabled");}
researchButton?.addEventListener("click",()=>{researchEnabled=!researchEnabled;setMode(researchButton,researchEnabled,"⌕ Research");chatNote.textContent=researchEnabled?"Research mode on: this message will request live web search when available.":"Research mode off.";});
studyButton?.addEventListener("click",()=>{studyEnabled=!studyEnabled;setMode(studyButton,studyEnabled,"▤ Study");chatNote.textContent=studyEnabled?"Study mode on: explanations will be step-by-step with examples and a recap.":"Study mode off.";});
document.getElementById("commandPaletteOpen")?.addEventListener("click",()=>openDialog("commandPaletteOverlay"));
document.querySelectorAll("[data-command]").forEach(b=>b.addEventListener("click",()=>{const prefix=b.dataset.command;input.value=(input.value.trim()?input.value.trim()+"\n\n":"")+prefix;input.focus();input.dispatchEvent(new Event("input"));closeDialog("commandPaletteOverlay");}));
document.getElementById("attachTextButton")?.addEventListener("click",()=>document.getElementById("attachTextInput").click());
document.getElementById("attachTextInput")?.addEventListener("change",async e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>500000){chatNote.textContent="That file is too large. Choose a text file under 500 KB.";e.target.value="";return;}try{attachedContext=await file.text();if(!attachedContext.trim())throw new Error("This file is empty.");chatNote.textContent="Attached locally: "+file.name+" ("+Math.min(attachedContext.length,12000)+" characters will be included with your next message).";}catch(err){attachedContext="";chatNote.textContent=err.message||"Couldn't read that file.";}e.target.value="";});


/* ORIVANE WIP access gate — verified against the server-side Early Access entitlement */
(()=>{
 const API="https://nexus-ai-api.jessicaridelle.workers.dev/";
 let gateOverlay=null,gateFeature=null;
 function buildGate(){
  if(gateOverlay)return;
  const overlay=document.createElement("div");overlay.className="wip-access-overlay";overlay.id="wipAccessOverlay";overlay.hidden=true;
  const modal=document.createElement("section");modal.className="wip-access-modal";modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.setAttribute("aria-labelledby","wipAccessTitle");
  const close=document.createElement("button");close.type="button";close.className="wip-access-close";close.setAttribute("aria-label","Close");close.textContent="×";
  const mark=document.createElement("div");mark.className="wip-access-mark";mark.textContent="⚙";
  const eyebrow=document.createElement("span");eyebrow.className="early-access-kicker";eyebrow.textContent="ORIVANE · EXPERIMENTAL FEATURE";
  const title=document.createElement("h2");title.id="wipAccessTitle";title.textContent="Work in Progress";
  const message=document.createElement("p");message.className="wip-access-message";
  const note=document.createElement("p");note.className="wip-access-note";note.textContent="This feature is still being built and may contain bugs or incomplete parts. Early Access lets you try WIP features before their public release.";
  const buy=document.createElement("button");buy.type="button";buy.className="early-access-buy";buy.textContent="Get Early Access · €0.99";
  const foot=document.createElement("small");foot.className="wip-access-foot";foot.textContent="One-time payment · No subscription · Features may become public later.";
  const hide=()=>{overlay.hidden=true;document.body.style.overflow="";};
  close.addEventListener("click",hide);overlay.addEventListener("click",e=>{if(e.target===overlay)hide();});
  buy.addEventListener("click",()=>{hide();document.getElementById("earlyAccessOpen")?.click();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!overlay.hidden)hide();});
  modal.append(close,mark,eyebrow,title,message,note,buy,foot);overlay.append(modal);document.body.append(overlay);gateOverlay=overlay;gateFeature=message;
 }
 window.orivaneWipGate=async function(feature,onGranted){
  try{
   const response=await fetch(API+"?action=early-access-status",{credentials:"include",cache:"no-store"});
   const data=await response.json();
   if(response.ok&&data.earlyAccess===true){if(typeof onGranted==="function")onGranted();return true;}
  }catch(error){console.warn("ORIVANE WIP access check unavailable:",error);}
  buildGate();gateFeature.textContent=(feature||"This feature")+" is currently in Work in Progress and is available only to verified Early Access members.";
  gateOverlay.hidden=false;document.body.style.overflow="hidden";return false;
 };
})();
 
/* ORIVANE Early Access UI — checkout opens only when server secrets are configured */
(()=>{
 const overlay=document.getElementById("earlyAccessOverlay");
 const open=document.getElementById("earlyAccessOpen");
 const close=document.getElementById("earlyAccessClose");
 const buy=document.getElementById("earlyAccessBuy");
 const status=document.getElementById("earlyAccessAccountStatus");
 if(!overlay||!open||!close||!buy||!status)return;
 const api="https://nexus-ai-api.jessicaridelle.workers.dev/";
 const returned=new URLSearchParams(location.search).get("early_access");
 function show(){overlay.hidden=false;document.body.style.overflow="hidden";refresh();}
 function hide(){overlay.hidden=true;document.body.style.overflow="";}
 async function refresh(){
  status.textContent="Checking secure account and purchase status…";
  buy.disabled=true;buy.textContent="Checking checkout…";
  try{
   const r=await fetch(api+"?action=early-access-status",{credentials:"include",cache:"no-store"});
   const d=await r.json();
   if(!r.ok)throw new Error(d.error||"Status unavailable.");
   status.textContent=d.authenticated?(d.earlyAccess?"✓ Early Access is active on this account.":"Signed in as "+d.username+". No verified Early Access purchase is linked to this account."):"Sign in to link Early Access to your ORIVANE account.";
   if(returned==="success"&&!d.earlyAccess)status.textContent="Stripe returned you successfully. Waiting for the secure payment confirmation to activate Early Access — refresh in a moment.";
   if(d.checkoutReady){
    buy.disabled=!d.authenticated||d.earlyAccess;
    buy.textContent=d.earlyAccess?"Early Access unlocked":"Get Early Access · €0.99";
   }else{
    buy.disabled=true;buy.textContent="Checkout not configured yet";
   }
  }catch{
   status.textContent="Secure purchase verification is not available right now. No payment status could be confirmed.";
   buy.disabled=true;buy.textContent="Checkout unavailable";
  }
 }
 async function startCheckout(){
  if(buy.disabled)return;
  buy.disabled=true;buy.textContent="Opening secure checkout…";
  status.textContent="Creating your secure Stripe Checkout session…";
  try{
   const r=await fetch(api+"?action=early-access-checkout",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:"{}"});
   const d=await r.json();
   if(!r.ok||!d.checkoutUrl)throw new Error(d.error||"Checkout couldn't be started.");
   location.assign(d.checkoutUrl);
  }catch(error){
   status.textContent=error&&error.message?error.message:"Checkout couldn't be started. Try again.";
   buy.disabled=false;buy.textContent="Try checkout again · €0.99";
  }
 }
 open.addEventListener("click",show);close.addEventListener("click",hide);
 buy.addEventListener("click",startCheckout);
 overlay.addEventListener("click",e=>{if(e.target===overlay)hide();});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!overlay.hidden)hide();});
 window.orivaneEarlyAccess={refresh,hasAccess:async()=>{try{const r=await fetch(api+"?action=early-access-status",{credentials:"include",cache:"no-store"});const d=await r.json();return !!(r.ok&&d.earlyAccess===true);}catch{return false;}}};
 if(returned==="success"||returned==="cancelled")show();
})();
