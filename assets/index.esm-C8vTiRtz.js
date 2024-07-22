import{z as be,i as Me,r as C,x as y,j}from"./index-DyOQYfny.js";import{d as $e,m as N,s as we,a as Ce,f as _e,O as xe,j as J}from"./startWith-CUA0N737.js";import{B as Ee,c as Re}from"./combineLatest-Cy55o5u3.js";import{a as X}from"./asap-D0uGzbkj.js";const{I:ye}=be,Se=e=>e.strings===void 0,W=()=>document.createComment(""),At=(e,t,n)=>{var a;const s=e._$AA.parentNode,i=t===void 0?e._$AB:t._$AA;if(n===void 0){const r=s.insertBefore(W(),i),o=s.insertBefore(W(),i);n=new ye(r,o,e,e.options)}else{const r=n._$AB.nextSibling,o=n._$AM,l=o!==e;if(l){let c;(a=n._$AQ)==null||a.call(n,e),n._$AM=e,n._$AP!==void 0&&(c=e._$AU)!==o._$AU&&n._$AP(c)}if(r!==i||l){let c=n._$AA;for(;c!==r;){const h=c.nextSibling;s.insertBefore(c,i),c=h}}}return n},gt=(e,t,n=e)=>(e._$AI(t,n),e),Ie={},bt=(e,t=Ie)=>e._$AH=t,Mt=e=>e._$AH,$t=e=>{var s;(s=e._$AP)==null||s.call(e,!1,!0);let t=e._$AA;const n=e._$AB.nextSibling;for(;t!==n;){const i=t.nextSibling;t.remove(),t=i}};const Te={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},R=e=>(...t)=>({_$litDirective$:e,values:t});class Z{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,n,s){this._$Ct=t,this._$AM=n,this._$Ci=s}_$AS(t,n){return this.update(t,n)}update(t,n){return this.render(...n)}}const g=(e,t)=>{var s;const n=e._$AN;if(n===void 0)return!1;for(const i of n)(s=i._$AO)==null||s.call(i,t,!1),g(i,t);return!0},_=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while((n==null?void 0:n.size)===0)},ee=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),Pe(t)}};function Be(e){this._$AN!==void 0?(_(this),this._$AM=e,ee(this)):this._$AM=e}function Ne(e,t=!1,n=0){const s=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(s))for(let a=n;a<s.length;a++)g(s[a],!1),_(s[a]);else s!=null&&(g(s,!1),_(s));else g(this,e)}const Pe=e=>{e.type==Te.CHILD&&(e._$AP??(e._$AP=Ne),e._$AQ??(e._$AQ=Be))};class P extends Z{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,n,s){super._$AT(t,n,s),ee(this),this.isConnected=t._$AU}_$AO(t,n=!0){var s,i;t!==this.isConnected&&(this.isConnected=t,t?(s=this.reconnected)==null||s.call(this):(i=this.disconnected)==null||i.call(this)),n&&(g(this,t),_(this))}setValue(t){if(Se(this._$Ct))this._$Ct._$AI(t,this);else{const n=[...this._$Ct._$AH];n[this._$Ci]=t,this._$Ct._$AI(n,this,0)}}disconnected(){}reconnected(){}}function Le(e,t){return De(e,t)}function De(e,t,n){if(e===t)return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;const s=Object.keys(e),i=Object.keys(t);if(s.length!==i.length)return!1;for(const a of s)if(!i.includes(a)||e[a]!==t[a])return!1;return!0}var He=class extends P{render(e,t){return this.subscription?this.lastValue??t??"":(this.subscription=e.pipe(J(X)).subscribe(n=>{this.lastValue=n,this.setValue(n)}),t??"")}disconnected(){var e;(e=this.subscription)==null||e.unsubscribe()}},Oe=R(He),Fe=class extends P{constructor(){super(...arguments),this.isDisconnected=!1,this.handler=e=>{this.isDisconnected||this.setValue(e)}}render(e,t){return e.then(this.handler),t??""}disconnected(){this.isDisconnected=!0}},ze=R(Fe);function T(e,t){for(const n in t)e.style[n]=t[n]??""}var te=class extends Z{constructor(e){super(e),this.view=document.createElement("div"),this.lock=!1,T(this.view,{display:"flex",gap:"8px",position:"relative"})}render(e,t){return this.applyDirection(t.direction),this.lock?y`${this.view}`:this.view.children.length?(this.transition(e,t).catch(console.error),y`${this.view}`):(this.addedElementsWithoutAnimation(e,t),y`${this.view}`)}async transition(e,t){var V,q,U,k;const[n,s]=this.getKeyMapAndIndexMap(e,t),i=this.getIndexMapFromView(),a=this.getAllRenderCandidate(i,s),r=this.getAllRemoveCandidate(i,s),o=this.getAllMoveCandidate(i,s),l=this.getAllRenderCandidateElements(a,n,t),c=this.getAllCandidateElements(r),h=this.getAllCandidateElements(o),m=new Map,v=new Map,A=new Map;l.forEach((u,d)=>{m.set(s.get(d),u)}),c.forEach((u,d)=>{v.set(i.get(d),u)}),h.forEach((u,d)=>{A.set([i.get(d),s.get(d)],u)});const $=[...l.entries()],F=[...c.entries()],z=[...h.entries()];await((V=t.onAnimationStart)==null?void 0:V.call(t));const[ht,ve,Ae,ge]=await Promise.all([(q=t.onBeforeAnimation)==null?void 0:q.call(t,this.view,m,v,A),this.executeHandlerAndReturnResultMap($,(u,d)=>t.onBeforeRenderAnimateItem(u,s.get(d))),this.executeHandlerAndReturnResultMap(F,(u,d)=>t.onBeforeRemoveAnimateItem(u,i.get(d))),this.executeHandlerAndReturnResultMap(z,(u,d)=>{var f;return((f=t.onBeforeMoveAnimationItem)==null?void 0:f.call(t,u,i.get(d),s.get(d)))??Promise.resolve()})]);this.renderNode(l,s),this.removeNode(c),this.moveNode(h,i,s),await Promise.all([this.executeHandlerAndReturnResultMap($,(u,d)=>{var f;return((f=t.onAfterRenderAnimateItem)==null?void 0:f.call(t,u,s.get(d),ve.get(d)))??Promise.resolve()}),this.executeHandlerAndReturnResultMap(F,(u,d)=>{var f;return((f=t.onAfterRemoveAnimateItem)==null?void 0:f.call(t,u,i.get(d),Ae.get(d)))??Promise.resolve()}),this.executeHandlerAndReturnResultMap(z,(u,d)=>{var f;return((f=t.onAfterMoveAnimationItem)==null?void 0:f.call(t,u,ge.get(d)))??Promise.resolve()}),(U=t.onAfterAnimation)==null?void 0:U.call(t,this.view,m,v,A)]),await((k=t.onAnimationComplete)==null?void 0:k.call(t))}async executeHandlerAndReturnResultMap(e,t){const n=new Map;return await Promise.all(e.map(async([s,i])=>{const a=await t(i,s);n.set(s,a)})),n}getAllRenderCandidate(e,t){const n=new Set;return t.forEach((s,i)=>{e.has(i)||n.add(i)}),n}getAllRemoveCandidate(e,t){const n=new Set;return e.forEach((s,i)=>{t.has(i)||n.add(i)}),n}getAllMoveCandidate(e,t){const n=new Set;return new Set([...e.keys(),...t.keys()]).forEach(i=>{const a=e.get(i),r=t.get(i);a===void 0||r===void 0||a!==r&&n.add(i)}),n}getAllRenderCandidateElements(e,t,n){const s=new Map;let i=0;return e.forEach(a=>{const r=t.get(a);if(!r)return;const o=this.createItem(a),l=n.onTemplateBuilder(r,i);j(l,o),s.set(a,o)}),s}getAllCandidateElements(e){const t=new Map;return e.forEach(n=>{const s=this.view.querySelector(`#${n}`);s&&t.set(n,s)}),t}renderNode(e,t){e.forEach((n,s)=>{const i=t.get(s)??0,a=this.view.children[i];a?this.view.insertBefore(n,a):this.view.appendChild(n)})}removeNode(e){e.forEach(t=>{t.remove()})}moveNode(e,t,n){const s=this.getIndexMapFromView();e.forEach((i,a)=>{const r=t.get(a),o=n.get(a);if(s.get(a)===o)return;let c;r>o&&(c=this.view.children[o]),r<o&&(c=this.view.children[r]),c&&this.view.insertBefore(i,c)})}getKeyMapAndIndexMap(e,t){const n=new Map,s=new Map;let i=0;for(const a of e){const r=t.onKeyExtractor(a,i);n.set(r,a),s.set(r,i),i++}return[n,s]}getIndexMapFromView(){const e=new Map;let t=0;return this.view.childNodes.forEach(n=>{e.set(n.id,t++)}),e}addedElementsWithoutAnimation(e,t){let n=0;for(const s of e){const i=t.onKeyExtractor(s,n),a=this.createItem(i),r=t.onTemplateBuilder(s,n);j(r,a),this.view.appendChild(a),n++}}createItem(e){const t=document.createElement("div");return t.id=e.toString(),t}applyDirection(e){let t;e==="vertical"&&(t="column"),e==="horizontal"&&(t="row"),T(this.view,{flexDirection:t})}},Ve=R(te);function qe(e){for(let t=e.length-1;t>0;t--){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}var B=["#FF0000","#FF7F00","#ffd500","#40ff00","#0000FF","#37009e","#8B00FF"];qe(B);var K=ke(B,B.length/2);[...K,...K.reverse()];function x(e){const t=parseInt(e.slice(1),16),n=t>>16&255,s=t>>8&255,i=t&255;return[n,s,i]}function ne(e,t,n){return"#"+((1<<24)+(e<<16)+(t<<8)+n).toString(16).slice(1)}function p(e,t,n){return Math.round(e+(t-e)*n)}function Ue(e,t,n){const[s,i,a]=x(e),[r,o,l]=x(t),c=[];for(let h=0;h<=n;h++){const m=h/n,v=p(s,r,m),A=p(i,o,m),$=p(a,l,m);c.push(ne(v,A,$))}return c}function ke(e,t){const n=[];for(let s=0;s<e.length-1;s++){const i=Ue(e[s],e[s+1],t);n.push(...i.slice(0,-1))}return n.push(e[e.length-1]),n}function je(e,t,n,s,i){const a=x(e),r=x(t),o=(i-n)/(s-n),l=p(a[0],r[0],o),c=p(a[1],r[1],o),h=p(a[2],r[2],o);return ne(l,c,h)}function L(e,t){const n=document.createElement(e);if(t&&typeof t=="function")try{t(n)}catch(s){console.error("call side effect error",s)}return document.head.appendChild(n),n}function We(e){L("style",t=>se(t,e))}function se(e,t){e.textContent=t.cssText}function ie(e,t,n){return new CustomEvent(e,{bubbles:!0,composed:!0,detail:{value:t,event:n}})}function Ke(e,t,n,s){e.dispatchEvent(ie(t,n,s))}function w(e){const t=document.head.querySelector("#theme-color");if(!t){L("meta",n=>{n.id="theme-color",n.name="theme-color",n.content=e});return}t.content=e}function Qe(e,t,n){return new Promise(s=>{const i=Date.now(),a=i+n,r=()=>{const o=Date.now();if(o>=a){w(t),s();return}const l=je(e,t,i,a,o);w(l),requestAnimationFrame(r)};w(e),requestAnimationFrame(r)})}function Ge(e=40){try{navigator.vibrate(e)}catch{}}var Ye={requestUpdate:!0},Je=class{constructor(e,t,n){this.host=e,this.observers=t,e.addController(this),this.config={...Ye,...n},this.subscribe()}hostDisconnected(){var e;(e=this.subscription)==null||e.unsubscribe()}subscribe(){const e=Re(Array.isArray(this.observers)?this.observers:[this.observers]);this.subscription=e.subscribe(()=>{this.config.requestUpdate&&this.host.requestUpdate()})}};function ae(e,t,n){return new Je(e,t,n)}var re="screen and (max-width: 610px)",S;function b(){return S||(S=matchMedia(re)),S}function Xe(e){return Me`
      @media ${C(re)} {
          ${C(e)}
      }
  `}var oe=$e(()=>_e(b(),"change")).pipe(N(()=>b()),we(b()),Ce({bufferSize:0,refCount:!0}));function ce(e){ae(e,[oe])}function Ze(){return oe}function et(e){return ce(e),b()}function de(){const e=navigator.userAgent.toLowerCase();return e.includes("safari")&&!e.includes("chrome")&&!e.includes("crios")}function ue(){var e;return((e=window==null?void 0:window.navigator)==null?void 0:e.standalone)??!1}function tt(e){return de()&&ue()?C(e):C("")}var I=new WeakMap;function nt(e){if(I.has(e))return I.get(e);const t=new xe(n=>{const s=new ResizeObserver(i=>n.next(i[0]));return s.observe(e),()=>{s.unobserve(e)}});return I.set(e,t),t}var le=(e=>(e.en="en",e.ar="ar",e))(le||{}),st=["ar"];function D(e){return st.includes(e)}var E=new Map,H=new Ee(null),it="en",Q,M="en",G=0,Y=0,he=!1,at=H.pipe(N(()=>M));async function rt(e){for(const t in e){const n=Reflect.get(e,t),s=E.get(t)??[];s.push(n),E.set(t,s)}await O(M)}async function fe(e){await O(e)}async function me(){const e=localStorage.getItem("1inch_locale")??"en";he=!0,await O(e)}function pe(e,t){return H.pipe(N(n=>{if(!n)return"";const s=n[e]??"";return t&&s.includes("{{")&&s.includes("}}")?ot(s,t):s}))}function ot(e,t){let n=e;for(const s in t){const i=t[s],a=`{{${s}}}`;n=n.replaceAll(a,`${i}`)}return n}async function O(e){if(!he)return;const t=document.querySelector("html");t.dir=D(e)?"rtl":"ltr";const n=E.get(it)??[],s=E.get(e)??[],i=a=>a.reduce((r,o)=>({...r,...o}),{});if(n.length!==G){const a=await Promise.all(n.map(r=>r()));Q=i(a),G=n.length}if(M!==e||s.length!==Y){const a=await Promise.all(s.map(o=>o())),r=i(a);H.next({...Q,...r}),Y=s.length}M=e}function ct(){return D(M)}Reflect.set(window,"changeLocale",fe);var dt=class extends P{render(e,t){return this.subscription&&this.lastPath===e&&Le(this.lastContext,t)?this.lastValue??"":(this.disconnected(),this.subscription=pe(e,t).pipe(J(X)).subscribe(n=>{this.setValue(n),this.lastValue=n,this.lastPath=e,this.lastContext=t}),"")}disconnected(){var e;(e=this.subscription)==null||e.unsubscribe()}},ut=R(dt),lt=class{async init(){await me()}};const wt=Object.freeze(Object.defineProperty({__proto__:null,AnimationMap:te,I18nController:lt,Locale:le,addTranslation:rt,animationMap:Ve,appendStyle:T,applyStyle:se,async:ze,buildEvent:ie,changeLocale:fe,changeMobileMatchMedia:ce,createAndAppendInHeaderElement:L,createAndApplyStyle:We,dispatchEvent:Ke,getMobileMatchMedia:b,getMobileMatchMediaAndSubscribe:et,getMobileMatchMediaEmitter:Ze,initLocale:me,isRTL:D,isRTLCurrentLocale:ct,isSafari:de,isStandalone:ue,listenChangesByPath:pe,localeChange$:at,mobileMediaCSS:Xe,observe:Oe,resizeObserver:nt,safariPWACss:tt,setBrowserMetaColorColor:w,subscribe:ae,transitionBrowserMetaColor:Qe,translate:ut,vibrate:Ge},Symbol.toStringTag,{value:"Module"}));export{nt as A,Ze as B,ue as C,w as D,Ve as E,We as F,se as G,wt as H,le as L,ae as a,T as b,ce as c,Ke as d,et as e,ze as f,b as g,ie as h,ct as i,de as j,rt as k,at as l,Xe as m,R as n,Oe as o,Z as p,Te as q,P as r,tt as s,ut as t,Mt as u,Ge as v,gt as w,At as x,$t as y,bt as z};
//# sourceMappingURL=index.esm-C8vTiRtz.js.map
