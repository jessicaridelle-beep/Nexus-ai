/* ORIVANE 2.3 — local chat history, prompt library and chat tools */
(()=>{
  const $=id=>document.getElementById(id);
  const HISTORY_KEY="orivane-chat-history-v1";
  const PROMPTS_KEY="orivane-prompt-library-v1";
  let activeChatId=null;
  const read=(key,fallback=[])=>{try{const v=JSON.parse(localStorage.getItem(key)||"null");return Array.isArray(v)?v:fallback;}catch{return fallback;}};
  const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const snapshot=()=>({id:activeChatId||("chat-"+Date.now()),title:(conversation||[]).find(m=>m.role==="user")?.content?.slice(0,52)||"New conversation",updated:Date.now(),messages:(conversation||[]).slice(-100)});
  function saveChat(){const messages=conversation||[];if(!messages.length)return;const item=snapshot();activeChatId=item.id;let all=read(HISTORY_KEY);const i=all.findIndex(x=>x.id===item.id);if(i>=0)all[i]=item;else all.unshift(item);write(HISTORY_KEY,all.sort((a,b)=>b.updated-a.updated).slice(0,40));renderHistory();}
  function renderHistory(){const box=$("chatHistory");if(!box)return;box.replaceChildren();read(HISTORY_KEY).forEach(chat=>{const row=document.createElement("div");row.className="history-item";const open=document.createElement("button");open.type="button";open.className="history-open";open.textContent=chat.title||"Saved conversation";open.addEventListener("click",()=>loadChat(chat.id));const del=document.createElement("button");del.type="button";del.className="history-delete";del.textContent="×";del.setAttribute("aria-label","Delete conversation");del.addEventListener("click",e=>{e.stopPropagation();write(HISTORY_KEY,read(HISTORY_KEY).filter(x=>x.id!==chat.id));if(activeChatId===chat.id)activeChatId=null;renderHistory();});row.dataset.chatId=chat.id;row.append(open,del);box.append(row);});}
  function loadChat(id){const chat=read(HISTORY_KEY).find(x=>x.id===id);if(!chat)return;conversation.length=0;conversation.push(...chat.messages);$("chatContent").replaceChildren();chat.messages.forEach(m=>addMessage(m.role,m.content,true));$("welcome").hidden=true;activeChatId=id;$("currentPage").textContent="Chat";$("chatNote")?.textContent;renderHistory();document.querySelectorAll(".side-link").forEach(b=>b.classList.toggle("active",b.dataset.view==="chat"));}
  const originalSend=sendMessage;
  if(typeof originalSend==="function"){sendMessage=async value=>{const result=await originalSend(value);saveChat();return result;};}
  $("newChat")?.addEventListener("click",()=>{activeChatId=null;renderHistory();});
  $("exportChat")?.addEventListener("click",()=>{const messages=conversation||[];if(!messages.length){alert("There is no conversation to export yet.");return;}const text=messages.map(m=>(m.role==="user"?"YOU":"ORIVANE")+":\n"+m.content).join("\n\n");const blob=new Blob([text],{type:"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="orivane-chat.txt";a.click();URL.revokeObjectURL(url);});
  function getPrompts(){return read(PROMPTS_KEY);}
  function renderPrompts(){const list=$("promptLibraryList");if(!list)return;list.replaceChildren();const prompts=getPrompts();if(!prompts.length){const p=document.createElement("p");p.textContent="No saved prompts yet. Use Save prompt to add one.";list.append(p);return;}prompts.forEach((item,index)=>{const row=document.createElement("div");row.className="prompt-library-item";const use=document.createElement("button");use.type="button";use.className="prompt-use";use.textContent=item.title;use.title=item.text;use.addEventListener("click",()=>{ $("promptInput").value=item.text;$("promptInput").focus();$("promptOverlay").hidden=true;});const remove=document.createElement("button");remove.type="button";remove.textContent="Delete";remove.addEventListener("click",()=>{const next=getPrompts();next.splice(index,1);write(PROMPTS_KEY,next);renderPrompts();});row.append(use,remove);list.append(row);});}
  function openPrompts(){$("promptOverlay").hidden=false;document.body.classList.add("dialog-open");renderPrompts();}
  $("openPrompts")?.addEventListener("click",openPrompts);
  $("savedPromptsOpen")?.addEventListener("click",openPrompts);
  $("promptClose")?.addEventListener("click",()=>{$("promptOverlay").hidden=true;if(!document.querySelector(".overlay:not([hidden])"))document.body.classList.remove("dialog-open");});
  $("savePrompt")?.addEventListener("click",()=>{const text=$("promptInput").value.trim();if(!text){alert("Write a prompt first, then save it.");return;}const title=prompt("Name this prompt:",text.slice(0,38));if(!title)return;const prompts=getPrompts();if(prompts.length>=50){alert("Your prompt library is full (50 prompts).");return;}prompts.unshift({title:title.slice(0,60),text});write(PROMPTS_KEY,prompts);renderPrompts();});
  $("regenerateLast")?.addEventListener("click",()=>{const messages=conversation||[];if(!messages.length||messages[messages.length-1].role!=="assistant"){alert("There is no last answer to regenerate.");return;}messages.pop();const last=messages[messages.length-1];if(!last||last.role!=="user"){alert("The last question could not be found.");return;}const question=last.content;messages.pop();$("chatContent").replaceChildren();messages.forEach(m=>addMessage(m.role,m.content,true));sendMessage(question);});

  // Chat-local tools: never modify existing messages or send a request automatically.
  function installConversationTools(){
    const chat=$("chatContent"),composer=$("promptInput");if(!chat||!composer||$("orivaneChatFind"))return;
    const translations=[
      ["Find in chat","Rechercher dans la discussion","Zoeken in chat","Im Chat suchen","Buscar en el chat"],
      ["Search messages…","Rechercher des messages…","Berichten zoeken…","Nachrichten suchen…","Buscar mensajes…"],
      ["Previous match","Résultat précédent","Vorige overeenkomst","Vorheriger Treffer","Resultado anterior"],
      ["Next match","Résultat suivant","Volgende overeenkomst","Nächster Treffer","Resultado siguiente"],
      ["Close search","Fermer la recherche","Zoeken sluiten","Suche schließen","Cerrar búsqueda"],
      ["No matches","Aucun résultat","Geen resultaten","Keine Treffer","Sin resultados"],
      ["Quote","Citer","Citeren","Zitieren","Citar"],
      ["Reuse prompt","Réutiliser le prompt","Prompt hergebruiken","Prompt wiederverwenden","Reutilizar mensaje"],
      ["Copy chat","Copier la discussion","Chat kopiëren","Chat kopieren","Copiar chat"],
      ["Copy failed","Échec de la copie","Kopiëren mislukt","Kopieren fehlgeschlagen","Error al copiar"],
      ["No messages yet","Aucun message","Nog geen berichten","Noch keine Nachrichten","Aún no hay mensajes"],
      ["Draft too long","Brouillon trop long","Concept te lang","Entwurf zu lang","Borrador demasiado largo"],
      ["Saved replies","Réponses enregistrées","Opgeslagen antwoorden","Gespeicherte Antworten","Respuestas guardadas"],
      ["Save reply","Enregistrer la réponse","Antwoord opslaan","Antwort speichern","Guardar respuesta"],
      ["Reply saved","Réponse enregistrée","Antwoord opgeslagen","Antwort gespeichert","Respuesta guardada"],
      ["No saved replies","Aucune réponse enregistrée","Geen opgeslagen antwoorden","Keine gespeicherten Antworten","Sin respuestas guardadas"],
      ["Remove","Supprimer","Verwijderen","Entfernen","Eliminar"],
      ["Insert into draft","Insérer dans le brouillon","In concept invoegen","In Entwurf einfügen","Insertar en borrador"],
      ["Follow-up","Suite","Vervolgvraag","Nachfrage","Seguimiento"],
      ["Shorter","Plus court","Korter","Kürzer","Más corto"],
      ["More detail","Plus de détails","Meer details","Mehr Details","Más detalles"],
      ["Give examples","Donner des exemples","Geef voorbeelden","Beispiele geben","Dar ejemplos"],
      ["Review for errors","Vérifier les erreurs","Controleer op fouten","Auf Fehler prüfen","Revisar errores"],
      ["Copy Markdown","Copier le Markdown","Markdown kopiëren","Markdown kopieren","Copiar Markdown"],
      ["Jump to latest","Dernier message","Laatste bericht","Letzte Nachricht","Último mensaje"],
      ["Saved replies stay on this device.","Les réponses restent sur cet appareil.","Antwoorden blijven op dit apparaat.","Antworten bleiben auf diesem Gerät.","Las respuestas permanecen en este dispositivo."]
    ];
    if(typeof ORIVANE_UI_MAP!=="undefined")for(const row of translations)ORIVANE_UI_MAP.set(row[0],row);
    const t=key=>typeof orivaneT==="function"?orivaneT(key):key;
    const button=(key,fn)=>{const b=document.createElement("button");b.type="button";b.dataset.chatToolLabel=key;b.textContent=t(key);b.addEventListener("click",fn);return b;};
    const toolbar=document.createElement("div");toolbar.className="orivane-conversation-tools";
    const panel=document.createElement("div");panel.className="orivane-find-panel";panel.hidden=true;panel.id="orivaneChatFind";
    const field=document.createElement("input");field.type="search";field.placeholder=t("Search messages…");field.setAttribute("aria-label",t("Search messages…"));
    const counter=document.createElement("span");counter.className="orivane-find-counter";counter.setAttribute("role","status");
    let matches=[],current=-1,frame=0;
    const rows=()=>Array.from(chat.children).filter(row=>row.matches(".user-message,.assistant-message"));
    const messageText=row=>{
      const source=row.querySelector(".assistant-message-content")||row;
      const clone=source.cloneNode(true);
      clone.querySelectorAll("button,input,.message-actions,.orivane-local-actions,.orivane-code-tools").forEach(n=>n.remove());
      return (clone.textContent||"").trim();
    };
    const clearHighlight=()=>rows().forEach(row=>row.classList.remove("orivane-find-match","orivane-find-current"));
    function selectMatch(index,scroll=true){
      matches.forEach(row=>row.classList.remove("orivane-find-current"));
      current=matches.length?(index+matches.length)%matches.length:-1;
      if(current>=0){const row=matches[current];row.classList.add("orivane-find-current");if(scroll)row.scrollIntoView({block:"center",behavior:"auto"});}
      counter.textContent=matches.length?(current+1)+" / "+matches.length:field.value.trim()?t("No matches"):"";
      prev.disabled=next.disabled=!matches.length;
    }
    function search(scroll=false){
      const selected=matches[current],query=field.value.trim().toLocaleLowerCase();clearHighlight();
      matches=query?rows().filter(row=>messageText(row).toLocaleLowerCase().includes(query)):[];
      matches.forEach(row=>row.classList.add("orivane-find-match"));
      selectMatch(Math.max(0,matches.indexOf(selected)),scroll);
    }
    function closeSearch(){panel.hidden=true;find.setAttribute("aria-expanded","false");field.value="";clearHighlight();matches=[];current=-1;counter.textContent="";}
    const find=button("Find in chat",()=>{if(!panel.hidden){closeSearch();return;}panel.hidden=false;find.setAttribute("aria-expanded","true");field.focus();search();});
    find.setAttribute("aria-controls",panel.id);find.setAttribute("aria-expanded","false");
    const prev=button("Previous match",()=>selectMatch(current-1)),next=button("Next match",()=>selectMatch(current+1)),close=button("Close search",()=>{closeSearch();find.focus();});
    prev.disabled=next.disabled=true;
    field.addEventListener("input",()=>search(true));field.addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();selectMatch(current+(event.shiftKey?-1:1));}else if(event.key==="Escape"){closeSearch();find.focus();}});
    async function copy(value,b){
      const key=b.dataset.chatToolLabel;
      try{await navigator.clipboard.writeText(value);b.textContent=t("Copied!");}catch{b.textContent=t("Copy failed");}
      setTimeout(()=>{if(b.isConnected)b.textContent=t(key);},1300);
    }
    const copyChat=button("Copy chat",()=>{if(!conversation.length){counter.textContent=t("No messages yet");if(panel.hidden){copyChat.textContent=t("No messages yet");setTimeout(()=>copyChat.textContent=t("Copy chat"),1300);}return;}
      const text=conversation.map(m=>(m.role==="user"?"You":"ORIVANE")+":\n"+(m.role==="assistant"?orivaneReadableReply(m.content):m.content)).join("\n\n");copy(text,copyChat);
    });
    function insertDraft(value){
      if(!value)return;const existing=composer.value;
      const combined=existing?existing+"\n\n"+value:value;
      if(combined.length>5500){chatNote.textContent=t("Draft too long");return;}
      composer.value=combined;composer.dispatchEvent(new Event("input",{bubbles:true}));composer.focus();composer.setSelectionRange(combined.length,combined.length);
    }
    const savedKey="orivane-saved-replies-v1";
    const savedPanel=document.createElement("section");savedPanel.className="orivane-saved-replies";savedPanel.hidden=true;savedPanel.id="orivaneSavedReplies";
    const savedList=document.createElement("div");savedList.className="orivane-saved-list";
    const savedHint=document.createElement("small");savedHint.textContent=t("Saved replies stay on this device.");
    const savedToggle=button("Saved replies",()=>{savedPanel.hidden=!savedPanel.hidden;savedToggle.setAttribute("aria-expanded",String(!savedPanel.hidden));if(!savedPanel.hidden)renderSaved();});
    savedToggle.setAttribute("aria-controls",savedPanel.id);savedToggle.setAttribute("aria-expanded","false");
    const jump=button("Jump to latest",()=>rows().at(-1)?.scrollIntoView({block:"end",behavior:"auto"}));
    function replySource(row){
      const raw=typeof orivaneMessageSources!=="undefined"?orivaneMessageSources.get(row):undefined;
      if(typeof raw==="string"&&raw.trim())return row.matches(".assistant-message")?orivaneReadableReply(raw):raw;
      return messageText(row);
    }
    function savedReplies(){return read(savedKey).filter(x=>x&&typeof x.id==="string"&&typeof x.text==="string"&&x.text.trim()&&x.text.length<=6000).slice(0,30);}
    function renderSaved(){
      const items=savedReplies();savedList.replaceChildren();
      if(!items.length){const empty=document.createElement("p");empty.textContent=t("No saved replies");savedList.append(empty);return;}
      for(const item of items){
        const entry=document.createElement("article");entry.className="orivane-saved-entry";
        const preview=document.createElement("p");preview.textContent=item.text.length>280?item.text.slice(0,280)+"…":item.text;
        const tools=document.createElement("div");tools.className="orivane-local-actions";
        const c=button("Copy",()=>copy(item.text,c));
        tools.append(c,button("Insert into draft",()=>insertDraft(item.text.slice(0,1800))),button("Remove",()=>{try{write(savedKey,savedReplies().filter(x=>x.id!==item.id));renderSaved();}catch{chatNote.textContent="Saved reply could not be removed.";}}));
        entry.append(preview,tools);savedList.append(entry);
      }
    }
    function saveReply(row,b){
      const value=replySource(row).trim().slice(0,6000);if(!value)return;
      try{
        const items=savedReplies();
        if(!items.some(x=>x.text===value)){
          if(items.length>=30){chatNote.textContent="Saved replies are full. Remove one first.";return;}
          items.unshift({id:globalThis.crypto?.randomUUID?.()||String(Date.now())+"-"+String(Math.random()).slice(2),text:value});
          write(savedKey,items);
        }
        b.textContent=t("Reply saved");setTimeout(()=>{if(b.isConnected)b.textContent=t("Save reply");},1300);
        if(!savedPanel.hidden)renderSaved();
      }catch{chatNote.textContent="Saved reply could not be stored on this device.";}
    }
    function followUp(row){
      const group=document.createElement("span");group.className="orivane-followup";
      const menu=document.createElement("span");menu.className="orivane-followup-menu";menu.hidden=true;
      const toggle=button("Follow-up",()=>{menu.hidden=!menu.hidden;toggle.setAttribute("aria-expanded",String(!menu.hidden));});
      toggle.setAttribute("aria-expanded","false");
      const actions=[["Shorter","Make this reply shorter while keeping the main points."],["More detail","Expand this reply with useful details."],["Give examples","Give practical examples that explain this reply."],["Review for errors","Review this reply for possible errors or unsupported claims. State uncertainty clearly."]];
      for(const [label,prompt] of actions)menu.append(button(label,()=>{
        const value=replySource(row).trim().slice(0,1800);if(value)insertDraft(prompt+"\n\nReply to review:\n"+value.split("\n").map(line=>"> "+line).join("\n"));
        menu.hidden=true;toggle.setAttribute("aria-expanded","false");
      }));
      group.append(toggle,menu);return group;
    }
    savedPanel.append(savedHint,savedList);
    function decorate(){
      for(const row of rows()){
        if(row.querySelector(".orivane-local-actions"))continue;
        const isUser=row.matches(".user-message"),host=isUser?row:row.querySelector(".message-actions");if(!host)continue;
        // An empty assistant row is the live stream placeholder, not a finished message.
        if(!isUser&&!replySource(row).trim())continue;
        const group=document.createElement("span");group.className="orivane-local-actions";
        const text=()=>messageText(row);
        if(isUser){const copyButton=button("Copy",()=>copy(text(),copyButton));group.append(copyButton,button("Reuse prompt",()=>insertDraft(text())));}
        group.append(button("Quote",()=>{const value=text();if(value)insertDraft(value.slice(0,1200).split("\n").map(line=>"> "+line).join("\n")+"\n");}));
        if(!isUser){const save=button("Save reply",()=>saveReply(row,save));const md=button("Copy Markdown",()=>copy(replySource(row),md));group.append(save,md,followUp(row));}
        host.append(group);
      }
    }
    function schedule(){if(frame)return;frame=requestAnimationFrame(()=>{frame=0;decorate();if(!panel.hidden)search();});}
    panel.append(field,counter,prev,next,close);toolbar.append(find,copyChat,savedToggle,jump,panel,savedPanel);chat.before(toolbar);
    new MutationObserver(schedule).observe(chat,{childList:true,subtree:true,characterData:true});
    new MutationObserver(()=>{field.placeholder=t("Search messages…");field.setAttribute("aria-label",field.placeholder);for(const b of [...toolbar.querySelectorAll("[data-chat-tool-label]"),...chat.querySelectorAll("[data-chat-tool-label]")])b.textContent=t(b.dataset.chatToolLabel);if(!panel.hidden)search();savedHint.textContent=t("Saved replies stay on this device.");if(!savedPanel.hidden)renderSaved();}).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
    $("newChat")?.addEventListener("click",closeSearch);
    decorate();
  }
  installConversationTools();
  renderHistory();
})();