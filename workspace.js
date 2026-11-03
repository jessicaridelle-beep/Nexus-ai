/* ORIVANE workspace: local-first projects and persistent topbar controls */
(()=>{
 const $=id=>document.getElementById(id), KEY="orivane-projects-v1", UI_KEY="orivane-topbar-hidden-v1";
 const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(x)?x:[]}catch{return[]}};
 const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
 const top=$(".topbar");
 if(top){
  const right=top.querySelector(".top-right");
  const hide=el("button","header-action","Hide UI");hide.type="button";hide.id="hideWorkspaceUI";hide.title="Hide the top bar";
  right.append(hide);
  const restore=el("button","restore-ui-button","☰ Show controls");restore.type="button";restore.id="restoreWorkspaceUI";restore.hidden=true;document.body.append(restore);
  function setHidden(v){top.classList.toggle("topbar-hidden",v);restore.hidden=!v;localStorage.setItem(UI_KEY,String(v));}
  hide.addEventListener("click",()=>setHidden(true));restore.addEventListener("click",()=>setHidden(false));
  setHidden(localStorage.getItem(UI_KEY)==="true");
 }
 let active=null;
 const overlay=el("div","workspace-overlay");overlay.id="projectsWorkspace";overlay.hidden=true;
 const modal=el("section","workspace-modal");modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.setAttribute("aria-labelledby","workspaceTitle");
 const head=el("div","workspace-heading"),title=el("div","");
 title.append(el("div","workspace-eyebrow","YOUR CREATIVE SPACE"),el("h2","", "Projects"));
 const close=el("button","workspace-close","×");close.type="button";close.setAttribute("aria-label","Close projects");
 head.append(title,close);
 const intro=el("p","workspace-intro","Keep ideas, notes, tasks, and conversations organised in one place. Projects are saved on this device.");
 const actions=el("div","workspace-actions"),search=el("input","workspace-search");search.type="search";search.placeholder="Search your projects…";search.setAttribute("aria-label","Search projects");
 const create=el("button","workspace-primary","＋ New project");create.type="button";actions.append(search,create);
 const list=el("div","workspace-grid");
 const editor=el("div","project-editor");editor.hidden=true;
 modal.append(head,intro,actions,list,editor);overlay.append(modal);document.body.append(overlay);
 function closeWorkspace(){overlay.hidden=true;editor.hidden=true;list.hidden=false;actions.hidden=false;intro.hidden=false;active=null;document.body.classList.remove("workspace-open");$("currentPage").textContent="Chat";}
 function openWorkspace(){overlay.hidden=false;document.body.classList.add("workspace-open");$("currentPage").textContent="Projects";render();close.focus();}
 close.addEventListener("click",closeWorkspace);overlay.addEventListener("click",e=>{if(e.target===overlay)closeWorkspace();});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!overlay.hidden)closeWorkspace();});
 $("projectsOpen")?.addEventListener("click",openWorkspace);
 $("projectsToolOpen")?.addEventListener("click",openWorkspace);
 document.querySelectorAll(".side-link").forEach(b=>{if(b.dataset.view==="projects")b.addEventListener("click",e=>{e.preventDefault();openWorkspace();});});
 create.addEventListener("click",()=>{const name=prompt("Name your project:");if(!name?.trim())return;const p={id:"p-"+Date.now(),name:name.trim().slice(0,70),description:"",notes:"",tasks:[],updated:Date.now()};const all=read();all.unshift(p);save(all);openProject(p.id);});
 search.addEventListener("input",render);
 function render(){list.replaceChildren();editor.hidden=true;const q=search.value.trim().toLowerCase();const all=read().filter(p=>(p.name+" "+(p.description||"")).toLowerCase().includes(q));if(!all.length){const empty=el("div","workspace-empty");empty.append(el("div","empty-icon","✳"),el("h3","",q?"No matching projects":"Your next big idea starts here"),el("p","",q?"Try a different search.":"Create a project to collect its goals, notes, and tasks."));list.append(empty);return;}all.forEach(p=>{const card=el("article","project-card");const top=el("div","project-card-top");top.append(el("span","project-icon","◇"),el("span","project-date",new Date(p.updated||Date.now()).toLocaleDateString()));const h=el("h3","",p.name);const d=el("p","",p.description||"No description yet");const meta=el("div","project-meta",(p.tasks||[]).filter(t=>t.done).length+" / "+(p.tasks||[]).length+" tasks complete");const open=el("button","project-open","Open project →");open.type="button";open.addEventListener("click",()=>openProject(p.id));card.append(top,h,d,meta,open);list.append(card);});}
 function field(labelText,value,placeholder,area=false){const wrap=el("label","project-field");wrap.append(el("span","",labelText));const input=el(area?"textarea":"input");if(area)input.rows=3;input.value=value||"";input.placeholder=placeholder;wrap.append(input);return {wrap,input};}
 function openProject(id){const p=read().find(x=>x.id===id);if(!p)return;active=id;list.hidden=true;actions.hidden=true;intro.hidden=true;editor.replaceChildren();editor.hidden=false;
  const bar=el("div","editor-bar");const back=el("button","workspace-secondary","← All projects");back.type="button";back.onclick=()=>{list.hidden=false;actions.hidden=false;intro.hidden=false;active=null;render();};const del=el("button","workspace-danger","Delete project");del.type="button";del.onclick=()=>{if(confirm("Delete this project and its local notes/tasks?")){save(read().filter(x=>x.id!==id));list.hidden=false;actions.hidden=false;intro.hidden=false;active=null;render();}};bar.append(back,del);
  const name=field("Project name",p.name,"Give it a name");const desc=field("Goal / description",p.description,"What are you trying to build or achieve?",true);const notes=field("Project notes",p.notes,"Ideas, decisions, useful links, things to remember…",true);
  const taskTitle=el("h3","project-section-title","Tasks");const taskList=el("div","project-task-list");
  function saveFields(){const all=read(),item=all.find(x=>x.id===id);if(!item)return;item.name=name.input.value.trim().slice(0,70)||"Untitled project";item.description=desc.input.value;item.notes=notes.input.value;item.updated=Date.now();save(all);}
  [name.input,desc.input,notes.input].forEach(x=>x.addEventListener("change",saveFields));
  function drawTasks(){taskList.replaceChildren();const item=read().find(x=>x.id===id);(item?.tasks||[]).forEach((t,i)=>{const row=el("label","project-task");const cb=el("input");cb.type="checkbox";cb.checked=!!t.done;cb.addEventListener("change",()=>{const a=read(),pr=a.find(x=>x.id===id);pr.tasks[i].done=cb.checked;pr.updated=Date.now();save(a);drawTasks();});const text=el("span","",t.text);if(t.done)text.classList.add("task-done");const rm=el("button","task-remove","×");rm.type="button";rm.setAttribute("aria-label","Remove task");rm.onclick=()=>{const a=read(),pr=a.find(x=>x.id===id);pr.tasks.splice(i,1);save(a);drawTasks();};row.append(cb,text,rm);taskList.append(row);});}
  const addRow=el("form","project-add-task"),newTask=el("input");newTask.placeholder="Add a task…";newTask.maxLength=140;const add=el("button","workspace-primary","Add task");add.type="submit";addRow.append(newTask,add);addRow.addEventListener("submit",e=>{e.preventDefault();const text=newTask.value.trim();if(!text)return;const a=read(),pr=a.find(x=>x.id===id);pr.tasks.push({text,done:false});pr.updated=Date.now();save(a);newTask.value="";drawTasks();});
  const use=el("button","workspace-primary","✦ Work on this project in chat");use.type="button";use.addEventListener("click",()=>{const item=read().find(x=>x.id===id);const prompt="Help me work on my project: "+item.name+". Goal: "+(item.description||"not set")+". Notes: "+(item.notes||"none yet")+". Tasks: "+item.tasks.map(t=>(t.done?"[done] ":"[ ] ")+t.text).join("; ")+". Help me choose the next useful step.";const input=$("promptInput");input.value=prompt;input.focus();closeWorkspace();$("currentPage").textContent="Chat";document.querySelectorAll(".side-link").forEach(b=>b.classList.toggle("active",b.dataset.view==="chat"));});
  drawTasks();editor.append(bar,name.wrap,desc.wrap,notes.wrap,taskTitle,taskList,addRow,use);
 }
 render();
})();

