import{_ as l}from"./index-DsNu59EV.js";function p(c={}){const{immediate:d=!1,onNeedRefresh:u,onOfflineReady:a,onRegistered:r,onRegisteredSW:s,onRegisterError:t}=c;let i,n;const o=async(e=!0)=>{await n};async function f(){if("serviceWorker"in navigator){if(i=await l(()=>import("./workbox-window.prod.es5-D5gOYdM7.js"),__vite__mapDeps([])).then(({Workbox:e})=>new e("/interface/sw.js",{scope:"/interface/",type:"classic"})).catch(e=>{t==null||t(e)}),!i)return;i.addEventListener("activated",e=>{(e.isUpdate||e.isExternal)&&window.location.reload()}),i.addEventListener("installed",e=>{e.isUpdate||a==null||a()}),i.register({immediate:d}).then(e=>{s?s("/interface/sw.js",e):r==null||r(e)}).catch(e=>{t==null||t(e)})}}return n=f(),o}export{p as registerSW};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
//# sourceMappingURL=virtual_pwa-register-DBKsqxu9.js.map
