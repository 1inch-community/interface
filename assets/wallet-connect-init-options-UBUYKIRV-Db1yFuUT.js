import{V as a,a9 as r,U as i}from"./index-CiPMkqQ5.js";var c="screen and (max-width: 600px)",l=matchMedia(c);function h(){return l}var s=Object.keys(a).filter(e=>Number(e)&&e!==`${a.eth}`).map(e=>Number(e)),d=async()=>{const e=h(),t=document.querySelector("html"),n=(t==null?void 0:t.getAttribute("theme"))??"dark";return{projectId:r("walletConnectProjectId"),showQrModal:!0,chains:[a.eth],optionalChains:s,events:["chainChanged","accountsChanged"],methods:["eth_sendTransaction","eth_signTransaction","eth_sign","personal_sign"],optionalMethods:["eth_signTypedData_v4","wallet_switchEthereumChain","wallet_addEthereumChain","eth_getCode","personal_ecRecover"],qrModalOptions:{themeMode:n,enableExplorer:e.matches,mobileWallets:[{id:"mobileInchWallet",name:"1inch Wallet",links:{native:"oneinch://",universal:"https://wallet.1inch.io/"}}],walletImages:{mobileInchWallet:await i(()=>import("./inch-wallet-icon-LDWABVQH-S89rj93W.js"),__vite__mapDeps([])).then(o=>o.icon)},themeVariables:{"--wcm-background-color":"var(--primary)","--wcm-accent-color":"var(--primary)","--wcm-color-bg-2":"none","--wcm-color-fg-1":"var(--color-content-content-primary)"}}}};export{h as getMobileMatchMedia,d as options};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
//# sourceMappingURL=wallet-connect-init-options-UBUYKIRV-Db1yFuUT.js.map