/* ORIVANE plugin hub and dedicated creative navigation */
(()=>{
 const $=id=>document.getElementById(id);
 const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
 const side=$("sidebar");
 const pluginsBtn=$("pluginsOpen"), gifBtn=$("gifStudioOpen");
 if(!side||!pluginsBtn||!gifBtn)return;
 const KEY="orivane-plugin-settings-v1";
 const catalog=[
  {id:"klipy",name:"KLIPY GIF Search",kind:"Media",desc:"Search and share existing animated GIFs. WIP feature available to all members; requires the KLIPY server key.",status:"WIP · Available to all · API key required",available:true},
  {id:"gif-create",name:"AI GIF Creator",kind:"Creative",desc:"Create a looping GIF from a prompt, preview it, download it or add it to chat. Experimental WIP feature available to all members.",status:"WIP · Available to all",available:true},
  {id:"research",name:"Research Mode",kind:"Research",desc:"Experimental live-source research. WIP feature available to all members.",status:"WIP · Available to all · provider dependent",available:true},
  {id:"study",name:"Study Mode",kind:"Learning",desc:"Step-by-step explanations, examples and recap prompts.",status:"Built-in",available:true},
  {id:"voice",name:"Voice Typing",kind:"Accessibility",desc:"Dictate messages using browser speech recognition where supported.",status:"Built-in · browser dependent",available:true},
  {id:"projects",name:"Projects Workspace",kind:"Productivity",desc:"Keep project goals, notes and task lists together on this device.",status:"Built-in",available:true}
 ];
 const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return {}}};
 const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
 const overlay=el("div","plugin-overlay");overlay.id="pluginHub";overlay.hidden=true;
 const modal=el("section","plugin-modal");modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.setAttribute("aria-labelledby","pluginHubTitle");
 const head=el("div","plugin-head"),titles=el("div","");titles.append(el("div","plugin-eyebrow","ORIVANE EXTENSIONS"),el("h2","","Plugin hub"),el("p","","Manage the tools and integrations available in your workspace."));
 const close=el("button","plugin-close","×");close.type="button";close.setAttribute("aria-label","Close plugin hub");head.append(titles,close);
 const grid=el("div","plugin-grid");
 const note=el("p","plugin-footnote","Plugin switches are saved in this browser. Enabling a switch does not create missing API access or configure external services.");
 modal.append(head,grid,note);overlay.append(modal);document.body.append(overlay);
 function render(){grid.replaceChildren();const settings=read();catalog.forEach(p=>{
  const card=el("article","plugin-card");const top=el("div","plugin-card-top");top.append(el("span","plugin-kind",p.kind),el("span","plugin-indicator",["klipy","gif-create","research"].includes(p.id)?"WIP · Available to all":p.available?"Available":"Setup needed"));
  const name=el("h3","",p.name),desc=el("p","",p.desc),status=el("small","plugin-status",p.status);
  const row=el("div","plugin-toggle-row"),label=el("label","plugin-toggle-label","Enable in workspace"),toggle=el("input");toggle.type="checkbox";toggle.checked=settings[p.id]!==false&&p.available;toggle.disabled=!p.available;toggle.addEventListener("change",()=>{const next=read();next[p.id]=toggle.checked;save(next);});
  row.append(label,toggle);card.append(top,name,desc,status,row);grid.append(card);
 });}
 function open(){render();overlay.hidden=false;document.body.classList.add("plugin-hub-open");close.focus();}
 function shut(){overlay.hidden=true;document.body.classList.remove("plugin-hub-open");}
 pluginsBtn.addEventListener("click",open);close.addEventListener("click",shut);overlay.addEventListener("click",e=>{if(e.target===overlay)shut();});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!overlay.hidden)shut();});
 gifBtn.addEventListener("click",()=>{const trigger=$("gifButton");if(trigger)trigger.click();});
})();


