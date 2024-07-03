import{W as o,X as r,Y as c,Z as l,K as a,ai as s,_ as h}from"./index-DsNu59EV.js";o();r();c();l();var m="screen and (max-width: 600px)",d=matchMedia(m);function _(){return d}var p=Object.keys(a).filter(e=>Number(e)&&e!==`${a.eth}`).map(e=>Number(e)),u=async()=>{const e=_(),t=document.querySelector("html"),n=(t==null?void 0:t.getAttribute("theme"))??"dark";return{projectId:s("walletConnectProjectId"),showQrModal:!0,chains:[a.eth],optionalChains:p,events:["chainChanged","accountsChanged"],methods:["eth_sendTransaction","eth_signTransaction","eth_sign","personal_sign","eth_signTypedData_v4"],optionalMethods:["wallet_switchEthereumChain","wallet_addEthereumChain","eth_getCode","personal_ecRecover"],qrModalOptions:{themeMode:n,enableExplorer:e.matches,mobileWallets:[{id:"mobileInchWallet",name:"1inch Wallet",links:{native:"oneinch://",universal:"https://wallet.1inch.io/"}}],walletImages:{mobileInchWallet:await h(()=>import("./inch-wallet-icon-HEUESFAQ-BKi_Hu2m.js"),__vite__mapDeps([0,1])).then(i=>i.icon)},themeVariables:{"--wcm-background-color":"var(--primary)","--wcm-accent-color":"var(--primary)","--wcm-color-bg-2":"none","--wcm-z-index":"2000","--wcm-color-fg-1":"var(--color-content-content-primary)"}}}};export{_ as getMobileMatchMedia,u as options};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/inch-wallet-icon-HEUESFAQ-BKi_Hu2m.js","assets/index-DsNu59EV.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
//# sourceMappingURL=wallet-connect-init-options-6CEW7FVS-1x6MzU4B.js.map
