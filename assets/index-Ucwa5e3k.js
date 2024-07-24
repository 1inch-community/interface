import{i as m,x as a,s as x,t as b,A as f}from"./index-sLWOp1cP.js";import{m as w,d as y,e as $}from"./index.esm-CGEC4wRC.js";import{S as C,s as z}from"./app.element-B77M36Br.js";import{e as S,c as k}from"./index.esm-BXWn27hg.js";import{B as c,M as d,L as h}from"./index.esm-DfotAdpM.js";import"./index.esm-CjXD2v0E.js";import"./index.esm-COc-PyqV.js";import"./combineLatest-Cx3jWXTV.js";import"./asap-BqWvnQ_m.js";import"./index.esm-OfUlTTgs.js";import"./index.esm-MFwAEsBN.js";import"./index.esm-7KRQhKpb.js";import"./import-wrapper-prod-mRNndFxq.js";import"./index.esm-BBcS9skV.js";import"./tap-CWNNm5Pt.js";import"./firstValueFrom-Ch7AjPMY.js";import"./takeUntil-CSuw8jL4.js";import"./index.esm-B4YiEjKM.js";import"./index.esm-5Aerb1sL.js";const W=m`:host{display:flex;flex-direction:column;position:relative}.settings-view-item{color:var(--color-content-content-primary);font-size:16px;font-style:normal;font-weight:500;line-height:24px;height:64px;width:100%;border-radius:16px;display:flex;padding:20px 16px;box-sizing:border-box;gap:8px;transition:background-color .2s}.main-settings-container{display:flex;flex-direction:column;position:relative;gap:8px;height:fit-content;width:100%;min-width:300px}.segmented-control-container{padding-top:16px;color:var(--color-content-content-primary);font-size:16px;font-style:normal;font-weight:500;line-height:24px;display:flex;flex-direction:column;gap:8px}.segmented-control-label{padding-left:16px}.theme-container{display:grid;grid-template-columns:1fr 1fr 1fr;color:var(--color-content-content-primary);font-size:16px;font-style:normal;font-weight:500;line-height:24px;gap:16px}.theme-item{border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:16px;background-color:var(--color-background-bg-secondary);box-sizing:border-box;transition:box-shadow .2s}.theme-item-select{box-shadow:inset 0 0 0 1px var(--primary)}@media (hover:hover){.settings-view-item:hover{background-color:var(--color-background-bg-secondary)}.theme-item:not(.theme-item-select):hover{box-shadow:inset 0 0 0 1px var(--primary-50)}}${w(m`.main-settings-container{width:calc(100vw - 16px)}`)}`;function M(i,e){return a`<div class="main-settings-container"><inch-card-header backButton headerText="Settings" @backCard="${()=>y(e,"closeSettings",null)}"></inch-card-header><div class="settings-view-container">${p(i,"image24","Personalization","personalization")} ${p(i,"globe24","Localization","localization")}</div></div>`}const g=[{value:c.community,label:"community"},{value:c.violet,label:"violet"},{value:c.random,label:"random"},{value:c.rainbow,label:"rainbow"}],P=[{value:d.systemSync,label:"Automatic",icon:"command24"},{value:d.dark,label:"Dark",icon:"moon24"},{value:d.light,label:"light",icon:"sun24"}];function A(i,e,n){return a`<div class="main-settings-container"><inch-card-header backButton headerText="Personalization" @backCard="${()=>i.back()}"></inch-card-header><div class="settings-view-container"><div class="theme-container">${P.map(t=>{const o={"theme-item":!0,"theme-item-select":t.value===e.themesController.getActiveMainColor()};return a`<div @click="${async s=>{await e.themesController.onChangeMainColor(t.value,s),n.requestUpdate()}}" class="${S(o)}"><inch-icon icon="${t.icon}"></inch-icon><span>${t.label}</span></div>`})}</div><div class="segmented-control-container"><span class="segmented-control-label">Primary color</span><inch-segmented-control .items="${g}" .select="${g.find(t=>t.value===e.themesController.getActiveBrandColor())}" @change="${t=>e.themesController.onChangeBrandColor(t.detail.value)}"></inch-segmented-control></div></div></div>`}function B(i,e){return a`<div class="main-settings-container"><inch-card-header backButton headerText="Language" @backCard="${()=>i.back()}"></inch-card-header><div class="settings-view-container">${v("English",h.en,e)} ${v("العربية",h.ar,e)}</div></div>`}function p(i,e,n,t){return a`<div class="settings-view-item" @click="${()=>i.nextTo(t)}"><inch-icon icon="${e}"></inch-icon><span>${n}</span></div>`}function v(i,e,n){return a`<div class="settings-view-item" @click="${()=>n.i18nController.changeLocale(e)}"><span>${i}</span></div>`}var L=Object.defineProperty,H=Object.getOwnPropertyDescriptor,u=(i,e,n,t)=>{for(var o=t>1?void 0:t?H(e,n):e,s=i.length-1,l;s>=0;s--)(l=i[s])&&(o=(t?l(e,n,o):l(o))||o);return t&&o&&L(e,n,o),o};let r=class extends x{constructor(){super(...arguments),this.mobileMedia=$(this),this.scene=new C("main",{main:{minWidth:this.getWidth(),maxWidth:this.getWidth(),maxHeight:180,minHeight:180},personalization:{minWidth:this.getWidth(),maxWidth:this.getWidth(),maxHeight:240,minHeight:240},localization:{minWidth:this.getWidth(),maxWidth:this.getWidth(),maxHeight:180,minHeight:180}},z())}render(){return a`<div class="settings-scene-container">${this.scene.render({main:()=>M(this.scene,this),personalization:()=>A(this.scene,this.applicationContext,this),localization:()=>B(this.scene,this.applicationContext)})}</div>`}getWidth(){return this.mobileMedia.matches?window.innerWidth-16:556}};r.tagName="inch-settings";r.styles=W;u([k({context:f})],r.prototype,"applicationContext",2);r=u([b(r.tagName)],r);export{r as Settings};
//# sourceMappingURL=index-Ucwa5e3k.js.map
