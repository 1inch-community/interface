const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/one-inch.repository-AF3TE4XT-DAssC24p.js","assets/index.esm-DhwY4kHm.js","assets/uniswap.repository-MXTOGC4T-B1GaxKQK.js","assets/index.esm-Cc9myTra.js","assets/index-BNjDdafE.js","assets/index.esm-COc-PyqV.js","assets/trustwallet.repository-P6G45YEI-Ca9jIpiR.js","assets/pancakeswap.repository-LI7PUPCX-CBaSIX7t.js"])))=>i.map(i=>d[i]);
import{h as y,k as u,i as b,t as f,A as w,_ as a}from"./index-BNjDdafE.js";import{h as _,n as p,c as g}from"./index.esm-EHaIGh9g.js";import{C as m}from"./index.esm-DhwY4kHm.js";import{c as k,h as v}from"./index.esm-Cc9myTra.js";import"./index.esm-DS7GCQR2.js";import"./index.esm-OIwjBXxl.js";import"./index.esm-COc-PyqV.js";import"./combineLatest-Bzt_9bb6.js";import"./defer-BRewiDsk.js";import"./asap-D-qxMtYG.js";import"./index.esm-BW3s9G0O.js";import"./tap-DGvjHJum.js";import"./takeUntil-B9okj2Im.js";import"./index.esm-5Aerb1sL.js";var I=Object.defineProperty,x=Object.getOwnPropertyDescriptor,s=(t,e,r,o)=>{for(var i=o>1?void 0:o?x(e,r):e,l=t.length-1,c;l>=0;l--)(c=t[l])&&(i=(o?c(e,r,i):c(i))||i);return o&&i&&I(e,r,i),i},C=[()=>a(()=>import("./one-inch.repository-AF3TE4XT-DAssC24p.js"),__vite__mapDeps([0,1])).then(t=>t.oneInchRepository),()=>a(()=>import("./uniswap.repository-MXTOGC4T-B1GaxKQK.js"),__vite__mapDeps([2,1,3,4,5])).then(t=>t.uniSwapRepository),()=>a(()=>import("./trustwallet.repository-P6G45YEI-Ca9jIpiR.js"),__vite__mapDeps([6,1,3,4,5])).then(t=>t.trustWalletRepository),()=>a(()=>import("./pancakeswap.repository-LI7PUPCX-CBaSIX7t.js"),__vite__mapDeps([7,1,3,4,5])).then(t=>t.pancakeSwapRepository)],n=class extends y{constructor(){super(...arguments),this.size=24,this.task=new _(this,{task:([t,e,r],{signal:o})=>this.iconLoader(o,r,t,e),args:()=>[this.symbol,this.address,this.chainId]})}render(){return this.task.render({error:()=>h(this.size,this.symbol),pending:()=>h(this.size,this.symbol,!0),initial:()=>h(this.size,this.symbol,!0),complete:t=>(t.width=this.size,t.height=this.size,t.ondragstart=()=>!1,u`${t}`)})}updated(){this.style.width=`${this.size}px`,this.style.height=`${this.size}px`}async iconLoader(t,e,r,o){let i=await this.loadFromDatabase({chainId:e,symbol:r,address:o,signal:t});if(i===null&&(i=await d({chainId:e,symbol:r,address:o,signal:t})),i===null&&(i=await this.loadIconFromMultiChain({chainId:e,symbol:r,address:o,signal:t})),i===null)throw new Error("token icon not fount");return i}async loadFromDatabase(t){if(!t.chainId||!t.address)return null;const e=await this.applicationContext.tokenController.getTokenLogoURL(t.chainId,t.address);return e?await new Promise(r=>{const o=new Image;o.onerror=()=>r(null),o.onload=()=>r(o),o.src=e}):null}async loadIconFromMultiChain(t){if(t.chainId===m.eth||!t.symbol)return null;const e=await this.applicationContext.tokenController.getTokenBySymbol(m.eth,t.symbol);if(t.chainId&&t.address&&k(t.address)){const r=v(t.chainId);e.push(r)}for(const r of e){const o=await d({...t,chainId:r.chainId,address:r.address});if(o)return o}return null}};n.tagName="inch-token-icon";n.styles=b`

      :host {
          user-select: none;
          outline: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
      }

      .stub {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-background-bg-secondary);
          border-radius: 50%;
          color: var(--color-content-content-secondary);
          position: relative;
      }
      .stub-loader {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid;
          border-bottom-color: var(--secondary);
          border-top-color: var(--secondary);
          animation: spin 1s linear infinite;
      }
      
      img {
          user-select: none;
          outline: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
      }

      @keyframes spin {
          0% {
              transform: rotate(0deg);
          }

          100% {
              transform: rotate(360deg);
          }
      }
  
  `;s([p({type:String,attribute:!0})],n.prototype,"symbol",2);s([p({type:String,attribute:!0})],n.prototype,"address",2);s([p({type:Number,attribute:!0})],n.prototype,"chainId",2);s([p({type:Number,attribute:!0})],n.prototype,"size",2);s([g({context:w})],n.prototype,"applicationContext",2);n=s([f(n.tagName)],n);function h(t,e,r){return u`
    <div style="width: ${t}px; height: ${t}px; font-size: ${t<40?13:16}px" class="stub">
      <span>${(e==null?void 0:e.slice(0,t<40?1:2))??""}</span>
      ${r?u`<span class="stub-loader"></span>`:""}
    </div>
  `}async function d(t,e=0){const r=C[e];if(!r)return null;try{return await(await r())(t)}catch{return await d(t,e+1)}}export{n as TokenIconElement};
//# sourceMappingURL=index.esm-C1Espl6E.js.map
