import{aa as a,ap as o,_ as n}from"./index-Bgau2dAd.js";var r="screen and (max-width: 600px)",i=matchMedia(r);function c(){return i}var l=Object.keys(a).filter(e=>Number(e)&&e!==`${a.eth}`).map(e=>Number(e)),m=async()=>{const e=c();return{projectId:o("walletConnectProjectId"),showQrModal:!0,chains:[a.eth],optionalChains:l,events:["chainChanged","accountsChanged"],methods:["eth_sendTransaction","eth_signTransaction","eth_sign","personal_sign"],optionalMethods:["eth_signTypedData_v4","wallet_switchEthereumChain","wallet_addEthereumChain","eth_getCode","personal_ecRecover"],qrModalOptions:{themeMode:"dark",enableExplorer:e.matches,mobileWallets:[{id:"mobileInchWallet",name:"1inch Wallet",links:{native:"oneinch://",universal:"https://wallet.1inch.io/"}}],walletImages:{mobileInchWallet:await n(()=>import("./inch-wallet-icon-PSAAWKRP-S89rj93W.js"),__vite__mapDeps([])).then(t=>t.icon)},themeVariables:{"--wcm-background-color":"var(--primary)","--wcm-accent-color":"var(--primary)","--wcm-color-bg-2":"none","--wcm-color-bg-1":"var(--color-background-bg-primary)","--wcm-color-fg-1":"var(--color-content-content-primary)"}}}};export{c as getMobileMatchMedia,m as options};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
//# sourceMappingURL=wallet-connect-init-options-Z7S3QDE6-D5t1M2gf.js.map
