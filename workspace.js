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
 function closeWorkspace(){overlay.hidden=true;editor.hidden=true;active=null;document.body.classList.remove("workspace-open");}
 function openWorkspace(){overlay.hidden=false;document.body.classList.add("workspace-open");render();close.focus();}
 close.addEventListener("click",closeWorkspace);overlay.addEventListener("click",e=>{if(e.target===overlay)closeWorkspace();});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!overlay.hidden)closeWorkspace();});
 $("projectsOpen")?.addEventListener("click",openWorkspace);
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