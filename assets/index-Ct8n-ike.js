import{i as g,k as a,h as b,t as f,A as w}from"./index-BNjDdafE.js";import{m as y,d as $,e as z}from"./index.esm-DS7GCQR2.js";import{S as C,s as k}from"./app.element-DCTbXpsC.js";import{R as S,c as W}from"./index.esm-EHaIGh9g.js";import{B as d,M as h,L as r}from"./index.esm-DhwY4kHm.js";import"./index.esm-OIwjBXxl.js";import"./index.esm-COc-PyqV.js";import"./combineLatest-Bzt_9bb6.js";import"./defer-BRewiDsk.js";import"./asap-D-qxMtYG.js";import"./index.esm-Cc9myTra.js";import"./index.esm-BcUoR516.js";import"./index.esm-BkFEWyB1.js";import"./index.esm-CSn83is8.js";import"./import-wrapper-prod-hit9ecK7.js";import"./index.esm-DgGyhdi3.js";import"./tap-DGvjHJum.js";import"./firstValueFrom-RTAQ66ca.js";import"./takeUntil-B9okj2Im.js";import"./index.esm-C1Espl6E.js";import"./index.esm-BW3s9G0O.js";import"./index.esm-5Aerb1sL.js";const M=g`
    
    :host {
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .settings-view-item {
        color: var(--color-content-content-primary);
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        height: 64px;
        width: 100%;
        border-radius: 16px;
        display: flex;
        padding: 20px 16px;
        box-sizing: border-box;
        gap: 8px;
        transition: background-color .2s;
    }
    
    .main-settings-container {
        display: flex;
        flex-direction: column;
        position: relative;
        
        gap: 8px;
        height: fit-content;
        width: 100%;
        min-width: 300px;
    }
    
    .segmented-control-container {
        padding-top: 16px;
        color: var(--color-content-content-primary);
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .segmented-control-label {
        padding-left: 16px;
    }
    
    .theme-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        color: var(--color-content-content-primary);
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        gap: 16px;
    }
    
    .theme-item {
        border-radius: 16px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        background-color: var(--color-background-bg-secondary);
        box-sizing: border-box;
        transition: box-shadow .2s;
    }
    
    .theme-item-select {
        box-shadow: inset 0 0 0 1px var(--primary);
    }
    
    @media (hover: hover) {
        .settings-view-item:hover {
            background-color: var(--color-background-bg-secondary);
        }
        
        .theme-item:not(.theme-item-select):hover {
            box-shadow: inset 0 0 0 1px var(--primary-50)
        }
    }

    ${y(g`
        .main-settings-container {
            width: calc(100vw - 16px);
        }
    `)}
`;function P(i,e){return a`
    <div class="main-settings-container">
      <inch-card-header
        backButton
        headerText="Settings"
        @backCard="${()=>$(e,"closeSettings",null)}"
      ></inch-card-header>
      <div class="settings-view-container">
        ${v(i,"image24","Personalization","personalization")}
        ${v(i,"globe24","Localization","localization")}
      </div>
    </div>
  `}const p=[{value:d.community,label:"community"},{value:d.violet,label:"violet"},{value:d.random,label:"random"},{value:d.rainbow,label:"rainbow"}],A=[{value:h.systemSync,label:"Automatic",icon:"command24"},{value:h.dark,label:"Dark",icon:"moon24"},{value:h.light,label:"light",icon:"sun24"}];function B(i,e,n){return a`
    <div class="main-settings-container">
      <inch-card-header
        backButton
        headerText="Personalization"
        @backCard="${()=>i.back()}"
      ></inch-card-header>
      <div class="settings-view-container">
        <div class="theme-container">
          ${A.map(t=>{const o={"theme-item":!0,"theme-item-select":t.value===e.themesController.getActiveMainColor()};return a`
            <div @click="${async c=>{await e.themesController.onChangeMainColor(t.value,c),n.requestUpdate()}}" class="${S(o)}">
              <inch-icon icon="${t.icon}"></inch-icon>
              <span>${t.label}</span>
            </div>
          `})}
        </div>
        <div class="segmented-control-container">
          <span class="segmented-control-label">Primary color</span>
          <inch-segmented-control
            .items="${p}"
            .select="${p.find(t=>t.value===e.themesController.getActiveBrandColor())}"
            @change="${t=>e.themesController.onChangeBrandColor(t.detail.value)}"
          ></inch-segmented-control>
        </div>
      </div>
    </div>
  `}function H(i,e){return a`
    <div class="main-settings-container">
      <inch-card-header
        backButton
        headerText="Language"
        @backCard="${()=>i.back()}"
      ></inch-card-header>
      <div class="settings-view-container">
        ${l("English",r.en,e)}
        ${l("العربية",r.ar,e)}
        ${l("Deutsch",r.de,e)}
        ${l("français",r.fr,e)}
        ${l("Español",r.es,e)}
      </div>
    </div>
  `}function v(i,e,n,t){return a`
    <div class="settings-view-item" @click="${()=>i.nextTo(t)}">
      <inch-icon icon="${e}"></inch-icon>
      <span>${n}</span>
    </div>
  `}function l(i,e,n){return a`
    <div class="settings-view-item" @click="${()=>n.i18nController.changeLocale(e)}">
      <span>${i}</span>
    </div>
  `}var L=Object.defineProperty,_=Object.getOwnPropertyDescriptor,x=(i,e,n,t)=>{for(var o=t>1?void 0:t?_(e,n):e,c=i.length-1,m;c>=0;c--)(m=i[c])&&(o=(t?m(e,n,o):m(o))||o);return t&&o&&L(e,n,o),o};const O=Object.keys(r).length,u=52+O*64;let s=class extends b{constructor(){super(...arguments),this.mobileMedia=z(this),this.scene=new C("main",{main:{minWidth:this.getWidth(),maxWidth:this.getWidth(),maxHeight:180,minHeight:180},personalization:{minWidth:this.getWidth(),maxWidth:this.getWidth(),maxHeight:240,minHeight:240},localization:{minWidth:this.getWidth(),maxWidth:this.getWidth(),maxHeight:u,minHeight:u}},k())}render(){return a`
      <div class="settings-scene-container">
        ${this.scene.render({main:()=>P(this.scene,this),personalization:()=>B(this.scene,this.applicationContext,this),localization:()=>H(this.scene,this.applicationContext)})}
      </div>
    `}getWidth(){return this.mobileMedia.matches?window.innerWidth-16:556}};s.tagName="inch-settings";s.styles=M;x([W({context:w})],s.prototype,"applicationContext",2);s=x([f(s.tagName)],s);export{s as Settings};
//# sourceMappingURL=index-Ct8n-ike.js.map
