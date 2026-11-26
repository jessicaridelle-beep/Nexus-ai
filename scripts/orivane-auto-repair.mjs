import fs from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";
import assert from "node:assert/strict";
export function synchronizeCache(html,sw,exists=()=>true){
 const versions=new Map(),repairs=[];
 for(const [,name,version] of html.matchAll(/(?:src|href)="([A-Za-z0-9_-]+[.](?:js|css))\?v=(\d+)"/g)){
  if(versions.has(name)&&versions.get(name)!==version)throw Error("Conflicting HTML versions");
  versions.set(name,version);
 }
 if(!versions.size)throw Error("No versioned local assets");
 let updated=sw;
 for(const [name,version] of versions){
  if(!exists(name))throw Error("Local asset missing");
  const re=new RegExp('(new URL\\("\\./'+name.replace(".","\\.")+'\\?v=)(\\d+)(".*, BASE\\))','g');
  const matches=[...updated.matchAll(re)];
  if(matches.length!==1)throw Error("Missing or duplicate cache entry");
  if(matches[0][2]!==version){updated=updated.replace(re,(_,a,b,c)=>a+version+c);repairs.push({kind:"cache_version",file:name,from:matches[0][2],to:version});}
 }
 if(repairs.length){const re=/const VERSION = "orivane-shell-v(\d+)";/g;if([...updated.matchAll(re)].length!==1)throw Error("Missing shell version");updated=updated.replace(re,(_,v)=>'const VERSION = "orivane-shell-v'+(Number(v)+1)+'";');}
 return {source:updated,repairs};
}
export function selfTest(){
 const h='<script src="script.js?v=3"></script><link href="style.css?v=2">';
 const sw='const VERSION = "orivane-shell-v9";\nnew URL("./script.js?v=2", BASE).href,\nnew URL("./style.css?v=2", BASE).href';
 const result=synchronizeCache(h,sw);
 assert.equal(result.repairs.length,1);assert.ok(result.source.includes("script.js?v=3"));assert.ok(result.source.includes("orivane-shell-v10"));assert.equal(synchronizeCache(h,result.source).source,result.source);assert.throws(()=>synchronizeCache(h,sw,()=>false));assert.throws(()=>synchronizeCache(h,sw.replace("script.js","missing.js")));assert.throws(()=>synchronizeCache(h+'<script src="script.js?v=4"></script>',sw));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const report=process.env.ORIVANE_REPAIR_REPORT||"/tmp/orivane-repair-report.json";
 let result={status:"failed",repairs:[]};
 try{selfTest();const html=fs.readFileSync("index.html","utf8"),sw=fs.readFileSync("sw.js","utf8");const fixed=synchronizeCache(html,sw,name=>fs.existsSync(name)&&fs.statSync(name).isFile());if(fixed.repairs.length)fs.writeFileSync("sw.js",fixed.source);result={status:fixed.repairs.length?"proposed":"no_changes",repairs:fixed.repairs};}catch{process.exitCode=1;}
 fs.writeFileSync(report,JSON.stringify(result,null,2)+"\n");console.log("Automatic repair:",result.status,result.repairs.length);
}
