import{i as s,b as p,_ as e,n,t as c,d as h,P as l,x as r,F as m,s as g,Q as u,o as b,N as f,K as v}from"./index-CiPMkqQ5.js";var y=s`:host{width:100%;height:100%}.card{height:100%}.scroll-container{position:relative;height:100%;overflow-y:auto}.scroll-overlay{position:absolute;top:0;left:0;height:100%;width:100%}`,C=s`:host{width:100%;height:100%}.container{display:flex;align-items:center;gap:8px;height:40px;padding:0 8px;border-radius:12px;background-color:transparent;transition:background-color .2s;color:var(--color-content-content-primary);font-size:14px}.active .list-icon{transform:scale(1);color:var(--primary)}.list-icon{margin-left:auto;transition:transform .2s;transform:scale(0)}@media (hover:hover){.container:hover{background-color:var(--color-background-bg-secondary)}.container:hover .list-icon{transform:scale(1)}}.container:active{background-color:var(--color-background-bg-secondary)}${p(s`.container{height:50px;font-size:16px}`)}`,t=class extends h{constructor(){super(...arguments),this.mobileMedia=l(this)}render(){if(!this.info)return;const o=u(this.info.chainId),d={container:!0,active:Number(this.info.chainId)===this.activeChainId},a=this.mobileMedia.matches?26:24;return r`<div class="${b(d)}" @click="${()=>this.setChainId()}">${f(o,()=>r`<inch-icon icon="l2Chain24"></inch-icon>`)}<inch-icon width="${a}px" height="${a}px" icon="${this.info.iconName}"></inch-icon><span>${this.info.name}</span><inch-icon class="list-icon" icon="link16"></inch-icon></div>`}async setChainId(){var o;if(!this.info)throw new Error("");await((o=this.controller)==null?void 0:o.changeChain(this.info.chainId)),v(this,"closeCard",null)}};t.tagName="inch-chain-selector-list-item";t.styles=C;e([n({type:Object})],t.prototype,"info",2);e([n({type:Number})],t.prototype,"activeChainId",2);e([n({type:Object,attribute:!1})],t.prototype,"controller",2);t=e([c(t.tagName)],t);var i=class extends h{constructor(){super(...arguments),this.mobileMedia=l(this)}render(){if(this.infoList)return this.mobileMedia.matches?this.getMobileList():this.getDesktopList()}getList(){if(this.infoList)return this.infoList.map(o=>r`<inch-chain-selector-list-item .info="${o}" .controller="${this.controller}" activeChainId="${m(this.activeChainId)}"></inch-chain-selector-list-item>`)}getMobileList(){return r`<inch-card class="card" forMobileView><inch-card-header closeButton headerText="Select chain"></inch-card-header><inch-scroll-view-consumer>${this.getList()}</inch-scroll-view-consumer></inch-card>`}getDesktopList(){return r`<inch-card>${this.getList()}</inch-card>`}};i.tagName="inch-chain-selector-list";i.styles=[y,g];e([n({type:Array})],i.prototype,"infoList",2);e([n({type:Number})],i.prototype,"activeChainId",2);e([n({type:Object,attribute:!1})],i.prototype,"controller",2);i=e([c(i.tagName)],i);export{i as ChainSelectorListElement};
//# sourceMappingURL=chain-selector-list-OA5B7MQE-PnGta3_s.js.map