/* ORIVANE Action Studio — planned, sequential task execution */
(()=>{
 const $=id=>document.getElementById(id),el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
 const sidebar=$("sidebar");if(!sidebar)return;const STORE="orivane-action-history-v2",API="https://nexus-ai-api.jessicaridelle.workers.dev/";
 const read=()=>{try{const v=JSON.parse(localStorage.getItem(STORE)||"[]");return Array.isArray(v)?v:[]}catch{return[];}},save=items=>localStorage.setItem(STORE,JSON.stringify(items.slice(0,20)));
 const btn=el("button","side-link");btn.type="button";btn.id="actionStudioOpen";btn.innerHTML='⚡ Action Studio <span class="wip-badge">WIP</span>';const anchor=$("projectsOpen");if(anchor)anchor.insertAdjacentElement("afterend",btn);
 const overlay=el("div","action-overlay");overlay.id="actionStudio";overlay.hidden=true;const modal=el("section","action-modal action-modal-expanded");modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.setAttribute("aria-labelledby","actionStudioTitle");
 const head=el("div","action-head"),titles=el("div","");titles.append(el("div","action-eyebrow","TASK ORCHESTRATION"),el("h2","","Action Studio"),el("p","","Plan a task, execute it step by step, and keep the results."));
 const close=el("button","workspace-close","×");close.type="button";close.setAttribute("aria-label","Close Action Studio");head.append(titles,close);
 const layout=el("div","action-layout"),main=el("div","action-main"),rail=el("aside","action-history"),form=el("form","action-form"),label=el("label","","Describe the outcome you want");label.htmlFor="actionTaskInput";
 const input=el("textarea","");input.id="actionTaskInput";input.rows=4;input.maxLength=4000;input.placeholder="Example: Plan and draft a complete website for a space exploration club…";input.required=true;
 const controls=el("div","action-controls"),hint=el("small","action-hint","ORIVANE plans up to 6 steps. You can stop between steps or retry failures."),run=el("button","workspace-primary","⚡ Plan & run");run.type="submit";controls.append(hint,run);form.append(label,input,controls);
 const quickStarts=el("div","action-quickstarts");quickStarts.append(el("span","action-quickstarts-label","QUICK START"));[["Build a website","Create a polished responsive website. Plan the pages, write the HTML/CSS/JavaScript, and explain how to preview it."],["Plan a project","Turn my idea into a practical project plan with goals, milestones, tasks, risks and a first step."],["Review my code","Review the code I provide. Find bugs, explain fixes, and return corrected code with tests I can run."],["Learn a topic","Teach me the topic step by step with a simple explanation, examples, and a short recap."]].forEach(([name,prompt])=>{const chip=el("button","action-quickstart",name);chip.type="button";chip.addEventListener("click",()=>{input.value=prompt+"\n\nMy details: ";input.focus();input.setSelectionRange(input.value.length,input.value.length);});quickStarts.append(chip);});form.append(quickStarts);const status=el("div","action-status","Ready when you are.");status.setAttribute("role","status");const progress=el("div","action-progress");progress.hidden=true;const stepList=el("ol","action-steps");progress.append(el("h3","","Execution plan"),stepList);
 const result=el("section","action-result");result.hidden=true;result.append(el("h3","","Work completed"));const output=el("div","action-output action-output-rich");result.append(output);
 const actionBar=el("div","action-result-actions"),copy=el("button","workspace-secondary","Copy full result"),download=el("button","workspace-secondary","↓ Download report"),stop=el("button","workspace-secondary","Stop after current step");copy.type=download.type=stop.type="button";stop.hidden=true;actionBar.append(copy,download,stop);result.append(actionBar);
 const historyHead=el("div","action-history-head"),historyTitle=el("h3","","Task history"),clearHistory=el("button","action-clear-history","Clear");clearHistory.type="button";historyHead.append(historyTitle,clearHistory);const historyList=el("div","action-history-list");rail.append(historyHead,historyList);main.append(form,status,progress,result);layout.append(main,rail);modal.append(head,layout);overlay.append(modal);document.body.append(overlay);
 let active=null,activeId=null,currentTask="",currentSteps=[],stopRequested=false;
 const renderHistory=()=>{historyList.replaceChildren();const items=read();if(!items.length){historyList.append(el("p","action-empty","Completed tasks will appear here."));return;}items.forEach(item=>{const b=el("button","action-history-item");b.type="button";b.append(el("b","",item.task.slice(0,72)),el("small","",new Date(item.updatedAt).toLocaleString()),el("span","",item.state==="completed"?"Completed":item.state==="stopped"?"Stopped":"Needs attention"));b.addEventListener("click",()=>loadHistory(item.id));historyList.append(b);});};
 function renderSteps(){stepList.replaceChildren();currentSteps.forEach((step,index)=>{const li=el("li","action-step "+step.status),top=el("div","action-step-top");top.append(el("b","",step.title),el("span","action-step-state",step.status.toUpperCase()));li.append(top,el("p","",step.instruction));if(step.result)li.append(el("pre","action-step-result",step.result));if(step.error)li.append(el("p","action-step-error",step.error));if(step.status==="failed"){const retry=el("button","workspace-secondary action-retry","Retry step");retry.type="button";retry.addEventListener("click",()=>retryFrom(index));li.append(retry);}stepList.append(li);});}
 function renderResults(){output.replaceChildren();currentSteps.filter(s=>s.result).forEach(step=>{const section=el("section","action-output-section");section.append(el("h4","",step.title),el("pre","",step.result));output.append(section);});}
 function persist(state){const items=read(),id=active?.id||activeId||("task-"+Date.now()),record={id,task:currentTask,state,steps:currentSteps,updatedAt:new Date().toISOString()},index=items.findIndex(x=>x.id===id);if(index>=0)items[index]=record;else items.unshift(record);save(items);activeId=id;if(active)active.id=id;renderHistory();}
 function loadHistory(id){const item=read().find(x=>x.id===id);if(!item)return;stopRequested=true;if(active?.controller)active.controller.abort();active=null;activeId=item.id;stopRequested=false;currentTask=item.task;currentSteps=item.steps||[];input.value=currentTask;progress.hidden=false;result.hidden=!currentSteps.some(s=>s.result);renderSteps();renderResults();status.textContent="Loaded saved task: "+item.state+".";run.textContent="⚡ Run task again";run.disabled=false;stop.hidden=true;}
 async function request(action,payload,signal){const response=await fetch(API+"?action="+action,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),signal});let data;try{data=await response.json();}catch{throw new Error("The task service returned an unreadable response.");}if(!response.ok)throw new Error(data.error||"The task request failed.");return data;}
 async function runOne(index){const step=currentSteps[index];if(!step)return false;step.status="running";step.error="";renderSteps();result.hidden=true;status.textContent="Working on step "+(index+1)+" of "+currentSteps.length+": "+step.title;const controller=new AbortController();if(active)active.controller=controller;
  try{const data=await request("run-step",{task:currentTask,step:{title:step.title,instruction:step.instruction},previousResults:currentSteps.slice(0,index).filter(s=>s.result).map(s=>({title:s.title,result:s.result}))},controller.signal);step.result=data.result;step.status="completed";step.error="";renderSteps();renderResults();result.hidden=false;persist("running");status.textContent="Step "+(index+1)+" completed.";return true;}
  catch(error){if(error.name==="AbortError"){step.status="pending";status.textContent="Stopped. Completed work is saved.";}else{step.status="failed";step.error=error.message;status.textContent="Step "+(index+1)+" failed. You can retry it.";}renderSteps();persist(error.name==="AbortError"?"stopped":"needs-attention");return false;}
 }
 async function retryFrom(index){if(active)return;stopRequested=false;for(let i=index;i<currentSteps.length;i++){currentSteps[i].status="pending";currentSteps[i].result="";currentSteps[i].error="";}renderSteps();renderResults();result.hidden=true;persist("running");active={id:activeId||("task-"+Date.now()),controller:null};run.disabled=true;stop.hidden=false;status.textContent="Retrying from step "+(index+1)+"…";try{for(let i=index;i<currentSteps.length;i++){if(stopRequested)break;if(currentSteps[i].status==="completed")continue;const ok=await runOne(i);if(!ok)break;}if(!stopRequested&&currentSteps.every(s=>s.status==="completed")){persist("completed");status.textContent="All steps completed.";}else if(stopRequested){persist("stopped");status.textContent="Stopped. Completed work is saved.";}}finally{active=null;run.disabled=false;stop.hidden=true;renderHistory();}}
 async function execute(e){e.preventDefault();const task=input.value.trim();if(!task||active)return;currentTask=task;currentSteps=[];stopRequested=false;activeId="task-"+Date.now();active={id:activeId,controller:null};run.disabled=true;run.textContent="Planning…";stop.hidden=false;progress.hidden=false;result.hidden=true;stepList.replaceChildren();status.textContent="Creating a step-by-step plan…";
  try{const planController=new AbortController();active.controller=planController;const plan=await request("plan-task",{task},planController.signal);active.controller=null;currentSteps=plan.steps.map(s=>({...s,status:"pending",result:"",error:""}));renderSteps();persist("running");status.textContent="Plan ready. Starting execution…";for(let i=0;i<currentSteps.length;i++){if(stopRequested)break;const ok=await runOne(i);if(!ok)break;}if(stopRequested){persist("stopped");status.textContent="Stopped. Your completed steps are saved.";}else if(currentSteps.every(s=>s.status==="completed")){persist("completed");status.textContent="All "+currentSteps.length+" steps completed.";}}
  catch(error){if(error.name==="AbortError"){persist("stopped");status.textContent="Planning stopped. No steps were started.";}else{status.textContent=error.message||"Planning failed. Retry the task.";}}finally{active=null;run.disabled=false;run.textContent="⚡ Plan & run";stop.hidden=true;renderHistory();}
 }
 stop.addEventListener("click",()=>{stopRequested=true;if(active?.controller)active.controller.abort();else status.textContent="Will stop after the current operation.";});
 clearHistory.addEventListener("click",()=>{if(!read().length)return;if(!confirm("Clear all saved Action Studio task history from this browser?"))return;save([]);activeId=null;renderHistory();});
 copy.addEventListener("click",async()=>{const text="# "+currentTask+"\n\n"+currentSteps.map(s=>"## "+s.title+" ["+s.status+"]\n\n"+(s.result||s.error||s.instruction)).join("\n\n");try{await navigator.clipboard.writeText(text);copy.textContent="Copied";setTimeout(()=>copy.textContent="Copy full result",1200);}catch{copy.textContent="Clipboard unavailable";}});
 download.addEventListener("click",()=>{const text="# "+currentTask+"\n\n"+currentSteps.map(s=>"## "+s.title+" ["+s.status+"]\n\n"+(s.result||s.error||s.instruction)).join("\n\n");const blob=new Blob([text],{type:"text/markdown;charset=utf-8"});const url=URL.createObjectURL(blob);const a=el("a");a.href=url;a.download="orivane-action-report.md";a.click();URL.revokeObjectURL(url);});
 form.addEventListener("submit",execute);function open(){overlay.hidden=false;document.body.classList.add("action-open");$("currentPage").textContent="Action Studio";renderHistory();input.focus();}function shut(){overlay.hidden=true;document.body.classList.remove("action-open");$("currentPage").textContent="Chat";}
 btn.addEventListener("click",open);close.addEventListener("click",shut);overlay.addEventListener("click",e=>{if(e.target===overlay)shut();});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!overlay.hidden)shut();});renderHistory();
})();
/* ORIVANE system status, CEO access and live visitor UI */
(()=>{
 const $=id=>document.getElementById(id);
 const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
 const side=$("sidebar");if(!side)return;
 const btn=el("button","side-link","◉ System status");btn.type="button";btn.id="systemStatusOpen";
 const anchor=$("pluginsOpen");if(anchor)anchor.insertAdjacentElement("afterend",btn);
 const overlay=el("div","status-overlay");overlay.id="systemStatus";overlay.hidden=true;
 const modal=el("section","status-modal");modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.setAttribute("aria-labelledby","statusTitle");
 const head=el("div","status-head"),titles=el("div","");
 titles.append(el("div","status-eyebrow","ORIVANE CONTROL CENTRE"),el("h2","","System status"),el("p","","A transparent view of what works, what is being built, and what is not connected yet."));
 const close=el("button","workspace-close","×");close.type="button";close.setAttribute("aria-label","Close status");head.append(titles,close);
 const grid=el("div","status-grid");
 const items=[
   {id:"chat",name:"AI chat",state:"READY",kind:"ready",detail:"The chat interface and Worker AI route are implemented."},
   {id:"personality",name:"Messenger-style personality",state:"READY",kind:"ready",detail:"Natural conversation, contextual replies, honest uncertainty and a clear AI identity are configured in the live model prompt."},
   {id:"research",name:"Research / update checking",state:"WIP",kind:"wip",detail:"Available to all members while in development. The Worker can attempt live search when its runtime exposes the search tool; live reliability still needs end-to-end testing."},
   {id:"actions",name:"Action Studio",state:"WIP",kind:"wip",detail:"Available to all members while in development. Creates plans of up to 6 steps, runs them sequentially, supports stop/retry and exports reports. It currently produces content; it cannot directly edit your files or control other apps."},
   {id:"projects",name:"Projects workspace",state:"READY",kind:"ready",detail:"Create projects, notes and task lists locally in this browser."},
   {id:"dashboard",name:"ORIVANE Dashboard",state:"READY",kind:"ready",detail:"Workspace overview with quick access to the new studios and local activity counts."},
   {id:"image-studio",name:"Image Studio",state:"WIP",kind:"wip",detail:"Generate images with the connected Worker AI image model. Early Access feature; generation availability depends on the model service."},
   {id:"long-memory",name:"Long-term Memory",state:"WIP",kind:"wip",detail:"Save, review and delete personal notes locally; saved notes can be included as context in future chats on this browser."},
   {id:"code-studio",name:"Code Studio",state:"WIP",kind:"wip",detail:"Write and save code drafts locally, download them, or ask ORIVANE chat to review and explain code."},
   {id:"automation-studio",name:"Automation Studio",state:"WIP",kind:"wip",detail:"Create and track local task checklists. It does not control external apps or run background automations."},
   {id:"operation-studio",name:"Operation Studio",state:"WIP",kind:"wip",detail:"Create named operations with objectives, priority, step checklists and progress tracking. Operations are stored locally; this release does not control external apps or devices."},
   {id:"klipy",name:"GIF Studio (KLIPY + AI GIFs)",state:"WIP",kind:"wip",detail:"Available to all members while in development. GIF search and AI GIF creation are experimental; availability also depends on the connected provider."},
   {id:"wipaccess",name:"WIP feature access",state:"WIP",kind:"wip",detail:"Future WIP features will require a verified Early Access entitlement. Existing WIP features remain available to all members."},
   {id:"visitors",name:"Live visitor counter",state:"SOON",kind:"soon",detail:"Needs shared server-side presence storage. A local counter would be misleading, so it is not presented as live."},
   {id:"ceo",name:"Secure owner access",state:"WIP",kind:"wip",detail:"JR is reserved and cannot be registered publicly. The owner setup code still needs to be configured before the JR account can be claimed."},
   {id:"passkey",name:"Device-bound verification",state:"SOON",kind:"soon",detail:"Requires a complete WebAuthn/passkey flow, server challenge storage and independent security testing."},
   {id:"profile",name:"Username + password accounts",state:"WIP",kind:"wip",detail:"Server-side password hashing, protected sessions and a shared account database are installed. JR remains reserved until owner setup is configured."},
   {id:"google",name:"Google sign-in shortcut",state:"SOON",kind:"soon",detail:"The button is waiting for Google OAuth client credentials and a registered callback URL."}
  ];
  const cards=new Map();
  items.forEach(item=>{const card=el("article","status-card");const top=el("div","status-card-top");const title=el("b","",item.name),pill=el("span","status-pill "+item.kind,item.state),detail=el("p","",item.detail);top.append(title,pill);card.append(top,detail);grid.append(card);cards.set(item.id,{pill,detail});});
  const statusNote=el("p","status-footer","Checking live service configuration…");
  async function refreshStatus(){
   try{
    const response=await fetch("https://nexus-ai-api.jessicaridelle.workers.dev/?action=health",{headers:{Accept:"application/json"}});
    if(!response.ok)throw new Error("Status endpoint unavailable");
    const data=await response.json(),s=data.services||{};
    const set=(id,state,kind,detail)=>{const c=cards.get(id);if(!c)return;c.pill.textContent=state;c.pill.className="status-pill "+kind;c.detail.textContent=detail;};
    set("chat",s.aiChat?"READY":"WIP",s.aiChat?"ready":"wip",s.aiChat?"Worker AI binding detected.":"Worker AI binding is not configured.");
    set("research","WIP","wip",s.webSearch?"Available to all members. Search method is exposed by the Worker runtime; actual search requests still need reliability testing.":"Available to all members. This Worker runtime does not expose the live web-search method yet.");
    set("klipy","WIP","wip",s.klipy?"Available to all members. KLIPY server key detected; provider requests can be attempted.":"Available to all members. Configure the KLIPY server key to enable GIF search.");
    set("image-studio",s.imageGeneration?"WIP":"SOON",s.imageGeneration?"wip":"soon",s.imageGeneration?"Early Access feature. Worker image model binding detected; generated images still need end-to-end testing.":"Image generation is unavailable because the Worker AI binding is missing.");
    set("profile",s.secureAuth?"WIP":"SOON",s.secureAuth?"wip":"soon",s.secureAuth?"D1 account storage and password/session endpoints are deployed. JR owner setup is still locked; browser cookie persistence and full sign-in flow have not yet been tested end to end.":"Secure account storage is not connected.");
    set("ceo",s.ownerClaimConfigured?"WIP":"SOON",s.ownerClaimConfigured?"wip":"soon",s.ownerClaimConfigured?"The private JR owner-claim setup is configured; role-gated owner tools still need implementation.":"JR is reserved. A private owner-claim secret must be configured before it can be claimed.");
    set("google",s.googleOAuth?"WIP":"SOON",s.googleOAuth?"wip":"soon",s.googleOAuth?"Google OAuth credentials are detected; callback flow still needs verification.":"Google OAuth client ID and secret are not configured.");
    statusNote.textContent="Configuration checked at "+new Date(data.checkedAt||Date.now()).toLocaleTimeString()+". A detected key or binding does not guarantee upstream service uptime.";
   }catch{statusNote.textContent="Live status check failed. Showing the last known feature notes; this does not mean every service is offline.";}
  }
  const security=el("section","status-security");security.append(el("h3","","CEO security gate"),el("p","","Owner-only controls remain disabled. Username/password authentication is implemented, but the JR owner claim is not configured and privileged actions are not yet implemented or independently verified."),el("div","status-denied","CEO ACCESS: DENIED · AUTHENTICATION NOT CONFIGURED"),el("small","","Do not enter passwords, recovery codes, or private account details here. This page does not collect them."));
 const footer=el("p","status-footer","Status labels: READY = implemented and configured · WIP = incomplete, unverified or provider-dependent · SOON = not yet usable. Live checks verify configuration, not full upstream uptime.");
 modal.append(head,grid,security,statusNote,footer);overlay.append(modal);document.body.append(overlay);
 function open(){overlay.hidden=false;document.body.classList.add("status-open");$("currentPage").textContent="System status";close.focus();refreshStatus();}
 function shut(){overlay.hidden=true;document.body.classList.remove("status-open");$("currentPage").textContent="Chat";}
 btn.addEventListener("click",open);close.addEventListener("click",shut);overlay.addEventListener("click",e=>{if(e.target===overlay)shut();});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!overlay.hidden)shut();});
})();
