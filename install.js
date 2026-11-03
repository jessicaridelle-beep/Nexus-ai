(()=>{
 const button=document.createElement("button");
 button.type="button";button.id="orivaneInstallButton";button.className="header-action";
 button.textContent="↓ Install app";button.hidden=true;
 const top=document.querySelector(".top-right");
 if(top)top.prepend(button);
 let installPrompt=null;
 const isStandalone=()=>window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true;
 const setInstalled=()=>{button.hidden=true;button.textContent="✓ App installed";};
 if(isStandalone())setInstalled();
 window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault();installPrompt=event;button.hidden=false;button.textContent="↓ Install ORIVANE";
 });
 window.addEventListener("appinstalled",()=>{installPrompt=null;setInstalled();});
 button.addEventListener("click",async()=>{
  if(installPrompt){
   installPrompt.prompt();
   const choice=await installPrompt.userChoice;
   if(choice?.outcome==="accepted")button.hidden=true;
   installPrompt=null;return;
  }
  const ua=navigator.userAgent;
  let instructions="To install ORIVANE, open your browser menu and choose Install app or Create shortcut.";
  if(/android/i.test(ua))instructions="On Android: open ORIVANE in Chrome, tap ⋮, then Install app (or Add to Home screen).";
  else if(/iphone|ipad/i.test(ua))instructions="On iPhone/iPad: open ORIVANE in Safari, tap Share, then Add to Home Screen.";
  else if(/windows/i.test(ua))instructions="On Windows: open ORIVANE in Microsoft Edge or Chrome, then use the install icon in the address bar or the browser menu → Install ORIVANE.";
  alert(instructions);
 });
 if("serviceWorker" in navigator && location.protocol==="https:"){
  window.addEventListener("load",()=>{
   navigator.serviceWorker.register("./sw.js",{scope:"./"}).then(reg=>{
    if(reg.waiting)reg.waiting.postMessage("SKIP_WAITING");
    reg.addEventListener("updatefound",()=>{const worker=reg.installing;if(worker)worker.addEventListener("statechange",()=>{if(worker.state==="installed"&&navigator.serviceWorker.controller)worker.postMessage("SKIP_WAITING");});});
   }).catch(error=>console.warn("ORIVANE offline app setup unavailable:",error));
  });
 }
})();