/* ORIVANE in-chat GIF picker — click a result to send it */
(()=>{
 const $=id=>document.getElementById(id);
 const panel=$("gifPanel"),button=$("gifButton"),form=$("gifForm"),query=$("gifQuery"),grid=$("gifResults"),status=$("gifStatus");
 if(!panel||!button||!form||!grid)return;
 button.setAttribute("aria-controls","gifPanel");button.setAttribute("aria-expanded","false");
 function show(open){panel.hidden=!open;button.setAttribute("aria-expanded",String(open));if(open){query.focus();load("");}}
 button.addEventListener("click",()=>show(panel.hidden));
 $("closeGif").addEventListener("click",()=>show(false));
 function render(items){
  grid.replaceChildren();
  if(!items.length){status.textContent="No GIFs found. Try another search.";return;}
  status.textContent="Tap any GIF to send it into the chat.";
  items.forEach(item=>{
   const url=item.url,preview=item.preview||url;
   const card=document.createElement("button");card.type="button";card.className="gif-result";card.title="Send this GIF";
   const img=document.createElement("img");img.src=preview;img.alt=item.description||"GIF";img.loading="lazy";
   img.onerror=()=>{card.remove();if(!grid.children.length)status.textContent="GIF previews couldn't load. Try again in a moment.";};
   const label=document.createElement("span");label.textContent="＋ Send";
   card.append(img,label);
   card.addEventListener("click",()=>{
    if(typeof window.sendMessage!=="function"){status.textContent="Chat is not ready yet.";return;}
    show(false);window.sendMessage(url);
   });
   grid.append(card);
  });
 }
 async function load(term){
  status.textContent="Finding GIFs…";grid.replaceChildren();
  try{
   const url=new URL("https://nexus-ai-api.jessicaridelle.workers.dev/");
   url.searchParams.set("action","gif-search");
   if(term!=="trending")url.searchParams.set("q",term);
   const response=await fetch(url,{headers:{Accept:"application/json"}});
   const data=await response.json();
   if(!response.ok)throw new Error(data.error||"GIF search is unavailable.");
   render(Array.isArray(data.results)?data.results:[]);
  }catch(error){status.textContent=error.message||"Couldn't load GIFs. Try again.";}
 }
 form.addEventListener("submit",e=>{e.preventDefault();const term=query.value.trim();if(term)load(term);});
 panel.querySelectorAll("[data-gif-search]").forEach(b=>b.addEventListener("click",()=>{query.value=b.dataset.gifSearch;load(query.value);}));
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)show(false);});
 load("");
})();