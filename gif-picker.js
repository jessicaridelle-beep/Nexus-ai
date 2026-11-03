/* ORIVANE GIF Studio — KLIPY client-side integration. API requests and media load directly from the browser. */
(()=>{
 const $=id=>document.getElementById(id);
 const panel=$("gifPanel"),button=$("gifButton"),form=$("gifForm"),query=$("gifQuery"),grid=$("gifResults"),status=$("gifStatus");
 if(!panel||!button||!form||!grid)return;
 const KEY="orivane-klipy-app-key";
 let requestNo=0;
 button.setAttribute("aria-controls","gifPanel");button.setAttribute("aria-expanded","false");
 function show(open){panel.hidden=!open;button.setAttribute("aria-expanded",String(open));if(open){query.focus();load(query.value.trim());}}
 button.addEventListener("click",()=>show(panel.hidden));
 $("closeGif").addEventListener("click",()=>show(false));
 function findItems(data){
   for(const k of ["data","results","gifs","items"]) if(Array.isArray(data?.[k])) return data[k];
   for(const k of ["data","results","gifs","items"]) if(data?.[k]&&typeof data[k]==="object"){const x=findItems(data[k]);if(x.length)return x;}
   return [];
 }
 function mediaUrl(item){
   const media=item?.media_formats||item?.media||item?.images||item?.file||item?.content||{};
   const candidates=[media?.gif?.url,media?.mediumgif?.url,media?.tinygif?.url,media?.nanogif?.url,media?.original?.url,media?.fixed_height?.url,media?.fixed_width?.url,media?.medium?.url,media?.preview?.url,media?.url,item?.url,item?.media_url,item?.gif_url,item?.file_url];
   return candidates.find(x=>typeof x==="string"&&/^https:\/\//i.test(x))||"";
 }
 function previewUrl(item){
   const media=item?.media_formats||item?.media||item?.images||item?.file||item?.content||{};
   const candidates=[media?.tinygif?.url,media?.nanogif?.url,item?.preview_url,item?.thumbnail_url,media?.preview?.url,media?.tiny?.url,media?.fixed_width_small?.url,media?.fixed_height_small?.url,media?.fixed_width?.url,media?.gif?.url,media?.url,media?.original?.url];
   return candidates.find(x=>typeof x==="string"&&/^https:\/\//i.test(x))||mediaUrl(item);
 }
 function render(items){
  grid.replaceChildren();
  if(!items.length){status.textContent="No GIFs found. Try another search or check your KLIPY key.";return;}
  status.textContent="Tap a GIF to send it into chat · Powered by KLIPY";
  items.forEach(item=>{
   const url=mediaUrl(item),preview=previewUrl(item);
   if(!url||!preview)return;
   const card=document.createElement("button");card.type="button";card.className="gif-result";card.title="Send this GIF";
   const img=document.createElement("img");img.src=preview;img.alt=item?.title||item?.slug||"GIF";img.loading="lazy";
   img.onerror=()=>{card.remove();if(!grid.children.length)status.textContent="GIF previews failed to load. Check your connection or try another search.";};
   const label=document.createElement("span");label.textContent="＋ Send";
   card.append(img,label);
   card.addEventListener("click",()=>{
    if(item?.slug){const activeKey=localStorage.getItem(KEY)||"";if(activeKey)fetch("https://api.klipy.com/api/v1/"+encodeURIComponent(activeKey)+"/gifs/share/"+encodeURIComponent(item.slug),{method:"POST",headers:{Accept:"application/json"}}).catch(()=>{});}
    if(typeof window.sendMessage!=="function"){status.textContent="Chat is not ready yet.";return;}
    show(false);window.sendMessage(url);
   });
   grid.append(card);
  });
  if(!grid.children.length)status.textContent="The provider returned results in an unsupported format. Check the KLIPY integration.";
 }
 async function load(term){
  const key=localStorage.getItem(KEY)||"";
  const thisRequest=++requestNo;
  grid.replaceChildren();
  if(!key){
    status.textContent="Add your KLIPY app key in the setup area below to load GIFs.";
    return;
  }
  status.textContent=term?"Searching KLIPY…":"Loading trending GIFs…";
  try{
   const endpoint=term
    ? "https://api.klipy.com/api/v1/"+encodeURIComponent(key)+"/gifs/search?page=1&per_page=24&q="+encodeURIComponent(term)+"&locale=en&country=be&contentfilter=high&media_filter=gif,tinygif"
    : "https://api.klipy.com/api/v1/"+encodeURIComponent(key)+"/gifs/trending?page=1&per_page=24&locale=en&country=be&contentfilter=high&media_filter=gif,tinygif";
   const response=await fetch(endpoint,{headers:{Accept:"application/json"}});
   let data;try{data=await response.json()}catch{throw new Error("KLIPY returned an unreadable response.");}
   if(thisRequest!==requestNo)return;
   if(!response.ok)throw new Error(data?.message||data?.error||("KLIPY request failed ("+response.status+"). Check the app key and its access."));
   const items=findItems(data);
   if(!items.length&&data?.error)throw new Error(typeof data.error==="string"?data.error:"KLIPY returned an API error.");
   render(items);
  }catch(error){if(thisRequest===requestNo)status.textContent=(error.message||"Couldn't load GIFs.")+" Your chat still works; GIF search needs a valid KLIPY key and browser access to api.klipy.com.";}
 }
 const footer=document.createElement("div");footer.className="gif-picker-footer";
 const setupForm=document.createElement("form");setupForm.className="gif-key-form";
 const keyLabel=document.createElement("label");keyLabel.className="gif-key-label";keyLabel.textContent="KLIPY app key";keyLabel.htmlFor="klipyAppKey";
 const keyInput=document.createElement("input");keyInput.id="klipyAppKey";keyInput.type="password";keyInput.autocomplete="off";keyInput.placeholder="Paste your app key";keyInput.value=localStorage.getItem(KEY)||"";
 const keySave=document.createElement("button");keySave.type="submit";keySave.textContent="Save & test";
 const keyClear=document.createElement("button");keyClear.type="button";keyClear.className="gif-key-clear";keyClear.textContent="Clear key";
 const keyHelp=document.createElement("a");keyHelp.href="https://docs.klipy.com/";keyHelp.target="_blank";keyHelp.rel="noopener noreferrer";keyHelp.textContent="KLIPY API help ↗";
 setupForm.append(keyLabel,keyInput,keySave,keyClear,keyHelp);footer.append(setupForm);
 const attribution=document.createElement("div");attribution.className="gif-attribution";attribution.textContent="Powered by KLIPY · Results stay in provider order";footer.append(attribution);panel.append(footer);
 keyClear.addEventListener("click",()=>{localStorage.removeItem(KEY);keyInput.value="";grid.replaceChildren();status.textContent="KLIPY key cleared from this browser.";});
 setupForm.addEventListener("submit",e=>{e.preventDefault();const value=keyInput.value.trim();if(!value){status.textContent="Paste your KLIPY app key first.";return;}localStorage.setItem(KEY,value);status.textContent="Testing KLIPY connection…";load(query.value.trim());});
 form.addEventListener("submit",e=>{e.preventDefault();load(query.value.trim());});
 panel.querySelectorAll("[data-gif-search]").forEach(b=>b.addEventListener("click",()=>{query.value=b.dataset.gifSearch;load(query.value);}));
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)show(false);});
 load("");
})();