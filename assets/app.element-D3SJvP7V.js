const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-DSKku2tv.js","assets/index-DzdJdA38.js","assets/index.esm-Ckwp2s7b.js","assets/index.esm-DhwY4kHm.js","assets/index.esm-OIwjBXxl.js","assets/index.esm-COc-PyqV.js","assets/combineLatest-Bzt_9bb6.js","assets/defer-BRewiDsk.js","assets/asap-D-qxMtYG.js","assets/index.esm-CRGBZtlm.js","assets/index.esm-D_u9_Lp4.js","assets/index.esm-CkQhZQuA.js","assets/tap-DGvjHJum.js","assets/takeUntil-B9okj2Im.js","assets/index.esm-5Aerb1sL.js","assets/index.esm-BcUoR516.js","assets/index.esm-CVTxmY36.js","assets/index.esm-BK-OeSSB.js","assets/import-wrapper-prod-hit9ecK7.js","assets/index.esm-J_Lh850I.js","assets/firstValueFrom-RTAQ66ca.js","assets/index.esm-Bj2JS5nA.js","assets/swap-form-mobile.element-C4GwX0s7.js","assets/swap-form.style-BDxEIhEI.js","assets/swap-form-desktop.element-CGv9ICH-.js"])))=>i.map(i=>d[i]);
import{i as m,t as y,h as $,k as a,A as W,_ as X,Q as rn,r as an,E as re}from"./index-DzdJdA38.js";import{m as O,s as cn,d as E,a as tt,b as I,g as At,c as Ne,e as Z,o as T,f as Qt,i as Bt,l as Oe,r as ln,h as hn,j as Ve,k as pn,t as v}from"./index.esm-Ckwp2s7b.js";import{i as jt,n as x,R as j,c as C,r as P,h as ze,f as ae,a as g,t as Q,O as Le,b as De,d as te,s as Fe,e as un,g as ee,j as dn,S as fn,k as xe,K as ye,l as vt,m as We,o as $e}from"./index.esm-CRGBZtlm.js";import{B as mn,L as gn,i as ne,n as wn,f as z,g as Ce,a as vn,o as Rt,s as L,m as ke,d as Ht,b as Be,w as bn,c as je,e as He,h as xn,j as ce,k as yn,l as $n,p as Cn,q as kn,r as Sn,U as En}from"./index.esm-CkQhZQuA.js";import{C as le}from"./index.esm-BcUoR516.js";import{o as Tn,c as In,i as An,C as N,m as A,S as Pt,L as _t,s as J,a as Zt,f as Ut,b as _n,B as Pn}from"./index.esm-DhwY4kHm.js";import{i as Mn,S as K,w as Ue}from"./index.esm-CVTxmY36.js";import{t as _}from"./tap-DGvjHJum.js";import{d as b}from"./defer-BRewiDsk.js";import{f as zt}from"./takeUntil-B9okj2Im.js";import"./index.esm-Bj2JS5nA.js";import{getRainbowGradient as Rn,getThemeChange as Nn,scrollbarStyle as On}from"./index.esm-D_u9_Lp4.js";import{storage as Se,JsonParser as Vn}from"./index.esm-COc-PyqV.js";import{i as Lt,B as zn,a as Ln}from"./index.esm-BK-OeSSB.js";import{f as Mt}from"./firstValueFrom-RTAQ66ca.js";import{c as ft}from"./combineLatest-Bzt_9bb6.js";function qe(t){return Tn(function(e,n){var i=null,s=!1,o;i=e.subscribe(In(n,void 0,void 0,function(r){o=An(t(r,qe(t)(e))),i?(i.unsubscribe(),i=null,o.subscribe(n)):s=!0})),s&&(i.unsubscribe(),i=null,o.subscribe(n))})}class Dn extends mn{constructor({value:e}){super(`Number \`${e}\` is not a valid decimal number.`,{name:"InvalidDecimalNumberError"})}}function ie(t,e){if(!/^(-?)([0-9]*)\.?([0-9]*)$/.test(t))throw new Dn({value:t});let[n,i="0"]=t.split(".");const s=n.startsWith("-");if(s&&(n=n.slice(1)),i=i.replace(/(0+)$/,""),e===0)Math.round(+`.${i}`)===1&&(n=`${BigInt(n)+1n}`),i="";else if(i.length>e){const[o,r,l]=[i.slice(0,e-1),i.slice(e-1,e),i.slice(e)],c=Math.round(+`${r}.${l}`);c>9?i=`${BigInt(o)+BigInt(1)}0`.padStart(o.length+1,"0"):i=`${o}${c}`,i.length>e&&(i=i.slice(1),n=`${BigInt(n)+1n}`),i=i.slice(0,e)}else i=i.padEnd(e,"0");return BigInt(`${s?"-":""}${n}${i}`)}function Fn({context:t}){return(e,n)=>{const i=new WeakMap;if(typeof n=="object")return n.addInitializer(function(){i.set(this,new jt(this,{context:t}))}),{get(){return e.get.call(this)},set(s){var o;return(o=i.get(this))==null||o.setValue(s),e.set.call(this,s)},init(s){var o;return(o=i.get(this))==null||o.setValue(s),s}};{e.constructor.addInitializer(r=>{i.set(r,new jt(r,{context:t}))});const s=Object.getOwnPropertyDescriptor(e,n);let o;if(s===void 0){const r=new WeakMap;o={get(){return r.get(this)},set(l){i.get(this).setValue(l),r.set(this,l)},configurable:!0,enumerable:!0}}else{const r=s.set;o={...s,set(l){i.get(this).setValue(l),r==null||r.call(this,l)}}}return void Object.defineProperty(e,n,o)}}}const Wn=m`
    
    :host {
        --height: 100vh;
        overflow-y: auto;
        overflow-x: hidden !important;
        height: var(--height);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: var(--color-background-bg-body);
        overscroll-behavior: none;
        touch-action: pan-y;
        transition: height .2s;
    }

    @supports (height: 100dvh) {
        :host {
            --height: 100dvh;
        }
    }
    
    ${O(m`
        :host::-webkit-scrollbar {
            display: none;
        }
    `)}
    
    ${cn(m`
        :host {
            height: calc(var(--height) - 10px);
        }
    `)}

    .content {
        display: flex;
        width: 100%;
        justify-content: center;
        margin-bottom: auto;
    }

`,Bn=m`
    .header-container {
        width: 100%;
        box-sizing: border-box;
        padding: 16px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1400px;
        margin: 0 auto;
    }
    
    .mobile-header {
        height: 56px;
        padding: 8px;
        max-width: 100vw;
    }
    
    .left-content {
    }
    
    .right-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }

`;var jn=Object.defineProperty,Hn=Object.getOwnPropertyDescriptor,mt=(t,e,n,i)=>{for(var s=i>1?void 0:i?Hn(e,n):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(i?r(e,n,s):r(s))||s);return i&&s&&jn(e,n,s),s},Un=m`
    
    :host {
        background-color: var(--color-background-bg-primary);
        border-radius: 24px;
        width: fit-content;
        height: fit-content;
        display: block;
    }

    :host(.shadow) {
        box-shadow: 0 -3px 4px 0 var(--primary-12), 0 6px 12px 0 var(--primary-12);
    }

    :host(.mobile) {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        width: 100vw;
        height: fit-content;
        box-shadow: none;
    }
    
    .card-content {
        padding: 8px;
        display: flex;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        flex-direction: column;
        gap: 8px;
    }

`,it=class extends ${constructor(){super(...arguments),this.forMobileView=!1,this.showShadow=!1}render(){return a`
      <slot name="header"></slot>
      <div class="card-content">
        <slot></slot>
      </div>
    `}firstUpdated(){this.forMobileView&&!this.classList.contains("mobile")&&this.classList.add("mobile"),this.showShadow&&!this.classList.contains("shadow")&&this.classList.add("shadow")}};it.tagName="inch-card";it.styles=Un;mt([x({type:Boolean})],it.prototype,"forMobileView",2);mt([x({type:Boolean})],it.prototype,"showShadow",2);it=mt([y(it.tagName)],it);var qn=m`

    :host {
        display: flex;
        height: 60px;
        width: 100%;
        padding: 16px 16px 0;
        box-sizing: border-box;
        border-top-left-radius: 32px;
        border-top-right-radius: 32px;
    }
    
    :host(.not-native-mode) {
        height: 44px;
        padding: 0;
    }

    .card-header-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        width: 100%;
        height: 100%;
    }

    .position-container {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        color: var(--color-content-content-primary);
        gap: 8px;
        word-wrap: break-word;
        white-space: nowrap;
    }

    .center-container {
        justify-content: center;
    }

    .left-container {
        justify-content: flex-start;
    }

    .right-container {
        justify-content: flex-end;
    }

    .card-header-title {
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
        letter-spacing: 0;
        text-align: center;
    }
    
    .card-header-title__left:not(.card-header-title__and-back) {
        margin-left: 8px;
    }

    .card-header-title__left:not(.card-header-title__and-back):dir(rtl) {
        margin-right: 8px;
    }

    ${O(m`
        .card-header-title {
            font-size: 16px;
        }
        :host {
            padding: 8px 8px 0;
        }
    `)}

`,Y=class extends ${constructor(){super(),this.headerTextPosition="center",this.backButton=!1,this.closeButton=!1,this.slotDirty={},this.slot="header"}render(){return a`
      <div class="card-header-container">
        <div class="position-container left-container">
          <slot @slotchange="${()=>this.onSlotChange("left")}" name="left-container"></slot>
          ${this.getBackButton("left")}
          ${this.getHeader("left")}
        </div>
        <div class="position-container center-container">
          <slot @slotchange="${()=>this.onSlotChange("center")}" name="center-container"></slot>
          ${this.getHeader("center")}
        </div>
        <div class="position-container right-container">
          <slot @slotchange="${()=>this.onSlotChange("right")}" name="right-container"></slot>
          ${this.getCloseButton("right")}
        </div>
      </div>
    `}firstUpdated(){var t;((t=this.parentElement)==null?void 0:t.localName)!=="inch-card"&&this.classList.add("not-native-mode")}getHeader(t){const e=this.slotDirty[t]??!1,n={"card-header-title":!0,[`card-header-title__${t}`]:!0,"card-header-title__and-back":this.backButton};return this.headerTextPosition===t&&!e?a`
      <span class="${j(n)}">${this.headerText}</span>
    `:""}getBackButton(t){const e=this.slotDirty[t]??!1;return this.backButton&&!e?a`
      <inch-button @click="${n=>E(this,"backCard",null,n)}" size="l" type="tertiary-gray">
        <inch-icon icon="arrowLeft24"></inch-icon>
      </inch-button>
    `:""}getCloseButton(t){const e=this.slotDirty[t]??!1;return this.closeButton&&!e?a`
      <inch-button @click="${n=>E(this,"closeCard",null,n)}" size="l" type="tertiary-gray">
        <inch-icon icon="cross24"></inch-icon>
      </inch-button>
    `:""}onSlotChange(t){this.slotDirty={...this.slotDirty,[t]:!0},this.requestUpdate()}};Y.tahName="inch-card-header";Y.styles=qn;mt([x({type:String,attribute:!0})],Y.prototype,"headerText",2);mt([x({type:String,attribute:!0})],Y.prototype,"headerTextPosition",2);mt([x({type:Boolean,attribute:!0})],Y.prototype,"backButton",2);mt([x({type:Boolean,attribute:!0})],Y.prototype,"closeButton",2);Y=mt([y(Y.tahName)],Y);const Yn=Object.freeze(Object.defineProperty({__proto__:null,get CardElement(){return it},get CardHeaderElement(){return Y}},Symbol.toStringTag,{value:"Module"}));function*he(t,e){if(t!==void 0){let n=0;for(const i of t)yield e(i,n++)}}var Gn=Object.defineProperty,Zn=Object.getOwnPropertyDescriptor,w=(t,e,n,i)=>{for(var s=i>1?void 0:i?Zn(e,n):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(i?r(e,n,s):r(s))||s);return i&&s&&Gn(e,n,s),s},Kn=m`
  
`,Xn=m`
    
    :host {
        display: block;
        transition: height .2s;
        overflow: hidden;
    }

    .wallet-view-container {
        display: flex;
        align-content: center;
        justify-content: space-between;
        padding: 20px 16px;
        border-radius: 16px;
        transition: background-color .2s, height .2s;
        position: relative;
        overflow: hidden;
        color: var(--color-content-content-primary);
    }

    .wallet-icon {
        width: 24px;
        height: 24px;
    }

    .wallet-name {
        color: var(--color-content-content-primary);
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
    }
    
    .connect-icon {
        color: var(--color-content-content-primary);
        margin-left: auto;
        transform: scale(0);
        transition: transform .2s;
    }
    
    .connect-icon__connected {
        transform: scale(1);
        transition: color .2s;
        color: var(--color-content-content-primary);
    }
    
    .connect-icon__active {
        transform: scale(1);
        transition: color .2s;
        color: var(--primary);
    }
    
    .data-container {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .loader-icon {
        height: 24px;
        width: 24px;
        margin-left: auto;
    }
    
    .address-list {
        display: flex;
        flex-direction: column;
    }

    inch-wallet-view-address-balance {
        transform: translate3d(24px, 0, 0);
        transition: transform .2s;
        will-change: transform;
    }
    
    .add-connection {
        transition: transform .2s;
        transform: scale(0);
    }

    .address-container__active inch-wallet-view-address-balance {
        transform: translate3d(0, 0, 0);
    }
    
    .wallet-view-container__wc.wallet-view-container__connected:not(.wallet-view-container__loading) .right-data {
        transform: translate3d(36px, 0, 0);
        transition: transform .2s;
    }
    
    .sub-wallet-icon:dir(rtl) {
        transform: scale(-1, 1);
    }
    
    @media (hover: hover) {
        .wallet-view-container:hover {
            background-color: var(--color-background-bg-secondary);
        }
        .wallet-view-container:hover .connect-icon {
            transform: scale(1);
        }
        .wallet-view-container:hover inch-wallet-view-address-balance {
            transform: translate3d(0, 0, 0);
        }
        .wallet-view-container:hover .add-connection {
            transform: scale(1);
        }
        .wallet-view-container:hover.wallet-view-container__wc.wallet-view-container__connected .right-data {
            transform: translate3d(0, 0, 0);
        }
    }
    
    @media (hover: none) {
        .wallet-view-container__wc.wallet-view-container__connected:not(.wallet-view-container__loading) .right-data {
            transform: translate3d(0, 0, 0);
        }

        .add-connection {
            transform: scale(1);
        }
    }

    @keyframes rainbow {
        0% {
            background-position: 0;
        }
        100% {
            background-position: 100%;
        }
    }

`,pe=De(Symbol("controller context")),Jn=m`

    :host {
        color: var(--color-content-content-primary);
        text-align: right;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
    }

    .loader {
        will-change: filter;
        height: 20px;
        width: 60px;
        background-color: var(--color-background-bg-secondary);
        border-radius: 4px;
        animation: stub-loader-animation 3s ease-in-out infinite;
    }

    @keyframes stub-loader-animation {
        0%, 100% {
            filter: opacity(1);
        }
        50% {
            filter: opacity(0.5);
        }
    }

`,Ee=new gn("inch-wallet-view-address-balance",7),st=class extends ${constructor(){super(...arguments),this.task=new ze(this,async([t,e])=>{if(!t||!e)throw new Error("");const n=await this.applicationContext.tokenController.getTokenBalance(t,wn,e),i=ae(z(BigInt((n==null?void 0:n.amount)??0),18),6);return Ee.set([this.chainId,this.address].join(":"),i),i},()=>[this.chainId,this.address])}render(){return this.task.render({pending:()=>this.getLoader(),error:()=>this.getLoader(),complete:t=>{if(this.chainId===void 0)throw new Error("");const e=Ce(this.chainId);return a`<span>${t} ${e.nativeCurrency.symbol}</span>`}})}getLoader(){const t=()=>a`<div class="loader"></div>`;if(!this.chainId||!this.address)return t();const e=Ee.get([this.chainId,this.address].join(":")),n=Ce(this.chainId);return e?a`<span>${e} ${n.nativeCurrency.symbol}</span>`:t()}};st.tagName="inch-wallet-view-address-balance";st.styles=Jn;w([x({type:Number})],st.prototype,"chainId",2);w([x({type:String})],st.prototype,"address",2);w([C({context:W})],st.prototype,"applicationContext",2);st=w([y(st.tagName)],st);var R=class extends ${constructor(){super(...arguments),this.showLoader=!1,this.isWalletConnected=!1,this.addressList=null,this.activeAddress=null,this.showAddresses=!1,this.isActiveWallet=!1}firstUpdated(){if(!this.info)throw new Error("");const t=this.getController().getDataAdapter(this.info),e=this.getController().data;tt(this,[t.isConnected$.pipe(_(n=>this.isWalletConnected=n)),t.activeAddress$.pipe(_(n=>this.activeAddress=n)),t.addresses$.pipe(_(n=>this.addressList=n.length?n:null)),e.chainId$.pipe(_(n=>this.chainId=n??void 0)),e.isActiveWallet$(this.info).pipe(_(n=>this.isActiveWallet=n))],{requestUpdate:!1})}render(){var s;if(!this.info)throw new Error("");const t=((s=this.addressList)==null?void 0:s.length)??0,e=(this.showAddresses&&t>1?t*64:0)+64;I(this,{height:`${e}px`});const n=this.info.uuid==="walletConnect",i={"wallet-view-container":!0,"wallet-view-container__wc":n,"wallet-view-container__connected":this.isWalletConnected,"wallet-view-container__loading":this.showLoader};return a`
      <div class="${j(i)}" @click="${()=>this.onClick()}">
        <div class="data-container left-data">
          <img class="wallet-icon" alt="${this.info.name}" src="${this.info.icon}">
          <span class="wallet-name">${this.info.name}</span>
        </div>
        <div class="data-container right-data">
          ${g(this.activeAddress,o=>a`
            <span>${te(o)}</span>
          `)}
          ${g(this.showLoader,()=>a`
              <inch-icon class="loader-icon" icon="fire48"></inch-icon>`,()=>{const o={"connect-icon":!0,"connect-icon__connected":this.isWalletConnected,"connect-icon__active":this.isActiveWallet};return a`
                <inch-icon class="${j(o)}" icon="connect16"></inch-icon>
                ${g(n&&this.activeAddress,()=>a`
                  <inch-button @click="${r=>this.onConnect(r)}" class="add-connection" size="l" type="tertiary">
                    <inch-icon icon="plusCircle16"></inch-icon>
                  </inch-button>
                `)}
              `})}
        </div>
      </div>


      ${g(this.addressList&&this.addressList.length>1,()=>a`
          <div class="address-list">
            ${he(this.addressList,o=>a`
                <div @click="${()=>this.setActiveAddress(o)}" class="wallet-view-container address-container ${Qt(this.isActiveAddress(o).then(r=>r?"address-container__active":""))}">
                  <div class="data-container left-data">
                    <inch-icon class="sub-wallet-icon" icon="cornerDownRight16"></inch-icon>
                    <span>${te(o,{width:this.offsetWidth})}</span>
                  </div>
                  <div class="data-container right-data">
                    <inch-wallet-view-address-balance chainId="${Q(this.chainId)}" address="${o}"></inch-wallet-view-address-balance>
                    <inch-icon class="connect-icon ${Qt(this.isActiveAddress(o).then(r=>r?"connect-icon__active":""))}" icon="link16"></inch-icon>
                  </div>
                </div>
              `)}
          </div>
        `)}
    `}async onClick(){if(this.isWalletConnected){if(this.addressList&&this.addressList.length===1){await this.setActiveAddress(this.addressList[0]);return}this.showAddresses=!this.showAddresses;return}await this.onConnect()}async onConnect(t){if(!this.info||this.showLoader)return;t==null||t.preventDefault(),t==null||t.stopPropagation(),this.showLoader=!0;const e=this.info.uuid==="walletConnect";this.isWalletConnected&&e?this.showAddresses=await this.getController().addConnection(this.info):this.showAddresses=await this.getController().connect(this.info),this.showLoader=!1}async setActiveAddress(t){this.info&&await this.getController().setActiveAddress(this.info,t)}getController(){if(!this.controller)throw new Error("");return this.controller}isActiveAddress(t){if(!this.info)throw new Error("");return this.getController().data.isActiveAddress(this.info,t)}};R.tagName="inch-wallet-view";R.styles=Xn;w([x({type:Object})],R.prototype,"info",2);w([P()],R.prototype,"showLoader",2);w([P()],R.prototype,"isWalletConnected",2);w([P()],R.prototype,"addressList",2);w([P()],R.prototype,"activeAddress",2);w([P()],R.prototype,"showAddresses",2);w([P()],R.prototype,"isActiveWallet",2);w([P()],R.prototype,"chainId",2);w([C({context:pe})],R.prototype,"controller",2);R=w([y(R.tagName)],R);var Nt=class extends ${constructor(){super(...arguments),this.task=new ze(this,async()=>await this.getController().getSupportedWallets(),()=>[])}render(){return this.task.render({pending:()=>a`<inch-icon icon="unicornRun"></inch-icon>`,complete:t=>a`
        <inch-scroll-view-consumer>
          ${he(t,e=>a`<inch-wallet-view .info="${e}"></inch-wallet-view>`)}
        </inch-scroll-view-consumer>
      `})}getController(){if(!this.controller)throw new Error("");return this.controller}};Nt.tagName="inch-wallet-list";w([C({context:pe})],Nt.prototype,"controller",2);Nt=w([y(Nt.tagName)],Nt);var ot=class extends ${constructor(){super(...arguments),this.mobileMedia=At(),this.context=new jt(this,{context:pe})}firstUpdated(){Ne(this)}render(){if(!this.controller)throw new Error("For the inch-wallet-manage widget to work, you need to pass the controller corresponding to the interface in the controller field");this.context.value||this.context.setValue(this.controller);const t=this.controller.isConnected?"Wallet management":"Connect wallet";return a`
      <inch-card showShadow="${Q(this.showShadow)}" forMobileView="${Q(this.mobileMedia.matches?"":void 0)}">
        <inch-card-header closeButton headerText="${t}"></inch-card-header>
        <inch-wallet-list></inch-wallet-list>
      </inch-card>
    `}};ot.tagName="inch-wallet-manage";ot.styles=Kn;w([x({type:Object,attribute:!1})],ot.prototype,"controller",2);w([x({type:Boolean})],ot.prototype,"showShadow",2);ot=w([y(ot.tagName)],ot);var Qn=m`

    .connect-wallet-view-container {
        padding: 8px 5px 8px 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        border-radius: 12px;
        background: var(--color-background-bg-primary);
        height: 40px;
        box-sizing: border-box;
    }

    .connect-wallet-view-icon {
        width: 24px;
        height: 24px;
    }
    
    ${O(m`
        .connect-wallet-view-container {
            padding: 6px;
            width: 36px;
            height: 36px;
        }
    `)}

`,rt=class extends ${constructor(){super(...arguments),this.mobileMatchMedia=Z(this),this.overlay=new Le("#app-root",this),this.overlayId=null,this.chainId$=b(()=>this.getController().data.chainId$),this.activeAddress$=b(()=>this.getController().data.activeAddress$),this.info$=b(()=>this.getController().data.info$),this.icon$=this.info$.pipe(A(t=>t.icon)),this.name$=this.info$.pipe(A(t=>t.name)),this.activeAddressView$=this.activeAddress$.pipe(A(t=>t&&te(t))),this.view$=b(()=>this.getController().data.isConnected$).pipe(A(t=>t?this.getConnectedView():this.getConnectWalletButton()))}render(){return a`${T(this.view$)}`}getConnectedView(){return a`
      <div class="connect-wallet-view-container" @click="${()=>this.mobileMatchMedia.matches&&this.onOpenConnectView()}">
        <img class="connect-wallet-view-icon" alt="${T(this.name$)}" src="${T(this.icon$)}">
        ${g(!this.mobileMatchMedia.matches,()=>a`
          <inch-wallet-view-address-balance address="${T(this.activeAddress$)}" chainId="${T(this.chainId$)}"></inch-wallet-view-address-balance>
          <inch-button @click="${()=>this.onOpenConnectView()}" type="secondary" size="m">
            ${T(this.activeAddressView$)}
          </inch-button>
        `)}
      </div>
    `}getConnectWalletButton(){return a`
      <inch-button
        @click="${()=>this.onOpenConnectView()}"
        type="${this.mobileMatchMedia.matches?"primary-gray":"secondary"}"
        size="${this.mobileMatchMedia.matches?"l":"xl"}"
      >
        ${g(this.mobileMatchMedia.matches,()=>a`<inch-icon icon="wallet24"></inch-icon>`,()=>a`<span>Connect wallet</span>`)}
      </inch-button>
    `}getController(){if(!this.controller)throw new Error("");return this.controller}async onOpenConnectView(){if(this.overlay.isOpen){await this.overlay.close(this.overlayId??0),this.overlayId=null;return}this.overlayId=await this.overlay.open(a`
      <inch-wallet-manage @closeCard="${()=>{this.overlayId&&(this.overlay.close(this.overlayId),this.overlayId=null)}}" .controller="${this.controller}" ></inch-wallet-manage>
    `)}};rt.tagName="inch-connect-wallet-view";rt.styles=Qn;w([x({type:Object,attribute:!1})],rt.prototype,"controller",2);w([le()],rt.prototype,"onOpenConnectView",1);rt=w([y(rt.tagName)],rt);var ti=m`

    .unsupported {
        color: var(--color-core-red-critical);
    }
    
`,wt={[N.eth]:{name:"Ethereum",iconName:"eth24"},[N.arbitrum]:{name:"Arbitrum",iconName:"arbitrum24"},[N.op]:{name:"Optimism",iconName:"op24"},[N.zkSyncEra]:{name:"zkSync Era",iconName:"zkSyncEra24"},[N.bnb]:{name:"BNB Smart Chain",iconName:"bnb24",priority:1},[N.matic]:{name:"Polygon",iconName:"matic24",priority:1},[N.gnosis]:{name:"Gnosis",iconName:"gnosis24"},[N.avalanche]:{name:"Avalanche",iconName:"avalanche24"},[N.fantom]:{name:"Fantom",iconName:"fantom24"},[N.aurora]:{name:"Aurora",iconName:"aurora24"},[N.klaytn]:{name:"Klaytn",iconName:"klaytn24"}},ei=Object.keys(wt).filter(t=>Mn(+t)).map(t=>({...wt[t],chainId:Number(t)})).sort((t,e)=>t.chainId==N.eth?-1:e.chainId==N.eth?1:ne(t.chainId)?-1:ne(e.chainId)?1:(e.priority??0)-(t.priority??0)),ni=m`

    .card {
        height: 100%;
    }

    .scroll-container {
        position: relative;
        height: 100%;
        overflow-y: auto;
    }

    .scroll-overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }

`,ii=m`
    
    :host {
        width: 100%;
        height: 100%;
    }

    .container {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 40px;
        padding: 0 8px;
        border-radius: 12px;
        background-color: transparent;
        transition: background-color .2s;
        color: var(--color-content-content-primary);
        font-size: 14px;
    }
    
    .active .list-icon {
        transform: scale(1);
        color: var(--primary);
    }
    
    .list-icon {
        margin-left: auto;
        transition: transform .2s;
        transform: scale(0);
    }
    
    @media (hover: hover) {
        .container:hover {
            background-color: var(--color-background-bg-secondary);
        }
        .container:hover .list-icon {
            transform: scale(1);
        }
    }

    .container:active {
        background-color: var(--color-background-bg-secondary);
    }

    ${O(m`
        .container {
            height: 50px;
            font-size: 16px;
        }
    `)}

`,at=class extends ${constructor(){super(...arguments),this.mobileMedia=Z(this)}render(){if(!this.info)return;const t=ne(this.info.chainId),n={container:!0,active:Number(this.info.chainId)===this.activeChainId},i=this.mobileMedia.matches?26:24;return a`
      <div class="${j(n)}" @click="${()=>this.setChainId()}">
        ${g(t,()=>a`<inch-icon icon="${Bt()?"l2ChainRTL24":"l2Chain24"}"></inch-icon>`)}
        <inch-icon width="${i}px" height="${i}px" icon="${this.info.iconName}"></inch-icon>
        <span>${this.info.name}</span>
        <inch-icon class="list-icon" icon="link16"></inch-icon>
      </div>
    `}async setChainId(){var t;if(!this.info)throw new Error("");await((t=this.controller)==null?void 0:t.changeChain(this.info.chainId)),E(this,"closeCard",null)}};at.tagName="inch-chain-selector-list-item";at.styles=ii;w([x({type:Object})],at.prototype,"info",2);w([x({type:Number})],at.prototype,"activeChainId",2);w([x({type:Object,attribute:!1})],at.prototype,"controller",2);at=w([y(at.tagName)],at);var ct=class extends ${constructor(){super(...arguments),this.mobileMedia=Z(this)}firstUpdated(){if(!this.controller)throw new Error("");tt(this,[this.controller.data.chainId$.pipe(_(t=>this.activeChainId=t??void 0))],{requestUpdate:!1})}render(){return this.mobileMedia.matches?this.getMobileList():this.getDesktopList()}getList(){return ei.map(t=>a`
      <inch-chain-selector-list-item
        .info="${t}"
        .controller="${this.controller}"
        activeChainId="${Q(this.activeChainId)}"
      ></inch-chain-selector-list-item>
    `)}getMobileList(){return a`
      <inch-card class="card" forMobileView>
        <inch-card-header closeButton headerText="Select chain"></inch-card-header>
        <inch-scroll-view-consumer >
          ${this.getList()}
        </inch-scroll-view-consumer>
      </inch-card>
    `}getDesktopList(){return a`
      <inch-card>
        ${this.getList()}
      </inch-card>
    `}};ct.tagName="inch-chain-selector-list";ct.styles=[ni];w([x({type:Object,attribute:!1})],ct.prototype,"controller",2);w([P()],ct.prototype,"activeChainId",2);ct=w([y(ct.tagName)],ct);var lt=class extends ${constructor(){super(...arguments),this.mobileMedia=Z(this),this.overlay=new Le("#app-root",this),this.overlayId=null,this.chainId$=b(()=>this.getController().data.chainId$),this.unsupportedChainId$=this.chainId$.pipe(A(t=>t&&wt[t]?"":"unsupported")),this.chainIdIconName$=this.chainId$.pipe(zt(Boolean),A(t=>wt[t]?wt[t].iconName:"alert24")),this.chainIdName$=this.chainId$.pipe(zt(Boolean),A(t=>wt[t]?wt[t].name:"Unsupported chain"))}render(){return a`
      <inch-button @click="${()=>this.onClick()}" size="l" type="primary-gray">
        <inch-icon class="${T(this.unsupportedChainId$)}" icon="${T(this.chainIdIconName$)}"></inch-icon>
        ${g(!this.mobileMedia.matches,()=>a`
          <span>${T(this.chainIdName$)}</span>
          <inch-icon icon="chevronDown16"></inch-icon>
        `)}
      </inch-button>
    `}async onClick(){if(this.overlay.isOpenOverlay(this.overlayId??0)){this.closeOverlay();return}this.overlayId=await this.overlay.open(a`
      <inch-chain-selector-list
        .controller="${this.controller}"
        @closeCard="${()=>this.closeOverlay()}"
      ></inch-chain-selector-list>
    `)}closeOverlay(){this.overlayId&&(this.overlay.close(this.overlayId),this.overlayId=null)}getController(){if(!this.controller)throw new Error("");return this.controller}};lt.tagName="inch-chain-selector";lt.styles=ti;w([x({type:Object,attribute:!1})],lt.prototype,"controller",2);w([le()],lt.prototype,"onClick",1);lt=w([y(lt.tagName)],lt);const Ys=Object.freeze(Object.defineProperty({__proto__:null,get ChainSelectorElement(){return lt},get ChainSelectorListElement(){return ct},get ConnectWalletViewElement(){return rt},get WalletManageElement(){return ot}},Symbol.toStringTag,{value:"Module"}));function si(){return At().matches?56:72}function oi(){return At().matches?56:72}var ri=Object.defineProperty,ai=Object.getOwnPropertyDescriptor,Ye=(t,e,n,i)=>{for(var s=i>1?void 0:i?ai(e,n):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(i?r(e,n,s):r(s))||s);return i&&s&&ri(e,n,s),s};let $t=class extends ${constructor(){super(...arguments),this.mobileMedia=Z(this)}render(){return this.mobileMedia.matches?this.getMobileHeader():this.getDesktopHeader()}getDesktopHeader(){const t={height:`${si()}px`};return a`
      <div class="header-container" style="${Fe(t)}">
        <div class="left-content">
          <inch-icon icon="logoFull"></inch-icon>
        </div>
        <div class="right-content">
          <inch-chain-selector .controller="${this.applicationContext.connectWalletController}"></inch-chain-selector>
          <inch-connect-wallet-view .controller="${this.applicationContext.connectWalletController}"></inch-connect-wallet-view>
          <inch-notifications-open-button></inch-notifications-open-button>
        </div>
      </div>
    `}getMobileHeader(){return a`
      <div class="header-container mobile-header">
        <inch-icon icon="logoFull"></inch-icon>
      </div>
    `}};$t.tagName="inch-header";$t.styles=Bn;Ye([C({context:W})],$t.prototype,"applicationContext",2);$t=Ye([y($t.tagName)],$t);const ci=m`

    .footer-container {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        position: relative;
        border-top: 1px solid var(--color-border-border-tertiary);
        padding: 0 72px;
        background-color: var(--color-background-bg-body);
        gap: 8px;
        margin-top: 32px;
    }
    
    .mobile-footer {
        height: 72px;
        width: 100vw;
        position: sticky;
        padding: 16px 8px;
        bottom: 0;
        z-index: 9;
        justify-content: space-between;
    }
    
    .power-by {
        color: var(--color-content-content-secondary);
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;
    }
    
    .version {
        color: var(--color-content-content-secondary);
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;
        transform: translateX(-100%);
        opacity: 0;
        transition: transform .2s, opacity .2s;
    }
    
    .version:dir(rtl) {
        transform: translateX(100%);
    }
    
    .footer-content-container {
        display: flex;
        gap: 8px;
    }
    
    @media (hover: hover) {
        .footer-container:hover .version {
            transform: translateX(0);
            opacity: 1;
        }
    }

`;var li=Object.defineProperty,hi=Object.getOwnPropertyDescriptor,Ge=(t,e,n,i)=>{for(var s=i>1?void 0:i?hi(e,n):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(i?r(e,n,s):r(s))||s);return i&&s&&li(e,n,s),s};X(()=>Promise.resolve().then(()=>Yn),void 0);X(()=>import("./index-DSKku2tv.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]));let Ct=class extends ${constructor(){super(...arguments),this.mobileMedia=At(),this.mobileOverlay=new un("app-root")}connectedCallback(){super.connectedCallback(),Ne(this)}render(){return this.mobileMedia.matches?this.getMobileFooter():this.getDesktopFooter()}getDesktopFooter(){const t={height:`${oi()}px`};return a`
      <div class="footer-container" style="${Fe(t)}">
        <span class="power-by">© ${new Date().getFullYear()} Powered by 1inch</span>
        <span class="version">version: ${vn("appVersion")}</span>
      </div>
    `}getMobileFooter(){return a`
      <div class="footer-container mobile-footer">

        <inch-chain-selector .controller="${this.applicationContext.connectWalletController}"></inch-chain-selector>
        <inch-connect-wallet-view .controller="${this.applicationContext.connectWalletController}"></inch-connect-wallet-view>
        
        <inch-notifications-open-button></inch-notifications-open-button>

        <inch-button @click="${()=>this.onOpenSettings()}" type="primary-gray" size="l">
          <inch-icon icon="settings24"></inch-icon>
        </inch-button>
      
      </div>
    `}async onOpenSettings(){const t=await this.mobileOverlay.open(a`
      <inch-card forMobileView>
        <inch-settings
          @closeSettings="${()=>this.mobileOverlay.close(t)}"
        ></inch-settings>
      </inch-card>
    `)}};Ct.tagName="inch-footer";Ct.styles=ci;Ge([C({context:W})],Ct.prototype,"applicationContext",2);Ct=Ge([y(Ct.tagName)],Ct);var pi=Object.defineProperty,ui=Object.getOwnPropertyDescriptor,d=(t,e,n,i)=>{for(var s=i>1?void 0:i?ui(e,n):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(i?r(e,n,s):r(s))||s);return i&&s&&pi(e,n,s),s};const Ze=(t,e,n)=>{for(const i of e)if(i[0]===t)return(0,i[1])();return n==null?void 0:n()};var di=Object.defineProperty,fi=Object.getOwnPropertyDescriptor,Kt=(t,e,n,i)=>{for(var s=i>1?void 0:i?fi(e,n):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(i?r(e,n,s):r(s))||s);return i&&s&&di(e,n,s),s},mi=m`
    :host {
        display: block;
    }
    
    .container {
        position: relative;
        background-color: var(--color-background-bg-secondary);
        padding: 2px;
        display: flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
        outline: none;
        box-sizing: border-box;
        width: 100%;
    }
    
    .container-m {
        border-radius: 10px;
        height: 36px;
    }
    
    .container-l {
        border-radius: 12px;
        height: 48px;
    }
    
    .caret {
        position: absolute;
        background-color: var(--color-background-bg-active);
        height: 32px;
        border-radius: 8px;
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.12), 0 1px 4px 0 rgba(0, 0, 0, 0.12);
        color: var(--primary);
        width: 30px;
        z-index: 0;
    }

    .caret-transition {
        transition: transform .2s;
    }
    
`,gi=m`

    .item {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-items: center;
        padding: 6px 16px;
        z-index: 1;
        width: 100%;
        font-size: 16px;
        justify-content: center;
        text-wrap: nowrap;
        transition: color .2s, background-color .2s;
        color: var(--color-content-content-primary);
    }
    
    .select {
        color: var(--primary);
    }
    
    .item-input {
        user-select: none;
        outline: none;
        border: none;
        background-color: transparent;
    }

    ${O(m`
        .item {
            font-size: 13px;
            padding: 6px 12px;
        }
    `)}

`,ht=class extends ${constructor(){super(...arguments),this.size="m",this.items=[],this.itemRefList=[],this.caretRef=null}render(){const t={[`container-${this.size}`]:!0};return a`
      <div class="container ${j(t)}">
        ${he(this.items||[],e=>this.getItemView(e))}
        <div class="caret"></div>
      </div>
    `}async firstUpdated(){var t;this.itemRefList=Array.from(this.renderRoot.querySelectorAll("div.item")),this.caretRef=this.renderRoot.querySelector(".caret"),await this.updateComplete,this.requestUpdate(),await ee(60),(t=this.caretRef)==null||t.classList.add("caret-transition"),this.requestUpdate(),await ee(60),tt(this,[Oe.pipe(_(()=>this.updated())),this.parentElement?ln(this.parentElement).pipe(_(()=>this.updated())):Rt()])}updated(){if(!this.caretRef)return;let t=0,e=0;for(const n of this.itemRefList){if(n.classList.contains("select")){e=n.offsetWidth;break}t+=n.offsetWidth}this.caretRef.style.width=`${e}px`,this.caretRef.style.transform=`translateX(${t*(Bt()?-1:1)}px)`}getItemView(t){var i,s;const e={[`item-${this.size}`]:!0,select:t.value===((i=this.select)==null?void 0:i.value)};let n=a`${t.label}`;return t.template&&(n=t.template(t,t.value===((s=this.select)==null?void 0:s.value),this.caretRef)),a`
      <div @click="${o=>this.onSelect(t,o)}" class="item ${j(e)}">
        ${n}
      </div>
    `}onSelect(t,e){this.select=t,this.requestUpdate(),this.dispatchEvent(hn("change",t.value,e))}};ht.tagName="inch-segmented-control";ht.styles=[mi,gi];Kt([x({type:String})],ht.prototype,"size",2);Kt([x({type:Array,attribute:!1})],ht.prototype,"items",2);Kt([x({type:Object,attribute:!1})],ht.prototype,"select",2);ht=Kt([y(ht.tagName)],ht);var wi=Object.defineProperty,vi=Object.getOwnPropertyDescriptor,bi=(t,e,n,i)=>{for(var s=i>1?void 0:i?vi(e,n):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(i?r(e,n,s):r(s))||s);return i&&s&&wi(e,n,s),s},xi={sceneBackgroundColor:"var(--color-background-bg-primary)"},yi=t=>{const e={...xi,...t};return m`

      :host {
          display: flex;
          --scene-background-color: ${an(e.sceneBackgroundColor)};
      }

      .scene-container {
          min-height: 50px;
          min-width: 50px;
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          will-change: width, height, transform, filter;
      }
  `},$i=De(Symbol("scene context")),Ci=class{constructor(){this.animationInProgress=!1,this.animationInStart$=new Pt,this.animationInEnd$=new Pt,this.animationOutStart$=new Pt,this.animationOutEnd$=new Pt}get animationInStart(){return Mt(this.animationInStart$)}get animationInEnd(){return Mt(this.animationInEnd$)}get animationOutStart(){return Mt(this.animationOutStart$)}get animationOutEnd(){return Mt(this.animationOutEnd$)}animationInStartNext(){this.animationInProgress=!0,this.animationInStart$.next()}animationInEndNext(){this.animationInProgress=!1,this.animationInEnd$.next()}animationOutStartNext(){this.animationInProgress=!0,this.animationOutStart$.next()}animationOutEndNext(){this.animationInProgress=!1,this.animationOutEnd$.next()}},kt=class extends ${constructor(){super(),this.context=new jt(this,{context:$i}),this.context.setValue(new Ci)}animationInStart(){this.context.value.animationInStartNext()}animationInEnd(){this.context.value.animationInEndNext()}animationOutStart(){this.context.value.animationOutStartNext()}animationOutEnd(){this.context.value.animationOutEndNext()}render(){return a`<slot></slot>`}};kt.tagName="inch-scene-wrapper";kt.styles=m`
      :host {
          background-color: var(--scene-background-color);
          will-change: transform;
          transform: translate3d(0, 0, 0);
          height: fit-content;
          box-sizing: border-box;
          position: relative;
          display: block;
      }
  `;kt=bi([y(kt.tagName)],kt);function ki(){const t={position:"absolute",top:"0",left:"0",bottom:"0",right:"0",zIndex:"9",backfaceVisibility:"hidden",height:Ve()?"110%":""},e={position:"",top:"",left:"",bottom:"",right:"",zIndex:"",transform:"",filter:"",backfaceVisibility:"",height:""},n={duration:500,easing:"cubic-bezier(.2, .8, .2, 1)"};return{preparation:async(i,s,o)=>{I(i,{...t,zIndex:"9",transform:o?"translate3d(0, 0, 0)":"translate3d(110%, 0, 0)"}),I(s,{...t,zIndex:"8",transform:o?"translate3d(-110%, 0, 0)":"translate3d(0, 0, 0)"})},transition:async(i,s,o)=>{await Promise.all([i.animate([{transform:o?"translate3d(0, 0, 0)":"translate3d(110%, 0, 0)"},{transform:o?"translate3d(110%, 0, 0)":"translate3d(0, 0, 0)"}],n),s.animate([{transform:o?"translate3d(-110%, 0, 0)":"translate3d(0, 0, 0)"},{transform:o?"translate3d(0, 0, 0)":"translate3d(-110%, 0, 0)"}],n).finished]),I(i,{...e}),I(s,{...e})}}}function Si(){const t={position:"absolute",top:"0",left:"0",bottom:"0",right:"0",zIndex:"9",backfaceVisibility:"hidden",height:Ve()?"100%":""},e={position:"",top:"",left:"",bottom:"",right:"",zIndex:"",transform:"",filter:"",backfaceVisibility:"",willChange:"",height:""},n={duration:800,easing:"cubic-bezier(.2, .8, .2, 1)"};return{preparation:async(i,s,o)=>{I(i,{...t,zIndex:"9",transform:o?"translate3d(0, 0, 0)":"translate3d(100%, 0, 0)"}),I(s,{...t,zIndex:"8",willChange:"transform, filter",transform:o?"translate3d(-50%, 0, 0) scale(.9)":"translate3d(0, 0, 0) scale(1)",filter:o?"blur(3px)":"blur(0)"})},transition:async(i,s,o)=>{await Promise.all([i.animate([{transform:o?"translate3d(0, 0, 0)":"translate3d(105%, 0, 0)"},{transform:o?"translate3d(105%, 0, 0)":"translate3d(0, 0, 0)"}],n),s.animate([{transform:o?"translate3d(-50%, 0, 0) scale(.9)":"translate3d(0, 0, 0) scale(1)",filter:o?"blur(3px)":"blur(0)"},{transform:o?"translate3d(0, 0, 0) scale(1)":"translate3d(-50%, 0, 0) scale(.9)",filter:o?"blur(0)":"blur(3px)"}],n).finished]),I(i,{...e}),I(s,{...e})}}}var It,Ke=(It=class{constructor(e,n,i=Si()){this.rootSceneName=e,this.config=n,this.animation=i,this.sceneStack=[],this.sceneContainer=Ei(),this.transitionInProgress=!1}get activeScene(){return this.sceneStack[this.sceneStack.length-1]}render(e){if(this.transitionInProgress)return a`${this.sceneContainer}`;const n=!this.currentScenes;this.currentScenes=e;const i=this.getCurrentSceneName();if(!(this.config[i].lazyRender??!1)||n){const r=this.getScene(i);if(!r)throw new Error("Scene not exist");const l=this.buildSceneWrapper(r(),i);this.clearContainer(),this.sceneContainerAppendChild(l),this.applySceneConfigBySceneName(i)}return a`${this.sceneContainer}`}async nextTo(e){this.transitionInProgress||(await this.transition(e),this.sceneStack.push(e))}async back(){if(this.transitionInProgress)return;const e=this.sceneStack[this.sceneStack.length-2]??this.rootSceneName;await this.transition(e,!0),this.sceneStack.pop()}resetScene(){this.sceneStack=[]}getCurrentSceneName(){let e=this.rootSceneName;return this.sceneContainer.firstChild&&(e=this.sceneContainer.firstChild.id),e}getCurrentScene(){if(!this.currentScenes)return null;const e=this.getCurrentSceneName();return this.getScene(e)}async transition(e,n){this.transitionInProgress=!0;try{if(this.getCurrentSceneName()===e)return;const s=this.getScene(e);if(!s)throw new Error(`Scene ${e} not exist`);const o=this.buildSceneWrapper(s(),e),r=this.sceneContainer.firstChild,l=n?r:o,c=n?o:r;n?l.animationOutStart():l.animationInStart(),n?c.animationOutStart():c.animationInStart(),this.sceneContainerAppendChild(o),await dn();const h=o.getBoundingClientRect(),p=r.getBoundingClientRect();await this.animation.preparation(l,c,n??!1),h.height>p.height&&this.applySceneConfigBySceneName(e),await Promise.all([this.animation.transition(l,c,n??!1),this.resizeContainer(h,p)]),h.height<p.height&&this.applySceneConfigBySceneName(e),I(this.sceneContainer,{width:"",height:""}),this.sceneContainer.firstChild&&this.sceneContainer.removeChild(this.sceneContainer.firstChild),n?l.animationOutEnd():l.animationInEnd(),n?c.animationOutEnd():c.animationInEnd()}finally{this.transitionInProgress=!1}}getScene(e){return this.currentScenes?this.currentScenes[e]??null:null}clearContainer(){for(;this.sceneContainer.firstChild;)this.sceneContainer.removeChild(this.sceneContainer.firstChild)}buildSceneWrapper(e,n){const i=document.createElement(kt.tagName);return i.id=n,i.classList.add("scene-wrapper",n),rn(e,i),i}sceneContainerAppendChild(e){this.sceneContainer.appendChild(e)}applySceneConfigBySceneName(e){const n=this.config[e];this.applySceneSizes(n)}applySceneSizes(e){const n=i=>i?typeof i=="number"?`${i}px`:i:"";e.maxHeight&&(this.sceneContainer.maxHeight=parseInt(e.maxHeight.toString())),I(this.sceneContainer,{minWidth:n(e.minWidth),maxWidth:n(e.maxWidth)})}async resizeContainer(e,n){const i={height:`${n.height}px`,width:`${n.width}px`},s={height:`${e.height}px`,width:`${e.width}px`};I(this.sceneContainer,i),await this.sceneContainer.animate([i,s],{duration:500,easing:"cubic-bezier(.2, .8, .2, 1)"}).finished,I(this.sceneContainer,s)}},It.styles=yi,It);function Ei(){const t=document.createElement(fn.tagName);return t.id="scene-container",t.classList.add("scene-container"),t}pn({[_t.en]:()=>X(()=>import("./en-2MFTSBRT-D4hWu1bY.js"),[]).then(t=>t.default),[_t.ar]:()=>X(()=>import("./ar-EHVYY5BX-C_gxvB5t.js"),[]).then(t=>t.default),[_t.fr]:()=>X(()=>import("./fr-CR6ZYPHE-C9aeuylw.js"),[]).then(t=>t.default),[_t.es]:()=>X(()=>import("./es-V55QBK65-oJVmnjDB.js"),[]).then(t=>t.default),[_t.de]:()=>X(()=>import("./de-JMXTJR4F-CH9zb0Xd.js"),[]).then(t=>t.default)});var Ti=m`

    .swap-form-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: fit-content;
        width: 100%;
        min-width: 300px;
    }

    .input-container {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .input-header {
        height: 68px;
        padding: 16px 0 16px 8px;
        box-sizing: border-box;
        color: var(--color-content-content-primary);
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
        margin-top: -16px;
        letter-spacing: 0;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

`,ue={mask:/^.*$/,preprocessors:[],postprocessors:[],plugins:[],overwriteMode:"shift"},Ii=class{constructor(){this.now=null,this.past=[],this.future=[]}undo(){const t=this.past.pop();t&&this.now&&(this.future.push(this.now),this.updateElement(t,"historyUndo"))}redo(){const t=this.future.pop();t&&this.now&&(this.past.push(this.now),this.updateElement(t,"historyRedo"))}updateHistory(t){if(!this.now){this.now=t;return}const e=this.now.value!==t.value,n=this.now.selection.some((i,s)=>i!==t.selection[s]);!e&&!n||(e&&(this.past.push(this.now),this.future=[]),this.now=t)}updateElement(t,e){this.now=t,this.updateElementState(t,{inputType:e,data:null})}};function Ai(t,...e){return e.every(({value:n})=>n===t.value)}function _i(t,...e){return e.every(({value:n,selection:i})=>n===t.value&&i[0]===t.selection[0]&&i[1]===t.selection[1])}function Pi({value:t,selection:e},n,i){const[s,o]=e,r=typeof i=="function"?i({value:t,selection:e}):i;return{value:t,selection:r==="replace"?[s,s+n.length]:[s,o]}}function Xt(t){return typeof t=="string"}function Te(t,e,n,i){let s="";for(let o=e.length;o<t.length;o++){const r=t[o],l=(i==null?void 0:i.value[o])===r;if(!Xt(r)||r===n&&!l)return s;s+=r}return s}function Xe(t,e){return Array.isArray(e)?t.length===e.length&&Array.from(t).every((n,i)=>{const s=e[i];return Xt(s)?n===s:n.match(s)}):e.test(t)}function Mi(t,e,n){let i=null,s=null;const o=Array.from(t.value).reduce((l,c,h)=>{const p=Te(e,l,c,n),u=l+p,f=e[u.length];return Xt(f)?u+f:c.match(f)?(i===null&&h>=t.selection[0]&&(i=u.length),s===null&&h>=t.selection[1]&&(s=u.length),u+c):u},""),r=Te(e,o,"",n);return{value:Xe(o+r,e)?o+r:o,selection:[i??o.length,s??o.length]}}function Ri({value:t,selection:e},n){const[i,s]=e;let o=i,r=s;return{value:Array.from(t).reduce((c,h,p)=>{const u=c+h;return i===p&&(o=c.length),s===p&&(r=c.length),u.match(n)?u:c},""),selection:[o,r]}}function Wt(t,e,n=null){if(Xe(t.value,e))return t;const{value:i,selection:s}=Array.isArray(e)?Mi(t,e,n):Ri(t,e);return{selection:s,value:Array.isArray(e)?i.slice(0,e.length):i}}function Ie(t,e){if(!Array.isArray(e))return t;const[n,i]=t.selection,s=[],o=Array.from(t.value).reduce((r,l,c)=>{const h=e[c];return c===n&&s.push(r.length),c===i&&s.push(r.length),Xt(h)&&h===l?r:r+l},"");return s.length<2&&s.push(...new Array(2-s.length).fill(o.length)),{value:o,selection:[s[0],s[1]]}}var se=class{constructor(t,e){this.initialElementState=t,this.maskOptions=e,this.value="",this.selection=[0,0];const{value:n,selection:i}=Wt(this.initialElementState,this.getMaskExpression(this.initialElementState));this.value=n,this.selection=i}addCharacters([t,e],n){const{value:i}=this,s=this.getMaskExpression({value:i.slice(0,t)+n+i.slice(e),selection:[t+n.length,t+n.length]}),o={value:i,selection:[t,e]},r=Ie(o,s),[l,c]=Pi(r,n,this.maskOptions.overwriteMode).selection,h=r.value.slice(0,l)+n,p=h.length,u=Wt({value:h+r.value.slice(c),selection:[p,p]},s,o);if(i.slice(0,l)===Wt({value:h,selection:[p,p]},s,o).value||_i(this,u))throw new Error("Invalid mask value");this.value=u.value,this.selection=u.selection}deleteCharacters([t,e]){if(t===e||!e)return;const{value:n}=this,i=this.getMaskExpression({value:n.slice(0,t)+n.slice(e),selection:[t,t]}),s={value:n,selection:[t,e]},o=Ie(s,i),[r,l]=o.selection,c=o.value.slice(0,r)+o.value.slice(l),h=Wt({value:c,selection:[r,r]},i,s);this.value=h.value,this.selection=h.selection}getMaskExpression(t){const{mask:e}=this.maskOptions;return typeof e=="function"?e(t):e}},Ni=class{constructor(t){this.element=t,this.listeners=[]}listen(t,e,n){const i=e;this.element.addEventListener(t,i,n),this.listeners.push(()=>this.element.removeEventListener(t,i))}destroy(){this.listeners.forEach(t=>t())}},B={CTRL:1,ALT:2,SHIFT:4,META:8},Ot={Y:89,Z:90};function Vt(t,e,n){return t.ctrlKey===!!(e&B.CTRL)&&t.altKey===!!(e&B.ALT)&&t.shiftKey===!!(e&B.SHIFT)&&t.metaKey===!!(e&B.META)&&t.keyCode===n}function Oi(t){return Vt(t,B.CTRL,Ot.Y)||Vt(t,B.CTRL|B.SHIFT,Ot.Z)||Vt(t,B.META|B.SHIFT,Ot.Z)}function Vi(t){return Vt(t,B.CTRL,Ot.Z)||Vt(t,B.META,Ot.Z)}function de(t,e){var n;const i=t.value;if(typeof e=="string")t.value=e;else{const[s,o]=e.selection;t.value=e.value,t.matches(":focus")&&((n=t.setSelectionRange)===null||n===void 0||n.call(t,s,o))}t.value!==i&&t.dispatchEvent(new Event("input",{bubbles:!0}))}function zi({value:t,selection:e},n){const[i,s]=e;if(i!==s)return[i,s];const o=n?t.slice(i).indexOf(`
`)+1||t.length:t.slice(0,s).lastIndexOf(`
`)+1;return[n?i:o,n?o:s]}function Li({value:t,selection:e},n){const[i,s]=e;return i!==s?[i,s]:(n?[i,s+1]:[i-1,s]).map(r=>Math.min(Math.max(r,0),t.length))}var Di=/\s+$/g,Fi=/^\s+/g,Ae=/\s/;function Wi({value:t,selection:e},n){const[i,s]=e;if(i!==s)return[i,s];if(n){const c=t.slice(i),[h]=c.match(Fi)||[""],p=c.trimStart().search(Ae);return[i,p!==-1?i+h.length+p:t.length]}const o=t.slice(0,s),[r]=o.match(Di)||[""],l=o.trimEnd().split("").reverse().findIndex(c=>c.match(Ae));return[l!==-1?s-r.length-l:0,s]}function qt(t=[]){return(e,...n)=>t.reduce((i,s)=>Object.assign(Object.assign({},i),s(i,...n)),e)}function fe(t,e){const n=Object.assign(Object.assign({},ue),e),i=qt(n.preprocessors),s=qt(n.postprocessors),o=typeof t=="string"?{value:t,selection:[0,0]}:t,{elementState:r}=i({elementState:o,data:""},"validation"),l=new se(r,n),{value:c,selection:h}=s(l,o);return typeof t=="string"?c:{value:c,selection:h}}var me=class extends Ii{constructor(t,e){super(),this.element=t,this.maskitoOptions=e,this.isTextArea=this.element.nodeName==="TEXTAREA",this.eventListener=new Ni(this.element),this.options=Object.assign(Object.assign({},ue),this.maskitoOptions),this.preprocessor=qt(this.options.preprocessors),this.postprocessor=qt(this.options.postprocessors),this.teardowns=this.options.plugins.map(n=>n(this.element,this.options)),this.updateHistory(this.elementState),this.eventListener.listen("keydown",n=>{if(Oi(n))return n.preventDefault(),this.redo();if(Vi(n))return n.preventDefault(),this.undo()}),this.eventListener.listen("beforeinput",n=>{var i;const s=n.inputType.includes("Forward");switch(this.updateHistory(this.elementState),n.inputType){case"historyUndo":return n.preventDefault(),this.undo();case"historyRedo":return n.preventDefault(),this.redo();case"deleteByCut":case"deleteContentBackward":case"deleteContentForward":return this.handleDelete({event:n,isForward:s,selection:Li(this.elementState,s)});case"deleteWordForward":case"deleteWordBackward":return this.handleDelete({event:n,isForward:s,selection:Wi(this.elementState,s),force:!0});case"deleteSoftLineBackward":case"deleteSoftLineForward":case"deleteHardLineBackward":case"deleteHardLineForward":return this.handleDelete({event:n,isForward:s,selection:zi(this.elementState,s),force:!0});case"insertCompositionText":return;case"insertReplacementText":return;case"insertLineBreak":case"insertParagraph":return this.handleEnter(n);case"insertFromPaste":case"insertText":case"insertFromDrop":default:return this.handleInsert(n,n.data||((i=n.dataTransfer)===null||i===void 0?void 0:i.getData("text/plain"))||"")}}),this.eventListener.listen("input",({inputType:n})=>{n!=="insertCompositionText"&&(this.ensureValueFitsMask(),this.updateHistory(this.elementState))}),this.eventListener.listen("compositionend",()=>{this.ensureValueFitsMask(),this.updateHistory(this.elementState)})}get elementState(){const{value:t,selectionStart:e,selectionEnd:n}=this.element;return{value:t,selection:[e||0,n||0]}}get maxLength(){const{maxLength:t}=this.element;return t===-1?1/0:t}destroy(){this.eventListener.destroy(),this.teardowns.forEach(t=>t==null?void 0:t())}updateElementState({value:t,selection:e},n={inputType:"insertText",data:null}){const i=this.elementState.value;this.updateValue(t),this.updateSelectionRange(e),i!==t&&this.dispatchInputEvent(n)}updateSelectionRange([t,e]){var n;const{element:i}=this;i.matches(":focus")&&(i.selectionStart!==t||i.selectionEnd!==e)&&((n=i.setSelectionRange)===null||n===void 0||n.call(i,t,e))}updateValue(t){this.element.value=t}ensureValueFitsMask(){this.updateElementState(fe(this.elementState,this.options))}dispatchInputEvent(t={inputType:"insertText",data:null}){globalThis.InputEvent&&this.element.dispatchEvent(new InputEvent("input",Object.assign(Object.assign({},t),{bubbles:!0,cancelable:!1})))}handleDelete({event:t,selection:e,isForward:n,force:i=!1}){const s={value:this.elementState.value,selection:e},[o,r]=s.selection,{elementState:l}=this.preprocessor({elementState:s,data:""},n?"deleteForward":"deleteBackward"),c=new se(l,this.options),[h,p]=l.selection;c.deleteCharacters([h,p]);const u=this.postprocessor(c,s);if(!(s.value.slice(0,o)+s.value.slice(r)===u.value&&!i&&!this.element.isContentEditable)){if(t.preventDefault(),Ai(s,l,c,u))return this.updateSelectionRange(n?[p,p]:[h,h]);this.updateElementState(u,{inputType:t.inputType,data:null}),this.updateHistory(u)}}handleInsert(t,e){const n=this.elementState,{elementState:i,data:s=e}=this.preprocessor({data:e,elementState:n},"insert"),o=new se(i,this.options);try{o.addCharacters(i.selection,s)}catch{return t.preventDefault()}const[r,l]=i.selection,c=n.value.slice(0,r)+e+n.value.slice(l),h=this.postprocessor(o,n);if(h.value.length>this.maxLength)return t.preventDefault();(c!==h.value||this.element.isContentEditable)&&(t.preventDefault(),this.updateElementState(h,{data:e,inputType:t.inputType}),this.updateHistory(h))}handleEnter(t){(this.isTextArea||this.element.isContentEditable)&&this.handleInsert(t,`
`)}};function Yt(t,e,n){const i=Math.min(Number(n),Math.max(Number(e),Number(t)));return t instanceof Date?new Date(i):i}var Bi=[".",",","б","ю"],ji=[":","."],Hi=" ",Ui="​",Je="–",Qe="—",Gt="-",oe="−",tn="ー",en=/[\\^$.*+?()[\]{}|]/g,qi=new RegExp(en.source);function M(t){return t&&qi.test(t)?t.replaceAll(en,"\\$&"):t}function U(t,{prefix:e,postfix:n}){var i,s;const o=new RegExp(`^${M(e)}`),r=new RegExp(`${M(n)}$`),[l=""]=(i=t.match(o))!==null&&i!==void 0?i:[],[c=""]=(s=t.match(r))!==null&&s!==void 0?s:[],h=t.replace(o,"").replace(r,"");return{extractedPrefix:l,extractedPostfix:c,cleanValue:h}}function Yi(t,e){let n="";for(let i=0;i<t.length;i++){if(t[i]!==e[i])return n;n+=t[i]}return n}function Ft(t){return t}function _e(t){return t.replaceAll(/[０-９]/g,e=>String.fromCharCode(e.charCodeAt(0)-65248))}function Gi(){return({elementState:t,data:e})=>{const{value:n,selection:i}=t;return{elementState:{selection:i,value:_e(n)},data:_e(e)}}}function Zi(t){const e=new RegExp(`${M(t)}$`);return t?({value:n,selection:i},s)=>{if(!n&&!s.value.endsWith(t))return{value:n,selection:i};if(!n.endsWith(t)&&!s.value.endsWith(t))return{selection:i,value:n+t};const o=s.value.replace(e,""),r=s.selection[1]>=o.length,l=Yi(o,n);return{selection:i,value:Array.from(t).reverse().reduce((c,h,p)=>{const u=c.length-1-p,f=l[u]===h&&r;return c[u]!==h||f?c.slice(0,u+1)+h+c.slice(u+1):c},n)}}:Ft}function Ki(t){return t?({value:e,selection:n},i)=>{if(e.startsWith(t)||!e&&!i.value.startsWith(t))return{value:e,selection:n};const[s,o]=n,r=Array.from(t).reduce((c,h,p)=>c[p]===h?c:c.slice(0,p)+h+c.slice(p),e),l=r.length-e.length;return{selection:[s+l,o+l],value:r}}:Ft}function ge(t,e,n){return(i,s)=>{const o=()=>e(i,s);return i.addEventListener(t,o,n),()=>i.removeEventListener(t,o,n)}}new RegExp(`[${ji.map(M).join("")}]$`);function Xi({prefix:t,postfix:e}){return({elementState:n,data:i})=>{const{cleanValue:s}=U(i,{prefix:t,postfix:e});return{elementState:n,data:s}}}function nn({decimalSeparator:t,isNegativeAllowed:e,precision:n,thousandSeparator:i,prefix:s,postfix:o,decimalPseudoSeparators:r=[],pseudoMinuses:l=[],minusSign:c}){const h=Pe(s),p="\\d",u=e?`[${c}${l.map(V=>`\\${V}`).join("")}]?`:"",f=i?`[${p}${M(i).replaceAll(/\s/g,"\\s")}]*`:`[${p}]*`,k=n>0?`([${M(t)}${r.map(M).join("")}]${p}{0,${Number.isFinite(n)?n:""}})?`:"",S=Pe(o);return new RegExp(`^${h}${u}${f}${k}${S}$`)}function Pe(t){return t?`${t.split("").map(e=>`${M(e)}?`).join("")}`:""}function we(t,e="."){const n=!!t.match(new RegExp(`^\\D*[${oe}\\${Gt}${Je}${Qe}${tn}]`)),i=M(e),s=t.replaceAll(new RegExp(`${i}(?!\\d)`,"g"),"").replaceAll(new RegExp(`[^\\d${i}]`,"g"),"").replace(e,".");return s?Number((n?Gt:"")+s):NaN}function Ji(t){const e=String(t),[n,i]=e.split("e-");let s=e;if(i){const[,o]=n.split("."),r=Number(i)+((o==null?void 0:o.length)||0);s=t.toFixed(r)}return s}function sn(t,{decimalSeparator:e,thousandSeparator:n}){const[i="",s=""]=t.split(e),[,o="",r=""]=i.match(new RegExp(`([^\\d${M(n)}]+)?(.*)`))||[];return{minus:o,integerPart:r,decimalPart:s}}function Qi({decimalSeparator:t,thousandSeparator:e,decimalPseudoSeparators:n=Bi}){return n.filter(i=>i!==e&&i!==t)}function ts({decimalSeparator:t,precision:e,decimalZeroPadding:n,prefix:i,postfix:s}){return e<=0||!n?Ft:({value:o,selection:r})=>{const{cleanValue:l,extractedPrefix:c,extractedPostfix:h}=U(o,{prefix:i,postfix:s});if(Number.isNaN(we(l,t)))return{value:o,selection:r};const[p,u=""]=l.split(t);return{value:c+p+t+u.padEnd(e,"0")+h,selection:r}}}function es({prefix:t,postfix:e,decimalSeparator:n,thousandSeparator:i}){return({value:s,selection:o})=>{const[r]=o,{cleanValue:l,extractedPrefix:c,extractedPostfix:h}=U(s,{prefix:t,postfix:e}),{minus:p,integerPart:u,decimalPart:f}=sn(l,{decimalSeparator:n,thousandSeparator:i}),k=!u&&!f&&l.includes(n);return!u&&!Number(f)&&r===(p+c).length||k?{selection:o,value:c+p+h}:{value:s,selection:o}}}function ns({decimalSeparator:t,decimalPseudoSeparators:e,pseudoMinuses:n,prefix:i,postfix:s,minusSign:o}){let r=!0;const l=nn({decimalSeparator:t,decimalPseudoSeparators:e,pseudoMinuses:n,prefix:"",postfix:"",thousandSeparator:"",precision:1/0,isNegativeAllowed:!0,minusSign:o});return({elementState:c,data:h})=>{if(!r)return{elementState:c,data:h};r=!1;const{value:p,selection:u}=c,[f,k]=u,{extractedPrefix:S,cleanValue:V,extractedPostfix:et}=U(p,{prefix:i,postfix:s}),yt=fe({selection:[Math.max(f-S.length,0),Yt(k-S.length,0,V.length)],value:V},{mask:l}),[q,nt]=yt.selection;return{elementState:{selection:[q+S.length,nt+S.length],value:S+yt.value+et},data:h}}}function is({decimalSeparator:t,thousandSeparator:e,prefix:n,postfix:i}){const s=r=>{const l=M(e);return r.replace(new RegExp(`^(\\D+)?[0${l}]+(?=0)`),"$1").replace(new RegExp(`^(\\D+)?[0${l}]+(?=[1-9])`),"$1")},o=(r,l)=>{const c=r.slice(0,l),h=r.slice(l).startsWith("0");return c.length-s(c).length+(h?1:0)};return({value:r,selection:l})=>{const[c,h]=l,{cleanValue:p,extractedPrefix:u,extractedPostfix:f}=U(r,{prefix:n,postfix:i}),k=p.includes(t),[S,V=""]=p.split(t),et=s(S);if(S===et)return{value:r,selection:l};const yt=c-o(r,c),q=h-o(r,h);return{value:u+et+(k?t:"")+V+f,selection:[Math.max(yt,0),Math.max(q,0)]}}}function ss({min:t,max:e,decimalSeparator:n,minusSign:i}){return({value:s,selection:o})=>{const r=we(s,n),l=r>0?Math.min(r,e):Math.max(r,t);if(r&&l!==r){const c=`${l}`.replace(".",n).replace(Gt,i);return{value:c,selection:[c.length,c.length]}}return{value:s,selection:o}}}function os({decimalSeparator:t,thousandSeparator:e,decimalZeroPadding:n}){return({elementState:i,data:s},o)=>{const{value:r,selection:l}=i,[c,h]=l,p=r.slice(c,h),u=n?[t,e]:[e],f=n&&c>r.indexOf(t)&&!!p.match(/^0+$/gi);return o!=="deleteBackward"&&o!=="deleteForward"||!u.includes(p)&&!f?{elementState:i,data:s}:{elementState:{value:r,selection:o==="deleteForward"?[h,h]:[c,c]},data:s}}}function rs({decimalSeparator:t,precision:e,prefix:n,postfix:i}){const s=new RegExp(`^\\D*${M(t)}`);return({elementState:o,data:r})=>{const{value:l,selection:c}=o,{cleanValue:h,extractedPrefix:p}=U(l,{prefix:n,postfix:i}),[u,f]=c,k=Yt(u-p.length,0,h.length),S=Yt(f-p.length,0,h.length);if(e<=0||h.slice(0,k).includes(t)||h.slice(S).includes(t)||!r.match(s))return{elementState:o,data:r};const V=h.slice(0,k).match(/\d+/);return{elementState:o,data:V?r:`0${r}`}}}function Me({validCharacter:t,pseudoCharacters:e,prefix:n,postfix:i}){const s=new RegExp(`[${e.join("")}]`,"gi");return({elementState:o,data:r})=>{const{value:l,selection:c}=o,{cleanValue:h,extractedPostfix:p,extractedPrefix:u}=U(l,{prefix:n,postfix:i});return{elementState:{selection:c,value:u+h.replace(s,t)+p},data:r.replace(s,t)}}}function as({decimalSeparator:t,prefix:e,postfix:n}){return({elementState:i,data:s})=>{const{value:o,selection:r}=i,[l,c]=r,{cleanValue:h}=U(o,{prefix:e,postfix:n});return{elementState:i,data:!h.includes(t)||o.slice(l,c+1).includes(t)?s:s.replaceAll(new RegExp(M(t),"gi"),"")}}}function cs({thousandSeparator:t,decimalSeparator:e,prefix:n,postfix:i}){if(!t)return Ft;const s=(...o)=>o.every(r=>/\s/.test(r));return({value:o,selection:r})=>{const{cleanValue:l,extractedPostfix:c,extractedPrefix:h}=U(o,{prefix:n,postfix:i}),{minus:p,integerPart:u,decimalPart:f}=sn(l,{decimalSeparator:e,thousandSeparator:t}),[k,S]=r;let[V,et]=r;const yt=Array.from(u).reduceRight((q,nt,gt)=>{const Jt=!(!gt&&nt===t)&&q.length&&(q.length+1)%4===0;return Jt&&(nt===t||s(nt,t))?t+q:nt===t&&!Jt?(gt&&gt<=k&&V--,gt&&gt<=S&&et--,q):Jt?(gt<=k&&V++,gt<=S&&et++,nt+t+q):nt+q},"");return{value:h+p+yt+(l.includes(e)?e:"")+f+c,selection:[V,et]}}}function ls({precision:t,decimalSeparator:e,prefix:n,postfix:i}){if(t>0)return Ft;const s=new RegExp(`${M(e)}.*$`,"g");return({elementState:o,data:r})=>{const{value:l,selection:c}=o,{cleanValue:h,extractedPrefix:p,extractedPostfix:u}=U(l,{prefix:n,postfix:i}),[f,k]=c,S=p+h.replace(s,"")+u;return{elementState:{selection:[Math.min(f,S.length),Math.min(k,S.length)],value:S},data:r.replace(s,"")}}}var Re=[0,0];function hs({decimalSeparator:t,thousandSeparator:e,prefix:n,postfix:i}){const s=is({decimalSeparator:t,thousandSeparator:e,prefix:n,postfix:i});return ge("blur",o=>{const r=s({value:o.value,selection:Re},{value:"",selection:Re}).value;de(o,r)},{capture:!0})}function ps({min:t,max:e,decimalSeparator:n}){return ge("blur",(i,s)=>{const o=we(i.value,n),r=Yt(o,t,e);!Number.isNaN(o)&&o!==r&&de(i,fe(Ji(r),s))},{capture:!0})}function us({decimalSeparator:t,prefix:e,postfix:n}){return ge("blur",i=>{const{cleanValue:s,extractedPostfix:o,extractedPrefix:r}=U(i.value,{prefix:e,postfix:n}),l=r+s.replace(new RegExp(`^(\\D+)?${M(t)}`),`$10${t}`)+o;de(i,l)},{capture:!0})}function ve({max:t=Number.MAX_SAFE_INTEGER,min:e=Number.MIN_SAFE_INTEGER,precision:n=0,thousandSeparator:i=Hi,decimalSeparator:s=".",decimalPseudoSeparators:o,decimalZeroPadding:r=!1,prefix:l="",postfix:c="",minusSign:h=oe}={}){const p=[Gt,Je,Qe,tn,oe].filter(k=>k!==i&&k!==s&&k!==h),u=Qi({decimalSeparator:s,thousandSeparator:i,decimalPseudoSeparators:o}),f=l.endsWith(s)&&n>0?`${l}${Ui}`:l;return Object.assign(Object.assign({},ue),{mask:nn({decimalSeparator:s,precision:n,thousandSeparator:i,prefix:f,postfix:c,isNegativeAllowed:e<0,minusSign:h}),preprocessors:[Gi(),ns({decimalSeparator:s,decimalPseudoSeparators:u,pseudoMinuses:p,prefix:f,postfix:c,minusSign:h}),Xi({prefix:f,postfix:c}),Me({validCharacter:h,pseudoCharacters:p,prefix:f,postfix:c}),Me({validCharacter:s,pseudoCharacters:u,prefix:f,postfix:c}),rs({decimalSeparator:s,precision:n,prefix:f,postfix:c}),os({decimalSeparator:s,decimalZeroPadding:r,thousandSeparator:i}),ls({precision:n,decimalSeparator:s,prefix:f,postfix:c}),as({decimalSeparator:s,prefix:f,postfix:c})],postprocessors:[ss({decimalSeparator:s,min:e,max:t,minusSign:h}),Ki(f),Zi(c),cs({decimalSeparator:s,thousandSeparator:i,prefix:f,postfix:c}),ts({decimalSeparator:s,decimalZeroPadding:r,precision:n,prefix:f,postfix:c}),es({prefix:f,postfix:c,decimalSeparator:s,thousandSeparator:i})],plugins:[hs({decimalSeparator:s,thousandSeparator:i,prefix:f,postfix:c}),us({decimalSeparator:s,prefix:f,postfix:c}),ps({min:e,max:t,decimalSeparator:s})],overwriteMode:r?({value:k,selection:[S]})=>S<=k.indexOf(s)?"shift":"replace":"shift"})}var ds=m`

    :host {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0;
        text-align: right;
        width: fit-content;
        color: var(--color-content-content-secondary);
    }

    ${O(m`
        :host {
            font-size: 13px;
        }
    `)}
`,pt=class extends ${constructor(){super(...arguments),this.balance$=b(()=>{if(!this.context)throw new Error("");if(!this.tokenType)throw new Error("");return ft([this.context.connectedWalletAddress$,this.context.getTokenByType(this.tokenType),this.context.chainId$,this.context.chainId$.pipe(L(t=>t?ce(t):[]),J(null))])}).pipe(zt(([t])=>!!t),L(async([t,e,n])=>{if(!t||!e||!n)return a`<br>`;const i=await this.applicationContext.tokenController.getTokenBalance(n,e.address,t);if(!i)return a`<br>`;const s=ae(z(BigInt(i.amount),e.decimals),6);return this.getBalanceView(s)}))}render(){return a`${T(this.balance$,a`<br>`)}`}getBalanceView(t){return a`
      <span>${v("widgets.swap-form.input.balance.balance")}: ${t}</span>
    `}};pt.tagName="inch-swap-balance";pt.styles=ds;d([x({type:String,attribute:!0})],pt.prototype,"tokenType",2);d([C({context:K})],pt.prototype,"context",2);d([C({context:W})],pt.prototype,"applicationContext",2);pt=d([y(pt.tagName)],pt);var fs=m`

    :host {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0;
        text-align: right;
        color: var(--color-content-content-secondary);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    ${O(m`
        :host {
            font-size: 13px;
        }
    `)}

`,ut=class extends ${constructor(){super(...arguments),this.balance$=b(()=>{if(!this.context)throw new Error("");if(!this.tokenType)throw new Error("");return ft([this.context.connectedWalletAddress$,this.context.getTokenByType(this.tokenType),this.context.chainId$])}).pipe(zt(([t])=>!!t),L(([t,e,n])=>!t||!e||!n?[a`<br>`]:ft([this.applicationContext.tokenController.liveQuery(()=>this.applicationContext.tokenController.getTokenUSDPrice(n,e.address)),this.context.getTokenRawAmountByType(this.tokenType)]).pipe(A(([i,s])=>{if(!s)return a`<br>`;const o=z(BigInt(s),e.decimals),r=Number(o)*Number(i);return this.getBalanceView(vt(r.toString(),1))}),qe(()=>[a`<br>`]))))}render(){return a`${T(this.balance$,a`<br>`)}`}getBalanceView(t){return a`
      <span>~$${t}</span>
    `}};ut.tagName="inch-fiat-balance";ut.styles=fs;d([x({type:String,attribute:!0})],ut.prototype,"tokenType",2);d([C({context:K})],ut.prototype,"context",2);d([C({context:W})],ut.prototype,"applicationContext",2);ut=d([y(ut.tagName)],ut);var ms=m`

    .input-container {
        height: 128px;
        border-radius: 16px;
        background-color: var(--color-background-bg-secondary);
        transition: box-shadow .2s;
        padding: 16px;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: minmax(40%, auto) minmax(auto, 70%);
        justify-content: space-between;
    }

    .input-container.disabled {
        background-color: var(--color-background-bg-primary);
        border: 1px solid var(--color-border-border-tertiary);
    }
    
    .flex-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }
    
    .input-title {
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: 0;
        text-align: left;
        color: var(--color-content-content-secondary);
        width: fit-content;
    }

    .symbol-container {
        border: none;
        background-color: transparent;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        color: var(--color-content-content-primary);
        border-radius: 16px;
        padding: 8px;
        margin-left: -8px;
        transition: background-color .2s;
        outline: none;
        user-select: none;
        width: fit-content;
        -webkit-tap-highlight-color: transparent;
    }

    .symbol-container_disabled {
        cursor: auto;
    }
    
    .symbol {
        font-size: 24px;
        font-weight: 600;
        line-height: 32px;
        letter-spacing: 0;
        text-align: left;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    
    .token-name {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0;
        text-align: left;
        color: var(--color-content-content-secondary);
        font-style: normal;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .token-name:dir(rtl) {
        text-align: right;
    }
    
    .amount-input {
        height: 48px;
        padding: 0;
        color: var(--color-content-content-primary);
        box-sizing: border-box;
        font-size: 24px;
        font-weight: 600;
        line-height: 32px;
        letter-spacing: 0;
        text-align: right;
        border: none;
        background-color: transparent;
        outline: none;
        user-select: none;
        width: 100%;
    }
    
    .input-rtl {
        text-align: left; 
    }

    .amount-input[type="number"]::-webkit-inner-spin-button,
    .amount-input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    .amount-input[type="number"] {
        -moz-appearance: textfield;
    }
    .amount-input:disabled {
        opacity: 1;
        color: var(--color-content-content-primary);
    }
    
    .balance-amount-fiat {
        align-items: flex-end;
    }
    
    .focus:not(.disabled) {
        box-shadow: inset 0 0 0 1px var(--primary-50);
    }
    
    .balance-and-max {
        display: flex;
        gap: 8px;
        align-items: center;
    }
    
    .loading {
        will-change: opacity;
        animation: stub-loader-animation 2s ease-in-out infinite;
    }
    
    .input-rtl {
        text-align: end;
    }

    @keyframes stub-loader-animation {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
    
    @media (hover: hover) {
        .input-container:not(.disabled):not(.focus):hover {
            box-shadow: inset 0 0 0 1px var(--primary-12);
        }
        .symbol-container:not(.symbol-container_disabled):hover {
            background-color: var(--color-background-bg-positive-hover);
        }
    }

    ${O(m`
        .amount-input {
            height: 40px;
        }
        .symbol, .amount-input {
            font-size: 20px;
        }
        .input-title, .token-name {
            font-size: 13px;
        }
        .input-container {
            height: 116px;
        }
        .symbol-container {
            padding: 4px 8px;
        }
    `)}
    
    .symbol-container:not(.symbol-container_disabled):active {
        transform: scale(.98);
        background-color: var(--color-background-bg-positive-hover);
    }
    
    .select-token-text {
        word-wrap: break-word;
        white-space: nowrap
    }

`,D=class extends ${constructor(){super(...arguments),this.disabled=!1,this.isFocus=!1,this.connectedAddress=null,this.setMaxInProgress=!1,this.token=null,this.token$=b(()=>this.getTokenEventEmitter()).pipe(Zt({bufferSize:1,refCount:!0})),this.chainId$=b(()=>this.getChainEventEmitter()),this.connectedAddress$=b(()=>this.getConnectedWalletAddress()),this.amount$=b(()=>this.getTokenAmountStream()),this.loading$=b(()=>this.getLoadingStream()),this.loaderView$=b(()=>this.loading$.pipe(A(t=>this.tokenType==="source"?a`${this.input}`:t?a`<span class="loader"></span>`:a`${this.input}`),J(a`${this.input}`))),this.input=document.createElement("input"),this.maskedInput=this.buildMask(6),this.tokenView$=this.token$.pipe(A(t=>t?this.tokenView(t):this.selectTokenView()))}connectedCallback(){super.connectedCallback(),this.input.classList.add("amount-input"),this.input.inputMode="decimal",this.input.autocomplete="off",this.input.placeholder=this.tokenType==="source"?"0":"",this.input.onfocus=()=>this.onFocus(),this.input.onblur=()=>this.onBlur(),this.input.oninput=i=>this.onInput(i);const t=this.token$.pipe(_(i=>{i&&(this.maskedInput.destroy(),this.maskedInput=this.buildMask(i.decimals))})),e=this.loading$.pipe(L(i=>this.tokenType==="source"?Rt(void 0):i&&!this.input.classList.contains("loading")?(this.input.classList.add("loading"),Rt(void 0)):!i&&this.input.classList.contains("loading")?_n(this.input.animate([{},{opacity:1}],{duration:2e3}).finished.then(()=>{this.input.classList.remove("loading")})):Rt(void 0))),n=ft([this.amount$,this.token$]).pipe(A(([i,s])=>!i||!s?"0":z(i,s.decimals)),zt((i,s)=>s===0&&i==="0"?!1:i!==this.input.value),_(i=>this.input.value=ae(i,6)));tt(this,[t,n,e,this.token$.pipe(_(i=>this.token=i)),this.connectedAddress$.pipe(_(i=>this.connectedAddress=i))],{requestUpdate:!1}),tt(this,[Oe])}disconnectedCallback(){super.disconnectedCallback(),this.maskedInput.destroy()}render(){const t={disabled:this.disabled,focus:this.isFocus};return this.input.disabled=this.tokenType==="destination",this.updateInputRtl(),a`
      <div class="input-container ${j(t)}">
        <div class="flex-container symbol-title-name">
          <div class="input-title">${Ze(this.tokenType,[["source",()=>a`${v("widgets.swap-form.input.title.you_pay")}`],["destination",()=>a`${v("widgets.swap-form.input.title.you_receive")}`]])}</div>
          ${T(this.tokenView$)}
        </div>
        
        <div class="flex-container balance-amount-fiat">
          <div class="balance-and-max">
            <inch-swap-balance tokenType="${Q(this.tokenType)}"></inch-swap-balance>
            ${g(this.connectedAddress&&this.token&&this.tokenType==="source",()=>a`
              <inch-button @click="${async()=>{var e;this.setMaxInProgress=!0,await((e=this.context)==null?void 0:e.setMaxAmount()),this.setMaxInProgress=!1}}" type="secondary" size="xs" loader="${Q(this.setMaxInProgress?"":void 0)}">MAX</inch-button>
            `)}
          </div>
          ${this.input}
          <inch-fiat-balance tokenType="${Q(this.tokenType)}"></inch-fiat-balance>
        </div>
      </div>
    `}selectTokenView(){return a`
      <inch-button disabledSlotPointerEvent type="secondary" size="l" @click="${t=>E(this,"openTokenSelector",this.tokenType,t)}">
        <span class="select-token-text">Select token</span>
        <inch-icon icon="chevronDown16"></inch-icon>
      </inch-button>
      <br>
    `}onFocus(){this.isFocus=!0,E(this,"focusTokenInput",this.tokenType)}onBlur(){this.isFocus=!1,E(this,"blurTokenInput",this.tokenType)}tokenView(t){var o,r;const{name:e,symbol:n,address:i}=t,s={"symbol-container":!0,"symbol-container_disabled":((o=this.config)==null?void 0:o.swapFromParams.disabledTokenChanging)??!1};return a`
      <button @click="${l=>this.openTokenSelector(l)}"
              class="${j(s)}">
        <inch-token-icon
          symbol="${n}"
          address="${i}"
          chainId="${T(this.chainId$)}"
        ></inch-token-icon>
        <span class="symbol">${n}</span>
        ${g(!((r=this.config)!=null&&r.swapFromParams.disabledTokenChanging),()=>a`<inch-icon icon="chevronDown16"></inch-icon>`)}
      </button>
      <div class="token-name">${e}</div>
    `}openTokenSelector(t){var e;(e=this.config)!=null&&e.swapFromParams.disabledTokenChanging||E(this,"openTokenSelector",this.tokenType,t)}updateInputRtl(){Bt()&&!this.input.classList.contains("input-rtl")&&this.input.classList.add("input-rtl"),!Bt()&&this.input.classList.contains("input-rtl")&&this.input.classList.remove("input-rtl")}getTokenEventEmitter(){if(!this.context)throw new Error("");if(!this.tokenType)throw new Error("");return this.context.getTokenByType(this.tokenType)}getTokenAmountStream(){if(!this.context)throw new Error("");if(!this.tokenType)throw new Error("");return this.context.getTokenAmountByType(this.tokenType)}getLoadingStream(){if(!this.context)throw new Error("");if(!this.tokenType)throw new Error("");return this.context.loading$}getChainEventEmitter(){if(!this.context)throw new Error("");return this.context.chainId$}getConnectedWalletAddress(){if(!this.context)throw new Error("");return this.context.connectedWalletAddress$}onInput(t){var o;if(!this.tokenType)return;const e=t.target,n=(e==null?void 0:e.value)??"",i=this.token;if(!i)return;const s=ie(n.replaceAll(" ",""),i.decimals);(o=this.context)==null||o.setTokenAmountByType(this.tokenType,s)}buildMask(t){return new me(this.input,ve({precision:t,max:9*10**15,min:0}))}};D.tagName="inch-swap-form-input";D.styles=ms;d([x({type:Boolean,attribute:!0,reflect:!0})],D.prototype,"disabled",2);d([x({type:String,attribute:!0,reflect:!0})],D.prototype,"tokenType",2);d([P()],D.prototype,"isFocus",2);d([P()],D.prototype,"connectedAddress",2);d([P()],D.prototype,"setMaxInProgress",2);d([C({context:K})],D.prototype,"context",2);d([C({context:re})],D.prototype,"config",2);D=d([y(D.tagName)],D);var gs=m`

    :host {
        height: 4px;
        position: relative;
        outline: none;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        -webkit-tap-highlight-color: transparent;
    }
    
    .switcher {
        position: absolute;
        border-radius: 50%;
        border: none;
        background-color: var(--color-background-bg-primary);
        color: var(--color-content-content-primary);
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.12), 0 1px 4px 0 rgba(0, 0, 0, 0.12);
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        top: -13px;
        cursor: pointer;
        will-change: transform;
    }
    
    .switcher:disabled {
        cursor: not-allowed;
        pointer-events: none;
        color: var(--color-content-content-disabled);
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.12), 0 1px 4px 0 rgba(0, 0, 0, 0.12);
    }
    
    @media (hover: hover) {
        .switcher:not(:disabled):hover {
            color: var(--color-content-content-secondary);
        }
    }
`,bt=class extends ${constructor(){super(...arguments),this.iconRef=xe(),this.buttonRef=xe(),this.mobileMedia=At(),this.isUp=!1,this.isDisabled$=b(()=>{if(!this.context)throw new Error("");return ft([this.context.getTokenByType("source"),this.context.getTokenByType("destination")])}).pipe(A(([t,e])=>{var n;return!t||!e||((n=this.config)==null?void 0:n.swapFromParams.disabledTokenChanging)}))}firstUpdated(){var t;if(this.buttonRef.value&&!((t=this.config)!=null&&t.swapFromParams.disabledTokenChanging)&&!this.mobileMedia.matches){const e={duration:200,easing:"cubic-bezier(.1, .3, .6, 1)"};tt(this,[Ut(this.buttonRef.value,"mouseenter").pipe(L(async()=>{!this.iconRef.value||this.isUp||(this.isUp=!0,await this.iconRef.value.animate([{transform:"rotate(0deg)"},{transform:"rotate(180deg)"}],e).finished,I(this.iconRef.value,{transform:"rotate(180deg)"}))})),Ut(this.buttonRef.value,"mouseleave").pipe(L(async()=>{!this.iconRef.value||!this.isUp||(this.isUp=!1,await this.iconRef.value.animate([{transform:"rotate(180deg)"},{transform:"rotate(360deg)"}],e).finished,I(this.iconRef.value,{transform:""}))}))])}}render(){return a`
      <button
        ${ye(this.buttonRef)}
        @click="${()=>this.onClick()}"
        ?disabled="${T(this.isDisabled$,!1)}"
        class="switcher"
      >
        <inch-icon ${ye(this.iconRef)} class="switcher-icon" icon="arrowDown24"></inch-icon>
      </button>
    `}async onClick(){var e,n;if((e=this.config)!=null&&e.swapFromParams.disabledTokenChanging||!this.iconRef.value||!this.isUp&&!this.mobileMedia.matches)return;(n=this.context)==null||n.switchPair();const t={duration:200,easing:"cubic-bezier(.1, .3, .6, 1)"};this.mobileMedia.matches||(await this.iconRef.value.animate([{transform:"rotate(180deg)"},{transform:"rotate(360deg)"}],t).finished,I(this.iconRef.value,{transform:""}),this.isUp=!1)}};bt.tagName="inch-token-pair-switch";bt.styles=gs;d([C({context:K})],bt.prototype,"context",2);d([C({context:re})],bt.prototype,"config",2);bt=d([y(bt.tagName)],bt);var ws=m`
      :host {
          height: 57px;
      }

      ${O(m`
          :host {
              height: 44px;
          }
      `)}
      .smart-hover {
          position: relative;
          overflow: hidden;
      }
      .on-hover,
      .off-hover {
          position: absolute;
          transition: transform .2s;
      }
      
      .on-hover {
          transform: translateY(-200%);
      }

      .rainbow {
          --button-text-color-ext: #ffffff;
          --button-text-color-ext-hover: #ffffff;
          position: relative;
      }

      .rainbow:after, .rainbow:before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: ${Rn()};
          background-size: 1000%;
          animation: bg-rainbow 300s cubic-bezier(0.4, 0, 1, 1) infinite;
          z-index: -1;
      }

      @keyframes bg-rainbow {
          0% {
              border-radius: 24px;
              background-position: 0 0;
          }
          50% {
              border-radius: 24px;
              background-size: 800%;
              background-position: 400% 0;
          }
          100% {
              border-radius: 24px;
              background-position: 0 0;
          }
      }
      @media (hover: hover) {
          .smart-hover:hover .on-hover {
              transform: translateY(0);
          }

          .smart-hover:hover .off-hover {
              transform: translateY(200%);
          }
      }
      @media (hover: none) {
          .smart-hover .on-hover {
              transform: translateY(0);
          }

          .smart-hover .off-hover {
              transform: translateY(200%);
          }
      }

  `,vs=[1,9,15,16,13,14],F=class extends ${constructor(){super(...arguments),this.isRainbowTheme=!1,this.buttonState=Se.get("fusion_swap_button_state",Vn)??0,this.chainId=null,this.srcToken=null,this.lastPermitCheckToken=null,this.mobileMedia=Z(this),this.connectedWalletAddress$=b(()=>this.getConnectedWalletAddress()),this.sourceToken$=b(()=>this.getSourceToken()),this.destinationToken$=b(()=>this.getDestinationToken()),this.chainId$=b(()=>this.getChainId()),this.sourceTokenAmount$=b(()=>this.getSourceTokenAmount()),this.rate$=b(()=>this.getRate()),this.loading$=b(()=>this.getLoading()),this.block$=this.chainId$.pipe(L(t=>t?ce(t):[])),this.updateView$=new Pt,this.exceedingMaximumAmount$=ft([this.connectedWalletAddress$,this.sourceToken$,this.sourceTokenAmount$.pipe(J(0n)),ke(this.chainId$,this.block$).pipe(J(null))]).pipe(L(([t,e,n])=>!t||!e||n===0n||!this.context?Rt(!1):this.context.getMaxAmount().then(i=>i===0n?!0:!n||n>i)),Zt({bufferSize:1,refCount:!0})),this.calculateStatus$=ft([this.connectedWalletAddress$,this.sourceToken$,this.destinationToken$,this.exceedingMaximumAmount$,this.sourceTokenAmount$.pipe(J(0n)),this.chainId$,this.rate$.pipe(J(null)),this.loading$,ke(this.block$,this.updateView$).pipe(J(null))]).pipe(A((t,e)=>{const[n,i,s,o,r,l,c,h]=t;return this.chainId=l,this.srcToken=i,yn(l)?n===null?3:i===null?4:s===null?5:!r||r===0n?6:o?7:h&&(e===0||c===null)?13:c===null?8:je(i.address)?12:this.isNeedCheckAllowance()?(this.lastPermitCheckToken=i,9):0:2}),Ht(),Be(0),Ue(this.chainId$,this.connectedWalletAddress$,this.sourceToken$),L(async([t,e,n,i])=>{if(t!==0)return t;if(!e||!n||!i)throw new Error("");this.buttonState=9;const s=$n(e),o=await Cn(e,i.address,n,s),r=await Mt(this.sourceTokenAmount$);return r&&o<r?kn(e)?await Sn(e,i.address,n,s)?t:11:10:t}),_(t=>{this.buttonState=t,Se.set("fusion_swap_button_state",this.buttonState)}))}connectedCallback(){super.connectedCallback(),tt(this,[Nn().pipe(A(({brandColor:t})=>t),Ht(),_(t=>this.isRainbowTheme=t===Pn.rainbow)),this.sourceToken$.pipe(_(t=>this.srcToken=t)),this.calculateStatus$]),this.updateView$.next()}render(){const t=this.mobileMedia.matches?"xl":"xxl";return a`
      <inch-button
        class="smart-hover"
        @click="${e=>this.onClickSwapButton(e)}"
        type="${this.getButtonType()}"
        size="${t}"
        loader="${Q(this.getLoaderState())}"
        fullSize
      >
        
        ${g(this.buttonState===2,()=>a`
          <span class="off-hover">Chain ${this.chainId} not supported</span>
          <span class="on-hover">Change chain</span>
          <br>
        `)}
        ${g(this.buttonState===13,()=>a`<span>${v("widgets.swap-form.swap-button.update-swap-data")}</span>`)}
        ${g(this.buttonState===14,()=>a`<span>${v("widgets.swap-form.swap-button.waiting-approve-transaction")}</span>`)}
        ${g(this.buttonState===0,()=>a`<span>${v("widgets.swap-form.swap-button.confirm-swap")}</span>`)}
        ${g(this.buttonState===1,()=>a`<span>${v("widgets.swap-form.swap-button.confirm-swap")}</span>`)}
        ${g(this.buttonState===9,()=>a`<span>${v("widgets.swap-form.swap-button.check-allowance")}</span>`)}
        ${g(this.buttonState===12,()=>a`<span>${v("widgets.swap-form.swap-button.native-token-not-supported")}</span>`)}
        ${g(this.buttonState===10,()=>a`<span>${v("widgets.swap-form.swap-button.approve-and-swap")}</span>`)}
        ${g(this.buttonState===11,()=>a`<span>${v("widgets.swap-form.swap-button.permit-and-swap")}</span>`)}
        ${g(this.buttonState===3,()=>a`<span>${v("widgets.swap-form.swap-button.connect-wallet")}</span>`)}
        ${g(this.buttonState===4,()=>a`<span>${v("widgets.swap-form.swap-button.select-source-token")}</span>`)}
        ${g(this.buttonState===5,()=>a`<span>${v("widgets.swap-form.swap-button.select-destination-token")}</span>`)}
        ${g(this.buttonState===6,()=>a`<span>${v("widgets.swap-form.swap-button.enter-amount-to-swap")}</span>`)}
        ${g(this.buttonState===8,()=>a`<span>${v("widgets.swap-form.swap-button.no-liquidity-for-swap")}</span>`)}
        ${g(this.buttonState===7,()=>{var e,n;return a`
          <span class="off-hover">${v("widgets.swap-form.swap-button.insufficient-balance",{symbol:(e=this.srcToken)==null?void 0:e.symbol})}</span>
          <span class="on-hover">${v("widgets.swap-form.swap-button.set-max",{symbol:(n=this.srcToken)==null?void 0:n.symbol})}</span>
          <br>
        `})}
        ${g(this.buttonState===15,()=>a`
          <span class="off-hover">${v("widgets.swap-form.swap-button.wait-wallet-response")}</span>
          <span class="on-hover">${v("widgets.swap-form.swap-button.permit-swap-in-wallet")}</span>
          <br>
        `)}
        ${g(this.buttonState===16,()=>a`
          <span class="off-hover">${v("widgets.swap-form.swap-button.wait-wallet-response")}</span>
          <span class="on-hover">${v("widgets.swap-form.swap-button.allow-swap-in-wallet")}</span>
          <br>
        `)}
      </inch-button>
    `}async onClickSwapButton(t){if(!this.context)throw new Error("");const e=this.buttonState;try{if(this.buttonState===2)return E(this,"changeChain",null);if(this.buttonState===3)return E(this,"connectWallet",null);if(this.buttonState===4)return E(this,"openTokenSelector","source",t);if(this.buttonState===5)return E(this,"openTokenSelector","destination",t);if(this.buttonState===7)return await this.context.setMaxAmount();if(this.buttonState===10){if(this.chainId===null)throw new Error("");this.buttonState=16;const n=await this.context.getApprove();this.buttonState=14,await bn(this.chainId,n),this.buttonState=0}if(this.buttonState===11&&(this.buttonState=15,await this.context.getPermit(),this.buttonState=0),this.buttonState===12&&await this.applicationContext.notificationsController.warning(a`${v("widgets.swap-form.swap-button.native-token-not-supported")}`),this.buttonState===0){this.buttonState=1;const n=await this.context.getSnapshot();n&&E(this,"confirmSwap",n,t),this.buttonState=0,this.updateView$.next()}}catch{this.buttonState=e}}getButtonType(){return this.buttonState===0||this.buttonState===10||this.buttonState===11?"primary":"secondary"}getLoaderState(){if(vs.includes(this.buttonState))return!0}async onSwap(){}getConnectedWalletAddress(){if(!this.context)throw new Error("");return this.context.connectedWalletAddress$}getChainId(){if(!this.context)throw new Error("");return this.context.chainId$}getSourceToken(){if(!this.context)throw new Error("");return this.context.getTokenByType("source")}getDestinationToken(){if(!this.context)throw new Error("");return this.context.getTokenByType("destination")}getSourceTokenAmount(){if(!this.context)throw new Error("");return this.context.getTokenRawAmountByType("source")}getRate(){if(!this.context)throw new Error("");return this.context.rate$}getLoading(){if(!this.context)throw new Error("");return this.context.loading$}isNeedCheckAllowance(){return this.lastPermitCheckToken===null?!0:this.srcToken!==null&&!Lt(this.srcToken,this.lastPermitCheckToken)}};F.tagName="inch-swap-button";F.styles=ws;d([C({context:K})],F.prototype,"context",2);d([C({context:W})],F.prototype,"applicationContext",2);d([P()],F.prototype,"isRainbowTheme",2);d([P()],F.prototype,"buttonState",2);d([P()],F.prototype,"chainId",2);d([P()],F.prototype,"srcToken",2);d([le()],F.prototype,"onClickSwapButton",1);F=d([y(F.tagName)],F);var bs=m`
  :host {
      display: flex;
      flex-direction: column;
  }
`,xs=m`

    .slippage-title {
        display: flex;
        padding: 8px;
        gap: 8px;
        color: var(--color-content-content-primary);
        align-items: center;
        margin-bottom: 8px;
        cursor: pointer;
        font-size: 16px;
    }
    
    .back-icon {
        transform: rotate(90deg);
    }
    
    ${O(m`
        .slippage-title {
            font-size: 13px;
        }
    `)}

`,St=class extends ${constructor(){super(...arguments),this.mobileMedia=Z(this),this.segmentsCustom={label:"Custom",value:"custom",template:()=>a`${this.customSlippageInput}`},this.segments=[{label:"Auto",value:"auto"},{label:"0.1%",value:.1},{label:"0.5%",value:.5},{label:"1%",value:1},this.segmentsCustom],this.postfix="%",this.customSlippageInput=document.createElement("input")}connectedCallback(){var t;super.connectedCallback(),this.buildMask(),(t=this.settings)==null||t.startChangingValue(),this.customSlippageInput.placeholder="Custom %",this.customSlippageInput.inputMode="decimal",this.customSlippageInput.autocomplete="off",I(this.customSlippageInput,{backgroundColor:"transparent",border:"none",outline:"none",padding:"0",color:"var(--color-content-content-primary)",width:"80px",fontSize:"16px",textAlign:"center"}),tt(this,[Ut(this.customSlippageInput,"input").pipe(_(()=>{var n;this.customSlippageInput.value.length===1&&(this.customSlippageInput.value="");const e=parseFloat(this.customSlippageInput.value.replace(this.postfix,""));(n=this.settings)==null||n.setValue([e,"custom"])}))],{requestUpdate:!1})}render(){return I(this.customSlippageInput,{fontSize:this.mobileMedia.matches?"13px":"16px"}),a`
      <div @click="${()=>this.onBack()}" class="slippage-title">
        <inch-icon class="back-icon" icon="chevronDown16"></inch-icon>
        <span>${v("widgets.swap-form.fusion-info.slippage-tolerance")}</span>
      </div>
      <inch-segmented-control
        .items="${this.segments}"
        .select="${this.getStartSection()}"
        @change="${t=>this.onChange(t)}"
      ></inch-segmented-control>
    `}buildMask(){return new me(this.customSlippageInput,ve({max:99,min:1,precision:2,postfix:this.postfix}))}onBack(){var e,n,i;const t=((e=this.settings)==null?void 0:e.value)??null;t&&t[1]==="custom"&&(t[0]===null||isNaN(t[0]))&&((n=this.settings)==null||n.resetValue()),(i=this.settings)==null||i.endChangingValue(),E(this,"back",null)}onChange({detail:t}){var n,i,s;const e=t.value;if(e==="auto"){(n=this.settings)==null||n.cleanValue();return}if(e==="custom"){const o=parseFloat(this.customSlippageInput.value.replace(this.postfix,""));(i=this.settings)==null||i.setValue([o,"custom"]);return}(s=this.settings)==null||s.setValue([t.value,"preset"])}getStartSection(){if(!this.settings||this.settings.value===null)return this.segments[0];const[t,e]=this.settings.value;if(e==="custom")return isNaN(parseFloat(t))?this.segments[0]:(this.customSlippageInput.value=`${t}%`,this.segmentsCustom);if(e==="preset"){const n=this.segments.find(i=>i.value===t);return n||this.segments[0]}throw new Error("Invalid slippage type")}};St.tagName="inch-fusion-swap-info-slippage";St.styles=xs;d([x({type:Object})],St.prototype,"settings",2);St=d([y(St.tagName)],St);var ys=m`

    .slippage-title {
        display: flex;
        padding: 8px;
        gap: 8px;
        color: var(--color-content-content-primary);
        align-items: center;
        margin-bottom: 8px;
        cursor: pointer;
        font-size: 16px;
    }
    
    .back-icon {
        transform: rotate(90deg);
    }
    
    ${O(m`
        .slippage-title {
            font-size: 13px;
        }
    `)}

`,xt=class extends ${constructor(){super(),this.mobileMedia=Z(this),this.segmentsCustom={label:"Custom",value:"custom",template:()=>a`${this.customAuctionTimeInput}`},this.postfix="s",this.customAuctionTimeInput=document.createElement("input"),this.updateSegments()}connectedCallback(){var t;super.connectedCallback(),this.buildMask(),(t=this.settings)==null||t.startChangingValue(),this.customAuctionTimeInput.placeholder="Custom s",this.customAuctionTimeInput.inputMode="decimal",this.customAuctionTimeInput.autocomplete="off",I(this.customAuctionTimeInput,{backgroundColor:"transparent",border:"none",outline:"none",padding:"0",color:"var(--color-content-content-primary)",width:"80px",fontSize:"16px",textAlign:"center"}),this.updateSegments(),tt(this,[Ut(this.customAuctionTimeInput,"input").pipe(_(()=>{var n;this.customAuctionTimeInput.value.length===1&&(this.customAuctionTimeInput.value="");const e=this.getValue();(n=this.settings)==null||n.setValue([e,"custom"])}))],{requestUpdate:!1})}render(){return I(this.customAuctionTimeInput,{fontSize:this.mobileMedia.matches?"13px":"16px"}),a`
      <div @click="${()=>this.onBack()}" class="slippage-title">
        <inch-icon class="back-icon" icon="chevronDown16"></inch-icon>
        <span>Auction time</span>
      </div>
      <inch-segmented-control
        .items="${this.segments}"
        .select="${this.getStartSection()}"
        @change="${t=>this.onChange(t)}"
      ></inch-segmented-control>
    `}buildMask(){return new me(this.customAuctionTimeInput,ve({max:60*60*30,min:60*3,postfix:this.postfix}))}onBack(){var e,n,i;const t=((e=this.settings)==null?void 0:e.value)??null;t&&t[1]==="custom"&&(t[0]===null||isNaN(t[0]))&&((n=this.settings)==null||n.resetValue()),(i=this.settings)==null||i.endChangingValue(),E(this,"back",null)}onChange({detail:t}){var n,i,s;const e=t.value;if(e==="auto"){(n=this.settings)==null||n.cleanValue();return}if(e==="custom"){const o=this.getValue();(i=this.settings)==null||i.setValue([o,"custom"]);return}(s=this.settings)==null||s.setValue([t.value,"preset"])}getStartSection(){if(!this.settings||this.settings.value===null)return this.segments[0];const[t,e]=this.settings.value;if(e==="custom")return isNaN(parseFloat(t))?this.segments[0]:(this.customAuctionTimeInput.value=`${t}s`,this.segmentsCustom);if(e==="preset"){const n=this.segments.find(i=>i.value===t);return n||this.segments[0]}throw new Error("Invalid auction time type")}getValue(){const t=this.customAuctionTimeInput.value.replaceAll(" ","").replace(this.postfix,"");return parseInt(t,10)}updateSegments(){var t,e;this.segments=[{label:"Auto",value:"auto"},{label:"3m",value:60*3},{label:"5m",value:60*5},{label:"10m",value:60*10},{label:"30m",value:60*30},this.mobileMedia.matches||(t=this.applicationContext)!=null&&t.isEmbedded?null:{label:"1H",value:60*60},this.mobileMedia.matches||(e=this.applicationContext)!=null&&e.isEmbedded?null:{label:"2H",value:60*60*2},this.segmentsCustom].filter(Boolean)}};xt.tagName="inch-fusion-swap-info-auction-time";xt.styles=ys;d([x({type:Object})],xt.prototype,"settings",2);d([C({context:W})],xt.prototype,"applicationContext",2);xt=d([y(xt.tagName)],xt);var $s=m`
    
    :host {
        --font-size: 16px;
    }
    
    .container {
        height: 56px;
        padding: 16px;
        box-sizing: border-box;
        transition: height .2s, background-color .2s;
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: flex-start;
        justify-content: space-between;
        border-radius: 16px;
        color: var(--color-content-content-primary);
        cursor: pointer;
    }

    .open {
        height: 236px;
        grid-template-rows: min-content 1fr;
        grid-row-gap: 16px;
        cursor: auto;
    }

    .icon {
        transition: transform .2s;
        will-change: transform;
    }

    .open-icon {
        transform: rotate(180deg);
    }

    .fusion-info {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .fusion-icon {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--primary);
        text-align: right;
        font-size: var(--font-size);
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        transition: opacity .2s, transform .2s;
        will-change: opacity;
    }

    .fusion-icon-open {
        opacity: 0;
        transform: translate3d(20px, 0, 0);
    }

    .fusion-icon-open:dir(rtl) {
        transform: translate3d(-20px, 0, 0);
    }

    .rate-container {
        width: 100%;
        display: flex;
        align-content: flex-start;
    }

    .rate-view {
        font-size: var(--font-size);
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
    }

    .rate-view:dir(rtl) {
        direction: ltr;
    }

    .rate-loader {
        background-color: var(--color-background-bg-secondary);
        height: 24px;
        width: 50%;
        border-radius: 8px;
        will-change: filter;
        transition: background-color .2s;
        animation: stub-loader-animation 3s ease-in-out infinite;
    }

    @keyframes stub-loader-animation {
        0%, 100% {
            filter: opacity(1);
        }
        50% {
            filter: opacity(0.5);
        }
    }

    .dst-token-rate-usd-price {
        color: var(--color-content-content-secondary);
        font-size: var(--font-size);
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        margin-left: 4px;
    }
    
    .content-container {
        display: flex;
        grid-row-start: 2;
        grid-row-end: 3;
        height: 100%;
        grid-column-start: 1;
        grid-column-end: 3;
        flex-direction: column;
        visibility: hidden;
        transform: translate3d(0, -15px, 0);
        transition: transform .2s, opacity .2s;
    }
    
    .open .content-container {
        visibility: visible;
        transform: translate3d(0, 0, 0);
    }
    
    .content-row {
        height: 40px;
        padding: 8px 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .row-slippage {
        color: var(--primary);
        text-align: right;
        font-size: var(--font-size);
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        cursor: pointer;
    }
    
    .row-title {
        color: var(--color-content-content-secondary);
        font-size: var(--font-size);
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
    }
    
    .row-content {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--primary);
        text-align: right;
        font-size: var(--font-size);
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        transition: opacity .2s, transform .2s, color .2s;
        will-change: opacity;
    }
    
    .min-receive {
        color: var(--color-content-content-primary);
    }

    @media (hover: hover) {
        .container:not(.open):hover {
            background-color: var(--color-background-bg-secondary);
        }

        .container:not(.open):hover .rate-loader {
            background-color: var(--color-background-bg-positive-hover);
        }
        
        .row-slippage:hover {
            color: var(--primary-hover);
        }
    }
    
    ${O(m`
        :host {
            --font-size: 13px
        }
        
        .container {
            padding: 16px 8px;
        }
        
        .open {
            grid-row-gap: 0;
            height: 180px;
        }

        .content-row {
            height: 30px;
        }
    `)}
`,dt=class extends ${constructor(){super(...arguments),this.isOpen=!1,this.rate$=b(()=>this.getContext().rate$),this.minReceive$=b(()=>this.getContext().minReceive$),this.chainId$=b(()=>this.getContext().chainId$),this.destinationToken$=b(()=>this.getContext().getTokenByType("destination")),this.slippage$=b(()=>this.getContext().slippage$).pipe(A(t=>a`
        ${t.value===null?"":a`<span>${t.value}% · </span>`}
        <span>
          ${g(t.type==="auto",()=>"Auto")}
          ${g(t.type==="custom",()=>"Custom")}
          ${g(t.type==="preset",()=>"Manual")}
        </span>
      `)),this.auctionTime$=b(()=>this.getContext().auctionTime$).pipe(A(t=>a`
        ${t.value===null?"":a`<span>${We(t.value)} · </span>`}
        <span>
          ${g(t.type==="auto",()=>"Auto")}
          ${g(t.type==="custom",()=>"Custom")}
          ${g(t.type==="preset",()=>"Manual")}
        </span>
      `)),this.rateView$=this.rate$.pipe(Be(0),Ht(Cs),L(async t=>{if(t===null)return this.getLoadRateView();const{chainId:e,rate:n,revertedRate:i,sourceToken:s,destinationToken:o}=t,r=await this.applicationContext.tokenController.getPriorityToken(e,[s.address,o.address]),l=Lt(r,s)?o:s,h=Lt(r,s)?i:n,p=vt(z(h,l.decimals),2),u=await this.applicationContext.tokenController.getTokenUSDPrice(e,l.address),f=ie(u,l.decimals),k=vt(z(f,l.decimals),2);return a`
        <span class="rate-view">1 ${He(l)} = ${p} ${r.symbol}  <span
          class="dst-token-rate-usd-price">~$${k}</span></span>
      `}),J(this.getLoadRateView()),Zt({bufferSize:1,refCount:!0})),this.minReceiveView$=this.minReceive$.pipe(Ue(this.destinationToken$,this.chainId$),L(async([t,e,n])=>{if(!e||!n)return a``;const i=await this.applicationContext.tokenController.getTokenUSDPrice(n,e.address),s=ie(i,e.decimals),o=zn.mul(t,s,e.decimals,e.decimals),r=$e(z(o,e.decimals),2);return a`
        <span>~$${r}</span>
        <span class="min-receive">${$e(z(t,e.decimals),6)} ${e.symbol}</span>
      `}))}connectedCallback(){super.connectedCallback(),E(this,"changeFusionInfoOpenState",this.isOpen)}disconnectedCallback(){super.disconnectedCallback(),E(this,"changeFusionInfoOpenState",!1)}render(){const t={container:!0,open:this.isOpen},e={icon:!0,"open-icon":this.isOpen},n={"fusion-icon":!0,"fusion-icon-open":this.isOpen};return a`
      <div class="${j(t)}" @click="${()=>{this.isOpen||(this.isOpen=!0,E(this,"changeFusionInfoOpenState",this.isOpen))}}">
        <div class="rate-container">
          ${T(this.rateView$)}
        </div>
        <div class="fusion-info">
          <div class="${j(n)}">
            <inch-icon icon="fusion16"></inch-icon>
            <span>Free</span>
          </div>
          <inch-button @click="${i=>this.onChangeOpen(i)}" size="l" type="tertiary">
            <inch-icon class="${j(e)}" icon="chevronDown16"></inch-icon>
          </inch-button>
        </div>
        <div class="content-container">
          <div class="content-row">
            <span class="row-title">${v("widgets.swap-form.fusion-info.slippage-tolerance")}</span>
            <div @click="${()=>E(this,"openSlippageSettings",null)}" class="row-content row-slippage">
              ${T(this.slippage$)}
            </div>
          </div>
          <div class="content-row">
            <span class="row-title">${v("widgets.swap-form.fusion-info.auction-time")}</span>
            <div @click="${()=>E(this,"openAuctionTimeSettings",null)}" class="row-content row-slippage">
              ${T(this.auctionTime$)}
            </div>
          </div>
          <div class="content-row">
            <span class="row-title">${v("widgets.swap-form.fusion-info.min-receive")}</span>
            <div class="row-content">
              ${T(this.minReceiveView$)}
            </div>
          </div>
          <div class="content-row">
            <span class="row-title">${v("widgets.swap-form.fusion-info.net-fee")}</span>
            <div class="row-content">
              <inch-icon icon="fusion16"></inch-icon>
              <span>Free</span>
            </div>
          </div>
        </div>
      </div>
    `}getLoadRateView(){return a`
      <div class="rate-loader"></div>
    `}onChangeOpen(t){t.preventDefault(),t.stopPropagation(),this.isOpen=!this.isOpen,E(this,"changeFusionInfoOpenState",this.isOpen)}getContext(){if(!this.context)throw new Error("");return this.context}};dt.tagName="inch-fusion-swap-info-main";dt.styles=$s;d([x({type:Boolean})],dt.prototype,"isOpen",2);d([C({context:K})],dt.prototype,"context",2);d([C({context:W})],dt.prototype,"applicationContext",2);dt=d([y(dt.tagName)],dt);function Cs(t,e){return t===null||e===null?!1:Ln(t,e)}var Et=class extends ${constructor(){super(...arguments),this.isOpenFusionInfo=!1,this.scene=new Ke("main",{main:{lazyRender:!0,minHeight:178},slippage:{minHeight:79.5},auctionTime:{minHeight:79.5}},ki())}render(){return this.scene.render({main:()=>a`
        <inch-fusion-swap-info-main
          .isOpen="${this.isOpenFusionInfo}"
          @openSlippageSettings="${()=>this.scene.nextTo("slippage")}"
          @openAuctionTimeSettings="${()=>this.scene.nextTo("auctionTime")}"
        ></inch-fusion-swap-info-main>
      `,slippage:()=>{var t;return a`
        <inch-fusion-swap-info-slippage
          .settings="${(t=this.context)==null?void 0:t.getSettingsController("slippage")}"
          @back="${()=>{this.isOpenFusionInfo=!0,this.scene.back()}}"
        ></inch-fusion-swap-info-slippage>
      `},auctionTime:()=>{var t;return a`
        <inch-fusion-swap-info-auction-time
          .settings="${(t=this.context)==null?void 0:t.getSettingsController("auctionTime")}"
          @back="${()=>{this.isOpenFusionInfo=!0,this.scene.back()}}"
        ></inch-fusion-swap-info-auction-time>
      `}})}};Et.tagName="inch-fusion-swap-info";Et.styles=[bs,Ke.styles()];d([C({context:K})],Et.prototype,"context",2);Et=d([y(Et.tagName)],Et);var H=class extends ${constructor(){super(...arguments),this.fusionView$=ft([b(()=>this.getWalletController().data.activeAddress$),b(()=>this.swapContext.getTokenByType("source")),b(()=>this.swapContext.getTokenByType("destination"))]).pipe(A(([t,e,n])=>!t||!e||!n),J(H.lastFusionRenderIsEmptyState),Ht(),A(t=>(H.lastFusionRenderIsEmptyState=t,t?a``:a`<inch-fusion-swap-info></inch-fusion-swap-info>`)))}render(){if(this.swapContext)return a`
      <div class="swap-form-container">
        <inch-card-header
          headerText="${v("widgets.swap-form.header.swap")}"
          headerTextPosition="left"
        >
          <slot name="header" slot="right-container"></slot>
        </inch-card-header>
        
        <div class="input-container">
          <inch-swap-form-input tokenType="source"></inch-swap-form-input>
          <inch-token-pair-switch></inch-token-pair-switch>
          <inch-swap-form-input disabled tokenType="destination"></inch-swap-form-input>
        </div>
        
        ${T(this.fusionView$)}
        
        <inch-swap-button></inch-swap-button>
      </div>
    `}getWalletController(){if(!this.applicationContext.connectWalletController)throw new Error("");return this.applicationContext.connectWalletController}};H.tagName="inch-swap-form";H.styles=Ti;H.lastFusionRenderIsEmptyState=!0;d([C({context:W})],H.prototype,"applicationContext",2);d([C({context:K,subscribe:!0})],H.prototype,"swapContext",2);d([C({context:re})],H.prototype,"config",2);H=d([y(H.tagName)],H);var ks=m`

    :host {
        --font-size: 16px;
    }
    
    .confirm-swap-view {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .token-view-container {
        background-color: var(--color-background-bg-secondary);
        border-radius: 16px;
        padding: 16px;
    }

    .token-view {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .token-view-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .token-view-top {
        color: var(--color-content-content-secondary);
        font-size: var(--font-size);
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
    }
    
    .primary-text {
        color: var(--color-content-content-primary);
        font-size: 24px;
        font-style: normal;
        font-weight: 600;
        line-height: 32px;
    }
    
    .symbol-view {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .separator {
        position: relative;
        color: var(--color-content-content-primary);
    }
    
    .separator-arrow-container {
        border-radius: 50%;
        background-color: var(--color-background-bg-primary);
        width: 32px;
        height: 32px;
        margin-left: auto;
        margin-right: auto;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
    }
    
    .separator-arrow-container-loader:before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        border: 1px solid transparent;
        border-radius: 50%;
        border-bottom-color: var(--primary);
        border-top-color: var(--primary);
        animation: spin 2s linear infinite;
    }
    
    .detail-info {
        padding: 8px 0;
    }
    
    .detail-info-row {
        padding: 8px 16px;
        display: flex;
        justify-content: space-between;
    }
    
    .detail-info-row-title {
        color: var(--color-content-content-secondary);
        font-size: var(--font-size);
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
    }
    
    .detail-info-raw-value {
        color: var(--color-content-content-primary);
        text-align: right;
        font-size: var(--font-size);
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        transition: color .2s;
        display: flex;
        gap: 8px;
        align-items: center;
    }
    
    .detail-info-raw-settings-value {
        color: var(--primary);
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
    
    .separator-view {
        position: absolute;
        background-color: var(--color-background-bg-primary);
        height: 2px;
        width: 100%;
        border-radius: 2px;
        top: 50%;
        z-index: 1;
    }

    ${O(m`
        :host {
            --font-size: 13px
        }

        .primary-text {
            font-size: 20px;
        }

        .detail-info-row {
            padding: 4px 8px;
        }

        .token-view {
            gap: 4px;
        }

        .separator-arrow-container {
            width: 28px;
            height: 28px;
        }

        .token-view-container {
            padding: 8px 16px;
        }
    `)}
`,G=class extends ${constructor(){super(...arguments),this.state=null,this.swapInProgress=!1,this.fiatAmountMap=new Map,this.mobileMedia=Z(this)}get needWrap(){return je(this.swapSnapshot.sourceToken.address)}render(){const t=this.mobileMedia.matches?"xl":"xxl";return a`
      <div class="confirm-swap-view">
        <inch-card-header backButton headerTextPosition="center" headerText="Confirm swap" headerTextPosition="left">
        </inch-card-header>
        
        ${this.getTokenViewContainer()}

        ${this.getDetailInfo()}

        <inch-button loader="${Q(this.swapInProgress?"":void 0)}" @click="${()=>this.onSwap()}" fullSize size="${t}" type="${this.swapInProgress?"secondary":"primary"}">
          ${g(this.swapInProgress,()=>a`<span>Confirm swap in wallet</span>`,()=>a`<span>Swap</span>`)}
        </inch-button>
      </div>
    `}async onSwap(){var t;if(!this.swapInProgress){try{this.swapInProgress=!0;const e=await((t=this.swapContext)==null?void 0:t.swap(this.swapSnapshot));E(this,"backCard",null),e&&await this.applicationContext.notificationsController.show("Swap status",a`<inch-notification-fusion-swap-view orderHash="${e}"></inch-notification-fusion-swap-view>`,{pinned:!0})}catch(e){const n=Ss(e);await this.applicationContext.notificationsController.error(a`${v(n)}`),console.error(e)}this.swapInProgress=!1}}getTokenViewContainer(){return a`
      <div class="token-view-container">
        ${this.getTokenView(this.swapSnapshot.sourceToken,this.swapSnapshot.sourceTokenAmount,"source")}
        ${this.getSeparatorView(this.needWrap?"wrap":"swap")}
        ${this.getTokenWrapView()}
        ${this.getTokenView(this.swapSnapshot.destinationToken,this.swapSnapshot.destinationTokenAmount,"destination")}
      </div>
    `}getDetailInfo(){return a`
      <div class="detail-info">
        ${this.getDetailInfoRow("Price",a`${Qt(this.getRateView())}`)}
        ${this.getDetailInfoRow("Slippage tolerance",this.getSlippageView())}
        ${this.getDetailInfoRow("Auction time",this.getAuctionTimeView())}
        ${this.getDetailInfoRow("Minimum receive",this.getMinReceive())}
        ${this.getDetailInfoRow("Network Fee",a`
          <div class="detail-info-raw-value detail-info-raw-settings-value">
            <inch-icon icon="fusion16"></inch-icon>
            <span>Free</span>
          </div>
        `)}
      </div>
    `}async getRateView(){const{chainId:t,rate:e,revertedRate:n,sourceToken:i,destinationToken:s}=this.swapSnapshot.rate,o=await this.applicationContext.tokenController.getPriorityToken(t,[i.address,s.address]),r=Lt(o,i)?s:i,c=Lt(o,i)?n:e,h=vt(z(c,r.decimals),2);return a`
      <div class="detail-info-raw-value">
        <span class="rate-view">1 ${He(r)} = ${h} ${o.symbol}</span>
      </div>
    `}getSlippageView(){const t=this.swapSnapshot.slippage;return a`
      <div class="detail-info-raw-value detail-info-raw-settings-value">
        ${t.value===null?"":a`<span>${t.value}% · </span>`}
        <span>
          ${g(t.type==="auto",()=>"Auto")}
          ${g(t.type==="custom",()=>"Custom")}
          ${g(t.type==="preset",()=>"Manual")}
        </span>
      </div>
      `}getAuctionTimeView(){const t=this.swapSnapshot.auctionTime;return a`
      <div class="detail-info-raw-value detail-info-raw-settings-value">
        ${t.value===null?"":a`<span>${We(t.value)} · </span>`}
        <span>
          ${g(t.type==="auto",()=>"Auto")}
          ${g(t.type==="custom",()=>"Custom")}
          ${g(t.type==="preset",()=>"Manual")}
      </span>
      </div>
    `}getMinReceive(){const t=z(this.swapSnapshot.minReceive,this.swapSnapshot.destinationToken.decimals);return a`
      <div class="detail-info-raw-value">
        ${vt(t,6)} ${this.swapSnapshot.destinationToken.symbol}
      </div>
    `}getDetailInfoRow(t,e){return a`
      <div class="detail-info-row">
        <span class="detail-info-row-title">${t}</span>
        <span>${e}</span>
      </div>
    `}getTokenView(t,e,n){const i=z(e,t.decimals);return a`
      <div class="token-view">
        <div class="token-view-row token-view-top">
          <span>
            ${Ze(n,[["source",()=>a`You pay`],["wrap",()=>a`You wrap`],["destination",()=>a`You receive`]])}
          </span>
          
          <span>${T(this.getFiatAmountStream(t,e))}</span>
        </div>
        <div class="token-view-row">
          <div class="symbol-view">
            <inch-token-icon
              chainId="${this.swapSnapshot.chainId}"
              symbol="${t.symbol}"
              address="${t.address}"
            ></inch-token-icon>
            <span class="primary-text">${t.symbol}</span>
          </div>
          <span class="primary-text">${vt(i,6)}</span>
        </div>
      </div>
    `}getTokenWrapView(){return this.needWrap?a`
        ${this.getTokenView(xn(this.swapSnapshot.chainId),this.swapSnapshot.sourceTokenAmount,"wrap")}
        ${this.getSeparatorView("swap")}
      `:a``}getSeparatorView(t){return a`
      <div class="separator">
        <div class="separator-view"></div>
        <div class="separator-arrow-container ${this.state===t&&this.needWrap?"separator-arrow-container-loader":""}">
          <inch-icon icon="arrowDown24"></inch-icon>
        </div>
      </div>
    `}getFiatAmountStream(t,e){if(this.fiatAmountMap.has(t.address))return this.fiatAmountMap.get(t.address);const n=ce(this.swapSnapshot.chainId).pipe(L(async()=>{const i=await this.applicationContext.tokenController.getTokenUSDPrice(this.swapSnapshot.chainId,t.address),s=z(e,t.decimals),o=Number(s)*Number(i);return`~$${vt(o.toString(),2)}`}),Zt({bufferSize:1,refCount:!0}));return this.fiatAmountMap.set(t.address,n),n}};G.tagName="inch-confirm-swap";G.styles=ks;d([x({type:Object})],G.prototype,"swapSnapshot",2);d([C({context:W})],G.prototype,"applicationContext",2);d([C({context:K,subscribe:!0}),x({type:Object,attribute:!1})],G.prototype,"swapContext",2);d([P()],G.prototype,"state",2);d([P()],G.prototype,"swapInProgress",2);G=d([y(G.tagName)],G);function Ss(t){return t instanceof En?"widgets.swap-form.swap-button.wallet-rejected":"widgets.swap-form.swap-button.swap-error-message"}var Es=Object.defineProperty,Ts=Object.getOwnPropertyDescriptor,be=(t,e,n,i)=>{for(var s=i>1?void 0:i?Ts(e,n):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(i?r(e,n,s):r(s))||s);return i&&s&&Es(e,n,s),s};let Tt=class extends ${constructor(){super(...arguments),this.mobileMedia=Z(this)}async connectedCallback(){await this.preloadForm(At().matches),super.connectedCallback(),this.swapContext=await this.applicationContext.makeSwapContext(),this.requestUpdate(),this.preloadForm(!this.mobileMedia.matches).catch(console.error)}disconnectedCallback(){super.disconnectedCallback(),this.swapContext.destroy()}render(){if(this.swapContext)return this.mobileMedia.matches?a`<inch-swap-form-mobile></inch-swap-form-mobile>`:a`<inch-swap-form-desktop></inch-swap-form-desktop>`}async preloadForm(t){t?await X(()=>import("./swap-form-mobile.element-C4GwX0s7.js"),__vite__mapDeps([22,1,9,2,3,4,5,6,7,8,10,11,12,13,14,16,17,15,18,19,20,23,21])):await X(()=>import("./swap-form-desktop.element-CGv9ICH-.js"),__vite__mapDeps([24,1,9,2,3,4,5,6,7,8,10,11,12,13,14,16,17,15,18,19,20,23,21]))}};Tt.tagName="inch-swap-form-container";be([Fn({context:K})],Tt.prototype,"swapContext",2);be([C({context:W})],Tt.prototype,"applicationContext",2);Tt=be([y(Tt.tagName)],Tt);var Is=Object.defineProperty,As=Object.getOwnPropertyDescriptor,on=(t,e,n,i)=>{for(var s=i>1?void 0:i?As(e,n):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(i?r(e,n,s):r(s))||s);return i&&s&&Is(e,n,s),s};let Dt=class extends ${firstUpdated(){}async init(){const t=this.applicationContext.notificationsController;let e=0;await t.show("Swap status",a`<inch-notification-fusion-swap-view orderHash="0xd88ff7eb802ef939e3652006777f6fbe70955d094c3ff97799472070f33796fb"></inch-notification-fusion-swap-view>`);const n=async()=>{e>=1||(await t.warning("test notification "+e),e++,await ee(2e3),n())};await n()}render(){return a`
      <inch-header></inch-header>
      <div id="outlet" class="content">
        <inch-swap-form-container></inch-swap-form-container>
      </div>
      <inch-footer></inch-footer>
    `}};Dt.styles=[Wn,On];on([C({context:W})],Dt.prototype,"applicationContext",2);Dt=on([y("app-root")],Dt);const Gs=Object.freeze(Object.defineProperty({__proto__:null,get AppElement(){return Dt}},Symbol.toStringTag,{value:"Module"}));export{Ke as S,$i as a,Gs as b,Fn as e,Ys as i,ki as s};
//# sourceMappingURL=app.element-D3SJvP7V.js.map
