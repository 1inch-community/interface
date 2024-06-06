import{i as d,a as A,c as w,t as x,b as I,n as f,s as z,d as y,e as P,f as q,x as o,h as V,R as X,B as R,S as O,j as G,k as U,l as F,T as u,o as C,p as M,q as H,u as L,v as $,w as J,y as K,z as E,A as Q,C as S,D as B,E as D,F as N,G as k,H as Y,I as W,J as Z,K as tt,L as et,M as st,N as it}from"./index-CFblfmuI.js";var nt=Object.defineProperty,rt=Object.getOwnPropertyDescriptor,i=(t,e,s,r)=>{for(var n=r>1?void 0:r?rt(e,s):e,a=t.length-1,h;a>=0;a--)(h=t[a])&&(n=(r?h(e,s,n):h(n))||n);return r&&n&&nt(e,s,n),n},ot=d`:host{display:flex;flex-direction:column;height:100%;width:100%}`,T=V(Symbol("select token context")),at=class{constructor(){this.chainId$=new X(1),this.connectedWalletAddress$=new R(null),this.changeFavoriteTokenState$=new O,this.favoriteTokens$=this.chainId$.pipe(G(t=>u.liveQuery(()=>u.getAllFavoriteTokenAddresses(t)))),this.tokenAddressList$=U([this.chainId$,this.connectedWalletAddress$]).pipe(F(([t,e])=>u.getSortedForViewTokenAddresses(t,e??void 0)))}setChainId(t){this.chainId$.next(t)}setConnectedWalletAddress(t){this.connectedWalletAddress$.next(t??null)}async setFavoriteTokenState(t,e,s){await u.setFavoriteState(t,e,s),this.changeFavoriteTokenState$.next([t,e])}},ct=d`.search-token-input-container{display:flex;background-color:var(--color-background-bg-secondary);height:48px;border-radius:12px;color:var(--color-content-content-tertiary);align-items:center;padding-left:12px;padding-right:12px;box-sizing:border-box;gap:8px;margin-top:5px;transition:box-shadow .2s}.search-token-input{border:none;background-color:transparent;height:100%;width:100%;outline:0;color:var(--color-content-content-primary);font-size:16px;font-style:normal;font-weight:400;line-height:24px}.search-token-input::placeholder{color:var(--color-content-content-secondary)}@media (hover:hover){.search-token-input-container:hover{box-shadow:0 0 0 1px var(--primary)}}.search-token-input-container__focused{box-shadow:0 0 0 1px var(--primary)}`,m=class extends y{constructor(){super(...arguments),this.isFocused=!1}render(){const t={"search-token-input-container":!0,"search-token-input-container__focused":this.isFocused};return o`<div class="${C(t)}"><inch-icon icon="search24"></inch-icon><input id="search" autofocus autocomplete="off" @focus="${()=>this.isFocused=!0}" @blur="${()=>this.isFocused=!1}" placeholder="Search token by name or address" class="search-token-input"></div>`}async firstUpdated(){this.renderRoot.querySelector("#search")&&this.sceneContext&&this.sceneContext.animationInProgress&&await this.sceneContext.animationInEnd}};m.tagName="inch-search-token-input";m.styles=ct;i([A()],m.prototype,"isFocused",2);i([w({context:M})],m.prototype,"sceneContext",2);m=i([x(m.tagName)],m);var lt=d`:host{height:72px;width:100%;outline:0;user-select:none;-webkit-tap-highlight-color:transparent}.item-container{padding:12px 16px;display:flex;gap:8px;align-items:center;cursor:pointer;border-radius:16px;transition:background-color .2s}.name-and-balance{display:flex;flex-direction:column;gap:4px;max-width:50%}.name-and-balance .name{color:var(--color-content-content-primary);font-size:16px;font-style:normal;font-weight:500;line-height:24px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.name-and-balance .balance{color:var(--color-content-content-secondary);font-size:14px;font-style:normal;font-weight:400;line-height:20px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.usd-balance{color:var(--color-content-content-primary);text-align:right;font-size:16px;font-style:normal;font-weight:500;line-height:24px;white-space:nowrap}.usd-balance-and-favorite-start{display:flex;align-items:center;margin-left:auto}.is-favorite-start{width:32px;height:32px;display:flex;align-items:center;justify-content:center}@media (hover:hover){.item-container:hover{background-color:var(--color-background-bg-secondary)}.item-container:not(.is-favorite-token) .usd-balance{transform:translateX(24px);transition:transform .2s}.item-container:not(.is-favorite-token) .is-favorite-start{transform:scale(0);transition:transform .2s}.item-container:hover .is-favorite-start{transform:scale(1)}.item-container:hover .usd-balance{transform:translateX(0)}}${I(d`.item-container{padding:8px 8px}`)}.item-container:active{background-color:var(--color-background-bg-secondary)}`,dt=d`:host{height:72px;width:100%}.item-container{padding:12px 16px;display:flex;gap:8px;align-items:center;cursor:pointer;border-radius:16px;transition:background-color .2s}.name-and-balance{display:flex;flex-direction:column;gap:4px;width:100%}.stub-loader{will-change:filter;animation:stub-loader-animation 3s ease-in-out infinite}.stub-token-icon{min-width:40px;min-height:40px;border-radius:50%;background-color:var(--color-background-bg-secondary)}.name-stub{background-color:var(--color-background-bg-secondary);height:24px;width:40%;border-radius:8px}.balance-stub{background-color:var(--color-background-bg-secondary);height:20px;width:30%;border-radius:8px}@keyframes stub-loader-animation{0%,100%{filter:opacity(1)}50%{filter:opacity(.5)}}${I(d`.item-container{padding:8px 8px}`)}`,g=class extends y{constructor(){super(...arguments),this.notShowLoader=!1}render(){const t={"item-container":!0,"stub-loader":!this.notShowLoader};return o`<div class="${C(t)}"><div class="stub-token-icon"></div><div class="name-and-balance"><span class="name-stub"></span> <span class="balance-stub"></span></div></div>`}};g.tagName="inch-token-list-stub-item";g.styles=dt;i([f({type:Boolean,attribute:!0})],g.prototype,"notShowLoader",2);g=i([x(g.tagName)],g);function _(t,e,s){tt(t,"selectToken",e,s)}var l=class extends y{constructor(){super(...arguments),this.isDestroy=!1,this.preRenderTemplate=null,this.isFavorite=!1,this.task=new H(this,async([t,e,s,r])=>{if(r){const p=this.task.value;if(p)return p}if(!t||!e)return[];if(this.isDestroy)throw new Error("");const n=await u.getToken(t,e);let a=null,h=null;if(s&&n){a=await u.getTokenBalance(t,e,s);const p=await u.getTokenUSDPrice(t,e),j=L(BigInt((a==null?void 0:a.amount)??0),n.decimals);h=Number(j)*Number(p)}return[n,a,h]},()=>[this.chainId,this.tokenAddress,this.walletAddress,!1])}disconnectedCallback(){super.disconnectedCallback(),this.isDestroy=!0}firstUpdated(){$(this,J(K(12e3),this.getTokenUpdateEmitter()).pipe(F(()=>this.task.run([this.chainId,this.tokenAddress,this.walletAddress,!1]))),{requestUpdate:!1})}render(){return o`${this.task.render({complete:([t,e,s])=>this.getTokenView(t,e,s),pending:()=>this.preRenderTemplate?this.preRenderTemplate:this.getStub(),error:()=>this.preRenderTemplate?this.preRenderTemplate:this.getStub()})}`}getTokenView(t,e,s){if(!t)return this.getStub();this.isFavorite=t.isFavorite??!1;let r="0";e&&(r=E(L(BigInt(e.amount),t.decimals),6));let n="$0";s&&(n="$"+E(s.toString(),2));let a={border:"var(--color-border-border-secondary)",body:"none"};this.isFavorite&&(a={border:"var(--color-core-orange-warning)",body:"var(--color-core-orange-warning)"});const h={"item-container":!0,"is-favorite-token":t.isFavorite};return this.preRenderTemplate=o`<div class="${C(h)}" @click="${p=>_(this,t,p)}"><inch-token-icon symbol="${t.symbol}" address="${t.address}" chainId="${t.chainId}" size="40"></inch-token-icon><div class="name-and-balance"><span class="name">${t.name}</span> <span class="balance">${r} ${t.symbol}</span></div><div class="usd-balance-and-favorite-start"><span class="usd-balance">${n}</span><inch-icon class="is-favorite-start" @click="${p=>this.onMarkFavoriteToken(p,t)}" icon="startDefault16" .props="${a}"></inch-icon></div></div>`,this.preRenderTemplate}async onMarkFavoriteToken(t,e){var s;t.preventDefault(),t.stopPropagation(),this.isFavorite=!e.isFavorite,await this.task.run([this.chainId,this.tokenAddress,this.walletAddress,!0]),await((s=this.context)==null?void 0:s.setFavoriteTokenState(e.chainId,e.address,!e.isFavorite))}getTokenUpdateEmitter(){if(!this.context)throw new Error("");return this.context.changeFavoriteTokenState$.pipe(Q(([t,e])=>{var r,n;const s=((n=(r=this.task)==null?void 0:r.value)==null?void 0:n[0])??null;return s&&s.chainId===t&&et(s.address,e)}))}getStub(){return o`<inch-token-list-stub-item></inch-token-list-stub-item>`}};l.tagName="inch-token-list-item";l.styles=lt;i([f({type:String,attribute:!0})],l.prototype,"tokenAddress",2);i([f({type:String,attribute:!0})],l.prototype,"walletAddress",2);i([f({type:Number,attribute:!0})],l.prototype,"chainId",2);i([w({context:T})],l.prototype,"context",2);l=i([x(l.tagName)],l);var ht=d`:host{height:50vh;width:100%}${I(d`:host{height:100%;width:100%}`)}`,c=class extends y{constructor(){super(...arguments),this.chainId=null,this.walletAddress=null,this.addressList$=S(()=>this.getTokenAddressList()).pipe(B({refCount:!0,bufferSize:1}))}render(){return o`<inch-scroll-view-virtualizer-consumer .header="${this.header}" .items="${D(this.addressList$,this.getStubAddresses())}" .keyFunction="${t=>[this.chainId,this.walletAddress,t].join(":")}" .renderItem="${t=>o`<inch-token-list-item tokenAddress="${t}" walletAddress="${N(this.walletAddress??void 0)}" chainId="${N(this.chainId??void 0)}"></inch-token-list-item>`}"></inch-scroll-view-virtualizer-consumer>`}async firstUpdated(){$(this,[this.getConnectedWalletAddress().pipe(k(t=>this.walletAddress=t)),this.getChainId().pipe(k(t=>this.chainId=t)),this.addressList$],{requestUpdate:!1}),$(this,[this.getFavoriteTokens()])}getTokenAddressList(){if(!this.context)throw new Error("");return this.context.tokenAddressList$}getChainId(){if(!this.context)throw new Error("");return this.context.chainId$}getFavoriteTokens(){if(!this.context)throw new Error("");return this.context.favoriteTokens$}getConnectedWalletAddress(){if(!this.context)throw new Error("");return this.context.connectedWalletAddress$}getStubAddresses(){return Array.from(Array(30)).map((t,e)=>`0x${e.toString(16)}`)}};c.tagName="inch-token-list";c.styles=[ht,z];i([f({type:Object})],c.prototype,"header",2);i([w({context:T})],c.prototype,"context",2);i([w({context:M})],c.prototype,"sceneContext",2);i([A()],c.prototype,"chainId",2);i([A()],c.prototype,"walletAddress",2);c=i([x(c.tagName)],c);var pt=d`:host{display:flex;width:100%;height:60px}:host(.empty){height:16px;padding-bottom:0;margin-bottom:0}:host(.transition-host){transition:height .2s,padding-bottom .2s,margin-bottom .2s}:host(.remove-favorite-token-show) .remove-favorite-token{transform:scale(1) translate(0,0)}.favorite-container-scroll{overflow-y:hidden;overflow-x:auto;position:relative;width:100%;padding-top:16px;padding-bottom:8px;margin-bottom:8px;height:36px}.favorite-container{display:flex;gap:12px;height:36px;position:absolute}::-webkit-scrollbar{height:2px}.favorite-container-scroll::-webkit-scrollbar-thumb{transition:background-color .2s;background:var(--color-background-bg-primary)}.favorite-token-item-container{position:relative}.remove-favorite-token{position:absolute;top:-8px;right:-8px;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;background-color:var(--color-background-bg-secondary);z-index:9;transition:transform .2s;transform:scale(0) translate(-16px,16px);cursor:pointer;color:var(--color-content-content-primary)}@media (hover:hover){.favorite-container-scroll:hover::-webkit-scrollbar-thumb{background:var(--primary)}.favorite-token-item-container:hover .remove-favorite-token{transform:scale(1) translate(0,0)}.remove-favorite-token:hover{background-color:var(--secondary-hover)}.edit-favorite-token-list{display:none}}`,b=class extends y{constructor(){super(...arguments),this.editAllMode$=new R(!1),this.favoriteTokensView$=U([S(()=>this.getFavoriteTokens()),S(()=>this.getChainId())]).pipe(Y(0),F(([t,e])=>u.getTokenList(e,t)),W(t=>t.sort((e,s)=>s.priority-e.priority)),Z([]),k(t=>{t.length&&this.classList.contains("empty")&&this.classList.remove("empty"),!t.length&&!this.classList.contains("empty")&&this.classList.add("empty")}),k(()=>{this.classList.contains("transition-host")||setTimeout(()=>{this.classList.add("transition-host")},300)}),W(t=>(t.length&&t.push(null),o`<div class="favorite-container-scroll"><div class="favorite-container">${o`${st(t,e=>e!==null?"t"+e.address:"edit",ut,e=>it(e,s=>o`<div class="favorite-token-item-container"><div class="remove-favorite-token" @click="${r=>this.onRemoveFavoriteToken(s,r)}"><inch-icon icon="cross8"></inch-icon></div><inch-button size="m" type="secondary" class="favorite-token-item" @click="${r=>_(this,s,r)}"><inch-token-icon symbol="${s.symbol}" address="${s.address}" chainId="${s.chainId}"></inch-token-icon><span>${s.symbol}</span></inch-button></div>`,()=>o`<inch-button size="l" type="secondary" class="favorite-token-item edit-favorite-token-list" @click="${()=>this.editAllMode$.next(!this.editAllMode$.value)}"><inch-icon icon="edit24"></inch-icon></inch-button>`))}`}</div></div>`)),B({bufferSize:1,refCount:!0}))}firstUpdated(){$(this,this.editAllMode$.pipe(k(t=>{t?this.classList.add("remove-favorite-token-show"):this.classList.remove("remove-favorite-token-show")})),{requestUpdate:!1})}render(){return o`${D(this.favoriteTokensView$)}`}getFavoriteTokens(){if(!this.context)throw new Error("");return this.context.favoriteTokens$}getChainId(){if(!this.context)throw new Error("");return this.context.chainId$}async onRemoveFavoriteToken(t,e){var s;e.stopPropagation(),e.preventDefault(),await((s=this.context)==null?void 0:s.setFavoriteTokenState(t.chainId,t.address,!1))}};b.tagName="inch-favorite-tokens";b.styles=[pt,z];i([w({context:T})],b.prototype,"context",2);b=i([x(b.tagName)],b);var ut={deleteElement:async t=>{t.style.overflow="hidden",await t.animate([{flexBasis:`${t.offsetWidth}px`,transform:"scale(1) translateX(0)"},{flexBasis:"0",transform:"scale(0) translateX(-20%)"}],{duration:t.id==="edit"?50:150}).finished,t.style.overflow=""},addedElement:async t=>{t.style.overflow="hidden",t.style.transform="scale(0) translateX(-20%)",t.style.position="absolute",t.style.top="-9999",t.style.left="-9999",document.body.appendChild(t),await new Promise(s=>requestAnimationFrame(s));const e=t.offsetWidth;return t.remove(),t.style.position="",t.style.top="",t.style.left="",async s=>{await s.animate([{flexBasis:"0",transform:"scale(0) translateX(-20%)"},{flexBasis:`${e}px`,transform:"scale(1) translateX(0)"}],{duration:150}).finished,s.style.transform="",s.style.overflow=""}}},v=class extends y{constructor(){super(...arguments),this.context=new P(this,{context:T})}connectedCallback(){super.connectedCallback(),q(this)}render(){return this.initContext(),o`<inch-token-list .header="${()=>o`<inch-card-header backButton headerText="Select token"></inch-card-header><inch-search-token-input></inch-search-token-input><inch-favorite-tokens></inch-favorite-tokens>`}"></inch-token-list>`}updated(t){let e=!1;const s=this.context.value;t.has("chainId")&&this.chainId&&(s.setChainId(this.chainId),e=!0),t.has("connectedWalletAddress")&&(s.setConnectedWalletAddress(this.connectedWalletAddress),e=!0),e&&this.requestUpdate()}initContext(){if(this.context.value)return;const{chainId:t,connectedWalletAddress:e}=this;if(!t)throw new Error("");const s=new at;s.setChainId(t),s.setConnectedWalletAddress(e),this.context.setValue(s)}};v.tagName="inch-select-token";v.styles=ot;i([f({type:Number})],v.prototype,"chainId",2);i([f({type:String})],v.prototype,"connectedWalletAddress",2);v=i([x(v.tagName)],v);export{v as SelectTokenElement};
//# sourceMappingURL=index.esm-DWMguKDe.js.map
