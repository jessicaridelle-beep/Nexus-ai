/* ORIVANE motion enhancements — no framework dependencies */
(()=>{
  const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
  const root=document.documentElement;
  const targets=[
    ".suggestions",
    ".tool-dock",
    ".feature-strip",
    "footer",
    ".chat-content",
    ".voice-mode"
  ];
  function setup(){
    if(reduceMotion.matches){
      root.classList.remove("orivane-motion-ready");
      document.querySelectorAll(".motion-reveal").forEach(el=>el.classList.add("is-visible"));
      return;
    }
    root.classList.add("orivane-motion-ready");
    const elements=targets.flatMap(selector=>Array.from(document.querySelectorAll(selector)));
    elements.forEach(el=>el.classList.add("motion-reveal"));
    if(!("IntersectionObserver" in window)){
      elements.forEach(el=>el.classList.add("is-visible"));
      return;
    }
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:"0px 0px -24px 0px"});
    elements.forEach(el=>observer.observe(el));
  }
  setup();
  if(typeof reduceMotion.addEventListener==="function"){
    reduceMotion.addEventListener("change",()=>{
      if(reduceMotion.matches){
        root.classList.remove("orivane-motion-ready");
        document.querySelectorAll(".motion-reveal").forEach(el=>el.classList.add("is-visible"));
      }else setup();
    });
  }
})();
