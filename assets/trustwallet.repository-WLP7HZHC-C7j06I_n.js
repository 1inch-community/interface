import{K as a,a8 as m}from"./index-CbPEiJbB.js";var n={[a.eth]:"ethereum",[a.bnb]:"binance",[a.matic]:"polygon",[a.op]:"optimism",[a.arbitrum]:"arbitrum",[a.gnosis]:"",[a.avalanche]:"avalanchec",[a.fantom]:"fantom",[a.aurora]:"aurora",[a.klaytn]:"",[a.zkSyncEra]:"zksync"},c=({address:o,chainId:t})=>new Promise((s,e)=>{if(!o||!t||n[t]==="")return e();const r=new Image;r.onload=()=>s(r),r.onerror=e,r.src=`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${n[t]}/assets/${m(o.toLowerCase())}/logo.png`});export{c as trustWalletRepository};
//# sourceMappingURL=trustwallet.repository-WLP7HZHC-C7j06I_n.js.map
