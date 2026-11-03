/* ORIVANE Studios: dashboard, image studio, long-term memory, code studio and local automation. */
(()=>{
 const $=id=>document.getElementById(id), el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
 const KEYS={memory:"orivane-long-memory-v1",tasks:"orivane-automation-tasks-v1",images:"orivane-image-history-v1",code:"orivane-code-drafts-v1"};
 const read=(key,fallback=[])=>{try{const v=JSON.parse(localStorage.getItem(key)||"null");return Array.isArray(v)?v:fallback}catch{return fallback}};
 const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
 const modules=[
  ["dashboard","◈","Dashboard","Your workspace at a glance"],
  ["image","▧","Image Studio","Generate original images from prompts"],
  ["memory","✧","Long-term Memory","Save useful facts for future chats"],
  ["code","⌘","Code Studio","Write, inspect and improve code"],
  ["automation","⚡","Automation Studio","Organise repeatable tasks and checklists"]
 ];
 const nav=el("div","studio-nav-group");nav.append(el("div","side-label","","")); 
 const anchor=$("projectsOpen"); if(anchor){modules.forEach(([id,icon,name])=>{const b=el("button","side-link studio-nav",icon+" ");b.type="button";b.dataset.studio=id;b.append(el("span","",name));if(id!=="dashboard")b.append(el("span","wip-badge","WIP"));b.addEventListener("click",()=>open(id));anchor.insertAdjacentElement("afterend",b);});}
 const overlay=el("div","studio-overlay");overlay.id="orivaneStudios";overlay.hidden=true;
 const modal=el("section","studio-modal");modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.setAttribute("aria-labelledby","studioTitle");
 const header=el("header","studio-head"),heading=el("div",""),eyebrow=el("div","studio-eyebrow","ORIVANE WORKSPACE");const title=el("h2","","Dashboard"),subtitle=el("p","","Your tools, projects and saved information.");heading.append(eyebrow,title,subtitle);
 const close=el("button","studio-close","×");close.type="button";close.setAttribute("aria-label","Close workspace");close.addEventListener("click",shut);header.append(heading,close);
 const body=el("div","studio-body");modal.append(header,body);overlay.append(modal);document.body.append(overlay);
 function open(id){const item=modules.find(x=>x[0]===id)||modules[0];if(id!=="dashboard"&&typeof window.orivaneWipGate==="function"){window.orivaneWipGate(item[2],()=>showStudio(id));return;}showStudio(id);} function showStudio(id){const item=modules.find(x=>x[0]===id)||modules[0];title.textContent=item[2];subtitle.textContent=item[3];body.replaceChildren();overlay.hidden=false;document.body.classList.add("studio-open");document.querySelectorAll(".studio-nav").forEach(b=>b.classList.toggle("active",b.dataset.studio===id));render(id);close.focus();}
 function shut(){overlay.hidden=true;document.body.classList.remove("studio-open");document.querySelectorAll(".studio-nav").forEach(b=>b.classList.remove("active"));}
 overlay.addEventListener("click",e=>{if(e.target===overlay)shut()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!overlay.hidden)shut()});
 function section(kicker,heading,desc){const box=el("div","studio-section");box.append(el("div","studio-kicker",kicker),el("h3","",heading),el("p","",desc));return box;}
 function action(label,fn,cls="studio-button"){const b=el("button",cls,label);b.type="button";b.addEventListener("click",fn);return b;}
 function openChat(prompt){shut();const input=$("promptInput");if(input){input.value=prompt;input.focus();input.dispatchEvent(new Event("input"));}else if(typeof window.sendMessage==="function")window.sendMessage(prompt);}
 function render(id){
  if(id==="dashboard")return dashboard();
  if(id==="image")return imageStudio();
  if(id==="memory")return memoryStudio();
  if(id==="code")return codeStudio();
  if(id==="automation")return automationStudio();
 }
 function dashboard(){
  const tasks=read(KEYS.tasks),mem=read(KEYS.memory),drafts=read(KEYS.code),imgs=read(KEYS.images);
  const hero=section("WELCOME BACK","Everything in one place","Jump into a studio or continue organising your work.");hero.classList.add("studio-hero");body.append(hero);
  const stats=el("div","studio-stats");[[tasks.filter(x=>!x.done).length,"Open tasks"],[mem.length,"Saved memories"],[drafts.length,"Code drafts"],[imgs.length,"Generated images"]].forEach(([v,l])=>{const c=el("div","studio-stat");c.append(el("b","",String(v)),el("small","",l));stats.append(c)});body.append(stats);
  const grid=el("div","studio-card-grid");modules.slice(1).forEach(([key,icon,name,desc])=>{const c=el("button","studio-launch");c.type="button";c.append(el("span","studio-launch-icon",icon),el("b","",name),el("small","",desc),el("i","","Open ↗"));c.addEventListener("click",()=>open(key));grid.append(c)});body.append(grid);
  const note=el("p","studio-note","Your saved memories, tasks and drafts are stored locally in this browser. They are not synced between devices.");body.append(note);
 }
 function imageStudio(){
  const intro=section("CREATIVE WORKSPACE","Turn a prompt into an image","Describe a safe, non-explicit scene. Images are generated using ORIVANE's connected image model.");body.append(intro);
  const form=el("form","studio-form"),label=el("label","","Image description");const prompt=el("textarea","");prompt.rows=4;prompt.maxLength=500;prompt.placeholder="A tiny orange robot exploring a glowing futuristic library…";prompt.required=true;label.append(prompt);
  const row=el("div","studio-form-row"),generate=el("button","studio-button studio-primary","✦ Generate image");generate.type="submit";const status=el("span","studio-status","Ready");status.setAttribute("role","status");row.append(generate,status);form.append(label,row);body.append(form);
  const result=el("div","studio-image-result");body.append(result);
  const history=read(KEYS.images);history.slice(0,6).forEach(item=>{if(item.url){const img=el("img","studio-history-image");img.src=item.url;img.alt=item.prompt||"Generated image";result.append(img)}});
  form.addEventListener("submit",async e=>{e.preventDefault();const value=prompt.value.trim();if(!value)return;generate.disabled=true;status.textContent="Generating…";
   try{const res=await fetch("https://nexus-ai-api.jessicaridelle.workers.dev/?action=create-image",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:value})});const data=await res.json();if(!res.ok)throw new Error(data.error||"Image generation failed.");if(!data.image_data_url)throw new Error("The model returned no image.");const img=el("img","studio-generated-image");img.src=data.image_data_url;img.alt=value;const tools=el("div","studio-image-actions");const download=action("↓ Download",()=>{const a=document.createElement("a");a.href=data.image_data_url;a.download="orivane-image.png";a.click()});tools.append(download);result.prepend(tools,img);write(KEYS.images,[{prompt:value,url:data.image_data_url,created:Date.now()},...read(KEYS.images)].slice(0,12));status.textContent="Image ready.";}catch(err){status.textContent=err.message||"Couldn't generate the image.";}finally{generate.disabled=false;}
  });
 }
 function memoryStudio(){
  body.append(section("PERSONAL KNOWLEDGE","Long-term Memory","Save facts you want ORIVANE to use in future chats. You can review or delete them at any time."));
  const form=el("form","studio-form"),label=el("label","","Memory to save"),input=el("input","");input.type="text";input.maxLength=300;input.placeholder="Example: My project is called ORIVANE.";input.required=true;label.append(input);const saveBtn=el("button","studio-button studio-primary","＋ Save memory");saveBtn.type="submit";form.append(label,saveBtn);body.append(form);
  const list=el("div","studio-list");body.append(list);
  function render(){list.replaceChildren();const items=read(KEYS.memory);if(!items.length)list.append(el("p","studio-empty","No saved memories yet."));items.forEach((item,i)=>{const row=el("div","studio-list-item");row.append(el("p","",item.text));const del=action("Delete",()=>{const next=read(KEYS.memory);next.splice(i,1);write(KEYS.memory,next);render()},"studio-danger");row.append(del);list.append(row)})}
  form.addEventListener("submit",e=>{e.preventDefault();const value=input.value.trim();if(!value)return;const items=read(KEYS.memory);items.unshift({text:value,created:Date.now()});write(KEYS.memory,items.slice(0,100));input.value="";render()});render();
  body.append(el("p","studio-note","Memory is stored in this browser only. Avoid saving passwords, private credentials or sensitive information."));
 }
 function codeStudio(){
  body.append(section("DEVELOPMENT WORKSPACE","Code Studio","Draft code, save versions locally, or ask ORIVANE to review and explain it."));
  const form=el("form","studio-form"),name=el("input","");name.type="text";name.maxLength=60;name.placeholder="Draft name (e.g. My first website)";const code=el("textarea","studio-code");code.rows=13;code.spellcheck=false;code.placeholder="// Write or paste your code here…";const row=el("div","studio-form-row");const saveBtn=el("button","studio-button studio-primary","Save draft");saveBtn.type="button";const review=el("button","studio-button","Ask ORIVANE to review");review.type="button";const download=el("button","studio-button","↓ Download");download.type="button";row.append(saveBtn,review,download);form.append(name,code,row);body.append(form);
  const status=el("p","studio-status","Drafts stay on this device.");body.append(status);
  saveBtn.addEventListener("click",()=>{if(!code.value.trim()){status.textContent="Write some code first.";return;}const items=read(KEYS.code);items.unshift({name:name.value.trim()||"Untitled draft",code:code.value,updated:Date.now()});write(KEYS.code,items.slice(0,30));status.textContent="Draft saved on this device.";renderDrafts()});
  review.addEventListener("click",()=>{if(!code.value.trim()){status.textContent="Add code first.";return;}openChat("Please review this code. Explain what it does, identify bugs, and suggest improvements.\n\n"+code.value.slice(0,12000))});
  download.addEventListener("click",()=>{if(!code.value.trim())return;const blob=new Blob([code.value],{type:"text/plain"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=(name.value.trim()||"orivane-code").replace(/[^a-z0-9-_]/gi,"-")+".txt";a.click();URL.revokeObjectURL(url)});
  const drafts=el("div","studio-list");body.append(el("h3","","Saved drafts"),drafts);
  function renderDrafts(){drafts.replaceChildren();read(KEYS.code).forEach((item,i)=>{const row=el("div","studio-list-item"),info=el("div","");info.append(el("b","",item.name),el("small","","Saved "+new Date(item.updated).toLocaleString()));row.append(info,action("Open",()=>{name.value=item.name;code.value=item.code;status.textContent="Draft loaded."}),action("Delete",()=>{const next=read(KEYS.code);next.splice(i,1);write(KEYS.code,next);renderDrafts()},"studio-danger"));drafts.append(row)})}renderDrafts();
 }
 function automationStudio(){
  body.append(section("PERSONAL AUTOMATION","Automation Studio","Build a simple task checklist and track repeatable workflows. These tasks do not control external apps automatically."));
  const form=el("form","studio-form"),input=el("input","");input.type="text";input.maxLength=160;input.placeholder="Add a task or workflow step…";input.required=true;const add=el("button","studio-button studio-primary","＋ Add task");add.type="submit";form.append(input,add);body.append(form);const list=el("div","studio-task-list");body.append(list);
  function render(){list.replaceChildren();const tasks=read(KEYS.tasks);if(!tasks.length)list.append(el("p","studio-empty","No tasks yet. Add your first step above."));tasks.forEach((task,i)=>{const row=el("div","studio-task");const check=el("input","");check.type="checkbox";check.checked=!!task.done;check.addEventListener("change",()=>{const next=read(KEYS.tasks);next[i].done=check.checked;write(KEYS.tasks,next);render()});const text=el("span",task.done?"is-done":"",task.text);const del=action("×",()=>{const next=read(KEYS.tasks);next.splice(i,1);write(KEYS.tasks,next);render()},"studio-danger");row.append(check,text,del);list.append(row)})}
  form.addEventListener("submit",e=>{e.preventDefault();const value=input.value.trim();if(!value)return;const tasks=read(KEYS.tasks);tasks.unshift({text:value,done:false,created:Date.now()});write(KEYS.tasks,tasks.slice(0,100));input.value="";render()});render();
 }
 window.orivaneOpenStudio=open;
})();
