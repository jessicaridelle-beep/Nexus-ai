/* ORIVANE GIF compatibility + accessible controls patch */
(()=>{
 const $=id=>document.getElementById(id);
 const cleanUrl=s=>String(s).replace(/[),.!?]+$/,"");
 function gifInfo(raw){
  try{
   const u=new URL(cleanUrl(raw)),host=u.hostname.toLowerCase(),path=u.pathname.toLowerCase();
   if(u.protocol!=="https:")return null;
   if((host==="media.tenor.com"||host==="media.giphy.com"||host.endsWith(".giphy.com")||host.endsWith(".tenor.com"))&&/\.(gif|webp|mp4|webm)$/.test(path))return {type:/\.(mp4|webm)$/.test(path)?"video":"image",url:u.href};
   if(host==="tenor.com"||host.endsWith(".tenor.com")){
    const id=u.pathname.split("/").filter(Boolean).reverse().find(x=>/^\d+$/.test(x));
    if(id)return {type:"embed",url:"https://tenor.com/embed/"+id,source:u.href};
   }
   if(host==="giphy.com"||host.endsWith(".giphy.com")){
    const parts=u.pathname.split("/").filter(Boolean);
    const id=parts.reverse().map(x=>x.match(/([a-z0-9]{8,})$/i)?.[1]).find(Boolean);
    if(id)return {type:"embed",url:"https://giphy.com/embed/"+id,source:u.href};
   }
  }catch{}
  return null;
 }
 window.renderMessageText=function(container,text){
  const raw=String(text),urls=(raw.match(/https?:\/\/[^\s<>"']+/g)||[]).map(cleanUrl);
  const match=urls.map(gifInfo).find(Boolean);
  if(!match){container.textContent=raw;return;}
  const source=match.source||match.url,at=urls.findIndex(u=>gifInfo(u)===match);
  let remainder=raw;
  for(const u of urls){if(gifInfo(u)){remainder=remainder.replace(u,"");break;}}
  if(remainder.trim())container.append(document.createTextNode(remainder.trim()+"\n"));
  if(match.type==="image"){
   const img=document.createElement("img");img.className="chat-gif";img.src=match.url;img.alt="Shared animated GIF";img.loading="lazy";
   img.onerror=()=>{img.remove();const a=document.createElement("a");a.href=source;a.target="_blank";a.rel="noopener noreferrer";a.textContent="GIF couldn't load here — open it ↗";container.append(a);};
   container.append(img);
  }else if(match.type==="video"){
   const video=document.createElement("video");video.className="chat-gif";video.src=match.url;video.autoplay=true;video.loop=true;video.muted=true;video.playsInline=true;video.controls=true;video.setAttribute("aria-label","Shared animated GIF");container.append(video);
  }else{
   const card=document.createElement("div");card.className="gif-embed-card";
   const frame=document.createElement("iframe");frame.src=match.url;frame.title="Animated GIF";frame.loading="lazy";frame.allow="autoplay; fullscreen";frame.referrerPolicy="strict-origin-when-cross-origin";
   card.append(frame);const link=document.createElement("a");link.href=source;link.target="_blank";link.rel="noopener noreferrer";link.textContent="Open GIF on its original site ↗";card.append(link);container.append(card);
  }
 };
 const gifButton=$("gifButton"),panel=$("gifPanel");
 if(gifButton&&panel){gifButton.setAttribute("aria-controls","gifPanel");gifButton.setAttribute("aria-expanded","false");const toggle=()=>gifButton.setAttribute("aria-expanded",String(!panel.hidden));gifButton.addEventListener("click",()=>setTimeout(toggle,0));$("closeGif")?.addEventListener("click",()=>gifButton.setAttribute("aria-expanded","false"));}
 const urlInput=$("gifUrl"),preview=$("gifPreview"),send=$("sendGif");
 function showPreview(){
  const info=gifInfo(urlInput.value.trim());preview.replaceChildren();preview.hidden=false;
  if(!info){preview.textContent="Paste a public Tenor/Giphy share link or a direct GIF, WebP, MP4 or WebM media link.";send.disabled=true;return;}
  if(info.type==="image"){const img=document.createElement("img");img.src=info.url;img.alt="GIF preview";img.onerror=()=>{preview.textContent="Preview unavailable. You can still open the original link.";};preview.append(img);}
  else if(info.type==="video"){const v=document.createElement("video");v.src=info.url;v.autoplay=true;v.loop=true;v.muted=true;v.playsInline=true;v.controls=true;v.setAttribute("aria-label","GIF preview");preview.append(v);}
  else{const frame=document.createElement("iframe");frame.src=info.url;frame.title="GIF preview";frame.allow="autoplay; fullscreen";preview.append(frame);const a=document.createElement("a");a.href=info.source;a.target="_blank";a.rel="noopener noreferrer";a.textContent="Open original GIF ↗";preview.append(a);}
  send.disabled=false;
 }
 $("previewGif")?.addEventListener("click",showPreview);
 urlInput?.addEventListener("input",()=>{send.disabled=true;});
 document.querySelectorAll("button").forEach(b=>{if(!b.getAttribute("aria-label")&&!b.textContent.trim())b.setAttribute("aria-label","Button");});
})();