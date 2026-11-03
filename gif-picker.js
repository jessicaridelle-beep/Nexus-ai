/* ORIVANE GIF Studio — KLIPY requests are proxied through the Worker; the app key stays server-side. */
(()=>{
 const $=id=>document.getElementById(id);
 const panel=$("gifPanel"),button=$("gifButton"),form=$("gifForm"),query=$("gifQuery"),grid=$("gifResults"),status=$("gifStatus");
 if(!panel||!button||!form||!grid)return;
 const API="https://nexus-ai-api.jessicaridelle.workers.dev/?action=klipy-gifs";
 let requestNo=0;
 button.setAttribute("aria-controls","gifPanel");button.setAttribute("aria-expanded","false");
 function show(open){panel.hidden=!open;button.setAttribute("aria-expanded",String(open));if(open){query.focus();load(query.value.trim());}}
 button.addEventListener("click",()=>{if(panel.hidden)window.orivaneWipGate("GIF Studio",()=>show(true));else show(false);});
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

 function encodeGif(frames,width,height,delayMs=120){
  const bytes=[];
  const put=(...values)=>bytes.push(...values);
  const u16=n=>put(n&255,(n>>8)&255);
  const writeText=s=>{for(let i=0;i<s.length;i++)put(s.charCodeAt(i));};
  writeText("GIF89a");u16(width);u16(height);put(0xF7,0,0);
  for(let i=0;i<256;i++){const r=(i>>5)&7,g=(i>>2)&7,b=i&3;put(Math.round(r*255/7),Math.round(g*255/7),Math.round(b*255/3));}
  put(0x21,0xFF,0x0B);writeText("NETSCAPE2.0");put(0x03,0x01,0x00,0x00,0x00);
  const delay=Math.max(2,Math.round(delayMs/10));
  for(const frame of frames){
   const indexed=new Uint8Array(width*height);
   for(let p=0;p<width*height;p++){const i=p*4;indexed[p]=((frame[i]>>5)<<5)|((frame[i+1]>>5)<<2)|(frame[i+2]>>6);}
   put(0x21,0xF9,0x04,0x00);u16(delay);put(0x00,0x00);
   put(0x2C);u16(0);u16(0);u16(width);u16(height);put(0x00);put(0x08);
   const compressed=gifLzwEncode(indexed,8);
   for(let i=0;i<compressed.length;i+=255){const chunk=compressed.slice(i,i+255);put(chunk.length,...chunk);}
   put(0x00);
  }
  put(0x3B);return new Uint8Array(bytes);
 }
 function gifLzwEncode(pixels,minCodeSize){
  const clearCode=1<<minCodeSize,endCode=clearCode+1;
  let codeSize=minCodeSize+1,nextCode=endCode+1,dictionary=new Map();
  const output=[];let bitBuffer=0,bitCount=0;
  const emit=code=>{bitBuffer|=code<<bitCount;bitCount+=codeSize;while(bitCount>=8){output.push(bitBuffer&255);bitBuffer>>>=8;bitCount-=8;}};
  emit(clearCode);
  if(!pixels.length){emit(endCode);if(bitCount)output.push(bitBuffer&255);return output;}
  let prefix=pixels[0];
  for(let i=1;i<pixels.length;i++){
   const symbol=pixels[i],key=prefix*256+symbol,found=dictionary.get(key);
   if(found!==undefined){prefix=found;continue;}
   emit(prefix);
   if(nextCode<4096){dictionary.set(key,nextCode++);if(nextCode>(1<<codeSize)&&codeSize<12)codeSize++;}
   else{emit(clearCode);dictionary.clear();codeSize=minCodeSize+1;nextCode=endCode+1;}
   prefix=symbol;
  }
  emit(prefix);emit(endCode);if(bitCount)output.push(bitBuffer&255);return output;
 }
 async function makeAnimatedGif(spriteSheetUrl){
  const image=new Image();image.decoding="async";image.src=spriteSheetUrl;
  await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error("The AI returned an image that could not be opened."));});
  if(image.naturalWidth<3||image.naturalHeight<3)throw new Error("The generated storyboard image is too small.");
  const cols=3,rows=3,size=160,cellW=image.naturalWidth/cols,cellH=image.naturalHeight/rows;
  const canvas=document.createElement("canvas");canvas.width=size;canvas.height=size;
  const context=canvas.getContext("2d",{willReadFrequently:true});if(!context)throw new Error("Your browser could not prepare the GIF frames.");
  const frames=[];
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
   const marginX=cellW*0.035,marginY=cellH*0.035;
   const sx=col*cellW+marginX,sy=row*cellH+marginY,sw=cellW-2*marginX,sh=cellH-2*marginY;
   context.clearRect(0,0,size,size);context.fillStyle="#fff";context.fillRect(0,0,size,size);
   context.drawImage(image,sx,sy,sw,sh,0,0,size,size);
   frames.push(new Uint8ClampedArray(context.getImageData(0,0,size,size).data));
  }
  const smoothFrames=frames.concat(frames.slice(1,-1).reverse());
  return new Blob([encodeGif(smoothFrames,size,size,120)],{type:"image/gif"});
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
 const creator=$("gifCreateView"),openCreator=$("openGifCreator"),backCreator=$("gifCreatorBack"),createForm=$("gifCreateForm"),createPrompt=$("gifCreatePrompt"),createSubmit=$("gifCreateSubmit"),createStatus=$("gifCreateStatus"),createResult=$("gifCreateResult"),createPreview=$("gifCreatePreview");

 let generatedGifUrl="";
 window.sendGifUrlToChat=function(url){
  const chat=$("chatContent"),welcome=$("welcome");
  if(!chat||typeof url!=="string"||!url)return false;
  const wrapper=document.createElement("div");wrapper.className="user-message";
  const img=document.createElement("img");img.className="chat-gif";img.src=url;img.alt="Generated animated GIF";img.loading="lazy";
  wrapper.append(img);chat.append(wrapper);if(welcome)welcome.hidden=true;
  chat.scrollIntoView({behavior:"smooth",block:"end"});return true;
 };
 function showCreator(open){creator.hidden=!open;form.hidden=open;grid.hidden=open;status.hidden=open;panel.querySelector(".gif-categories").hidden=open;panel.querySelector(".gif-create-entry").hidden=open;if(open)createPrompt.focus();}
 openCreator?.addEventListener("click",()=>showCreator(true));
 backCreator?.addEventListener("click",()=>showCreator(false));
 createForm?.addEventListener("submit",async e=>{
  e.preventDefault();const prompt=createPrompt.value.trim();if(!prompt)return;
  createSubmit.disabled=true;createSubmit.textContent="Creating…";createStatus.textContent="Generating the animation frames with ORIVANE AI…";createResult.hidden=true;
  generatedGifUrl="";
  try{
   const response=await fetch("https://nexus-ai-api.jessicaridelle.workers.dev/?action=create-gif",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});
   let data;try{data=await response.json();}catch{throw new Error("The GIF service returned an unreadable response.");}
   if(!response.ok)throw new Error(data.error||("GIF generation failed ("+response.status+")."));
   if(typeof data.image_data_url!=="string"||!data.image_data_url.startsWith("data:image/"))throw new Error("The AI did not return a usable storyboard image.");
   createStatus.textContent="Building the looping GIF…";
   const blob=await makeAnimatedGif(data.image_data_url);
   generatedGifUrl=URL.createObjectURL(blob);createPreview.src=generatedGifUrl;createResult.hidden=false;
   createStatus.textContent="Your animated GIF is ready. Download it or add it to chat!";
   let download=$("gifDownload");
   if(!download){
    download=document.createElement("button");download.type="button";download.id="gifDownload";download.textContent="↓ Download GIF";
    createResult.querySelector(".gif-create-actions")?.append(download);
   }
   download.onclick=()=>{if(!generatedGifUrl)return;const a=document.createElement("a");a.href=generatedGifUrl;a.download="orivane.gif";document.body.append(a);a.click();a.remove();};
  }catch(err){createStatus.textContent=err.message||"Couldn't create the GIF. Try again.";}
  finally{createSubmit.disabled=false;createSubmit.textContent="✦ Generate GIF";}
 });
 $("gifAddToChat")?.addEventListener("click",()=>{if(generatedGifUrl&&window.sendGifUrlToChat(generatedGifUrl)){createStatus.textContent="GIF added to chat.";show(false);}});
 $("gifRecreate")?.addEventListener("click",()=>{generatedGifUrl="";createResult.hidden=true;createStatus.textContent="Edit your prompt or generate another version.";createForm.requestSubmit();});
 const attribution=document.createElement("div");attribution.className="gif-attribution";attribution.textContent="GIF search by KLIPY · GIF creation by ORIVANE AI";panel.append(attribution);
 form.addEventListener("submit",e=>{e.preventDefault();load(query.value.trim());});
 panel.querySelectorAll("[data-gif-search]").forEach(b=>b.addEventListener("click",()=>{query.value=b.dataset.gifSearch;load(query.value);}));
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)show(false);});
 load("");
})();