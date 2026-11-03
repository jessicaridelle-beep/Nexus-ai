/* ORIVANE GIF Studio — KLIPY requests are proxied through the Worker; the app key stays server-side. */
(()=>{
 const $=id=>document.getElementById(id);
 const panel=$("gifPanel"),button=$("gifButton"),form=$("gifForm"),query=$("gifQuery"),grid=$("gifResults"),status=$("gifStatus");
 if(!panel||!button||!form||!grid)return;
 const API="https://nexus-ai-api.jessicaridelle.workers.dev/?action=klipy-gifs";
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
  if(!items.length){status.textContent="No GIFs found. Try another search.";return;}
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
    if(typeof window.sendMessage!=="function"){status.textContent="Chat is not ready yet.";return;}
    show(false);window.sendMessage(url);
   });
   grid.append(card);
  });
  if(!grid.children.length)status.textContent="The provider returned results in an unsupported format. Check the KLIPY integration.";
 }
 async function load(term){
  const thisRequest=++requestNo;
  grid.replaceChildren();
  status.textContent=term?"Searching KLIPY…":"Loading trending GIFs…";
  try{
   const endpoint=API+(term?"&q="+encodeURIComponent(term):"");
   const response=await fetch(endpoint,{headers:{Accept:"application/json"}});
   let data;try{data=await response.json()}catch{throw new Error("KLIPY returned an unreadable response.");}
   if(thisRequest!==requestNo)return;
   if(!response.ok)throw new Error(data?.message||data?.error||("KLIPY request failed ("+response.status+"). Check the app key and its access."));
   const items=findItems(data);
   if(!items.length&&data?.error)throw new Error(typeof data.error==="string"?data.error:"KLIPY returned an API error.");
   render(items);
  }catch(error){if(thisRequest===requestNo)status.textContent=(error.message||"Couldn't load GIFs.")+" Your chat still works; the site owner needs to configure the KLIPY key on the Worker.";}
 }
 const attribution=document.createElement("div");attribution.className="gif-attribution";attribution.textContent="Powered by KLIPY · Secure server-side connection";panel.append(attribution);
 form.addEventListener("submit",e=>{e.preventDefault();load(query.value.trim());});
 panel.querySelectorAll("[data-gif-search]").forEach(b=>b.addEventListener("click",()=>{query.value=b.dataset.gifSearch;load(query.value);}));
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)show(false);});
 load("");
})();