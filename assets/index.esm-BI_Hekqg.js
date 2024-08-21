const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dark.style-IHZRPSJZ-Ciq9kR_Z.js","assets/index-sLuxChQW.js","assets/dark-blue.style-NUK7A3IA-BoB024BS.js","assets/light.style-5IM57SAI-CfUjslzm.js","assets/light-blue.style-VY6NMOV6-DsZ1p5Yh.js","assets/community.style-4H64DAFG-BHrdO-YG.js","assets/index.esm-DhwY4kHm.js","assets/index.esm-BAKH7_OQ.js","assets/index.esm-OIwjBXxl.js","assets/index.esm-COc-PyqV.js","assets/combineLatest-Bzt_9bb6.js","assets/defer-BRewiDsk.js","assets/asap-D-qxMtYG.js","assets/rainbow.style-7EZPSI4B-DB7BYusj.js","assets/random.style-C7MWPUO7-FBhZ2o6e.js","assets/orange.style-XNGQPUYN-5z-gN_7X.js","assets/violet.style-J42QNWBN-SpbKTrU6.js"])))=>i.map(i=>d[i]);
import{i as b,r as c,_ as u,t as z,s as Q,x as X}from"./index-sLuxChQW.js";import{M as i,B as h,R as Y}from"./index.esm-DhwY4kHm.js";import{E as R,m as J,F as K,G as $}from"./index.esm-BAKH7_OQ.js";import{S as x}from"./index.esm-OIwjBXxl.js";import"./defer-BRewiDsk.js";import"./combineLatest-Bzt_9bb6.js";import"./asap-D-qxMtYG.js";import"./index.esm-COc-PyqV.js";function U(t){for(let n=t.length-1;n>0;n--){const e=Math.floor(Math.random()*(n+1));[t[n],t[e]]=[t[e],t[n]]}return t}var A=["#FF0000","#FF7F00","#ffd500","#40ff00","#0000FF","#37009e","#8B00FF"],_t=U(A),O=tt(A,A.length/2),Z=[...O,...O.reverse()];function y(t){const n=parseInt(t.slice(1),16),e=n>>16&255,r=n>>8&255,o=n&255;return[e,r,o]}function P(t){let n=0,e=0,r=0,o=1;return t.length==4||t.length==5?(n=parseInt(t[1]+t[1],16),e=parseInt(t[2]+t[2],16),r=parseInt(t[3]+t[3],16),t.length==5&&(o=parseInt(t[4]+t[4],16)/255)):(t.length==7||t.length==9)&&(n=parseInt(t[1]+t[2],16),e=parseInt(t[3]+t[4],16),r=parseInt(t[5]+t[6],16),t.length==9&&(o=parseInt(t[7]+t[8],16)/255)),[n,e,r,o]}function p(t,n,e){return"#"+((1<<24)+(t<<16)+(n<<8)+e).toString(16).slice(1)}function F(t,n,e,r){const o=t.toString(16).padStart(2,"0"),a=n.toString(16).padStart(2,"0"),s=e.toString(16).padStart(2,"0"),l=r.toString(16).padStart(2,"0");return`#${o}${a}${s}${l}`}function St(t){const n=t.match(/\d+(\.\d+)?/g);if(n===null||n.length!==4)throw new Error("Invalid rgba string");const e=parseInt(n[0]),r=parseInt(n[1]),o=parseInt(n[2]),a=Math.round(parseFloat(n[3])*255);return F(e,r,o,a)}function Mt(t){const n=t.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+)%?)?\)/);if(!n)throw new Error("Invalid rgba format.");const e=parseInt(n[1]),r=parseInt(n[2]),o=parseInt(n[3]);return p(e,r,o)}function Et(t,n){const e=P(t+"ff"),r=P(n),o=Math.round((1-r[3])*e[0]+r[3]*r[0]),a=Math.round((1-r[3])*e[1]+r[3]*r[1]),s=Math.round((1-r[3])*e[2]+r[3]*r[2]),l=e[3];return F(o,a,s,l)}function w(t,n,e){return Math.round(t+(n-t)*e)}function N(t,n,e){const[r,o,a]=y(t),[s,l,m]=y(n),d=[];for(let f=0;f<=e;f++){const C=f/e,T=w(r,s,C),W=w(o,l,C),q=w(a,m,C);d.push(p(T,W,q))}return d}function tt(t,n){const e=[];for(let r=0;r<t.length-1;r++){const o=N(t[r],t[r+1],n);e.push(...o.slice(0,-1))}return e.push(t[t.length-1]),e}function It(t,n,e,r,o){const a=y(t),s=y(n),l=(o-e)/(r-e),m=w(a[0],s[0],l),d=w(a[1],s[1],l),f=w(a[2],s[2],l);return p(m,d,f)}function D(t,n=100){const[e,r,o]=y(t);return c(`rgba(${e}, ${r}, ${o}, 0.${n})`)}function nt(t){t=t.replace(/^#/,"");const n=parseInt(t,16);let e=n>>16&255,r=n>>8&255,o=n&255;const a=-32,s=-32,l=-32,m=d=>Math.max(0,Math.min(255,d));return e=m(e+a),r=m(r+s),o=m(o+l),c(p(e,r,o))}function Tt(){const e=[Math.floor(Math.random()*168+32),Math.floor(Math.random()*168+32),200];return e.sort(()=>Math.random()-.5),p(e[0],e[1],e[2])}function $t(t){function n(l){let m=0;for(let d=0;d<l.length;d++)m=l.charCodeAt(d)+((m<<5)-m);return m}function e(l){const f=(l&255)%168+32,C=(l>>8&255)%168+32,T=(l>>16&255)%168+32;return{r:f,g:C,b:T}}const r=n(t),{r:o,g:a,b:s}=e(r);return p(o,a,s)}function At(t,n){let[e,r,o]=y(t);return e=Math.min(255,Math.max(0,e*n)),r=Math.min(255,Math.max(0,r*n)),o=Math.min(255,Math.max(0,o*n)),p(Math.round(e),Math.round(r),Math.round(o))}function Bt(t,n=":root"){return b`
      ${c(n)} {
          --primary: ${c(t)};
          --primary-50: ${D(t,50)};
          --primary-12: ${D(t,12)};
          --primary-hover: ${nt(t)};
          --secondary: ${c(t)}1f;
          --secondary-hover: ${c(t)}3d;
      }
  `}var et=Object.defineProperty,rt=Object.getOwnPropertyDescriptor,ot=(t,n,e,r)=>{for(var o=r>1?void 0:r?rt(n,e):n,a=t.length-1,s;a>=0;a--)(s=t[a])&&(o=(r?s(n,e,o):s(o))||o);return r&&o&&et(n,e,o),o},at=new RegExp("(?<=var\\().*?(?=\\))");function kt(t){const n=t.match(at),e=n?n[0]:t;return getComputedStyle(document.documentElement).getPropertyValue(e).trim()}var V=document.createElement("style"),L=document.createElement("style"),it=(t="")=>b`

    @font-face { font-family: "Inter"; font-style: normal; font-weight: 500; font-display: swap; src: url("fonts/Inter/Inter-Medium.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 600; font-display: swap; src: url("fonts/Inter/Inter-SemiBold.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 400; font-display: swap; src: url("fonts/Inter/Inter-Regular.woff2") format("woff2"); }

    ${c(t)} * {
        font-family: 'Inter', sans-serif;
        font-style: normal;
    }

`,lt=b`
    
    html {
        background-color: var(--color-background-bg-body);
        position: fixed;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    body {
        margin: 0;
        background-color: var(--color-background-bg-body);
        box-sizing: border-box;
    }

    ::view-transition-old(root),
    ::view-transition-new(root) {
        animation: none;
        mix-blend-mode: normal;
    }
    
    * {
        user-select: none;
        outline: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
    }

`,v={[i.systemSync]:t=>ct(t),[i.dark]:t=>u(()=>import("./dark.style-IHZRPSJZ-Ciq9kR_Z.js"),__vite__mapDeps([0,1])).then(n=>n.themeDark(t)),[i.darkBlue]:t=>u(()=>import("./dark-blue.style-NUK7A3IA-BoB024BS.js"),__vite__mapDeps([2,1])).then(n=>n.themeDarkBlue(t)),[i.light]:t=>u(()=>import("./light.style-5IM57SAI-CfUjslzm.js"),__vite__mapDeps([3,1])).then(n=>n.themeLight(t)),[i.lightBlue]:t=>u(()=>import("./light-blue.style-VY6NMOV6-DsZ1p5Yh.js"),__vite__mapDeps([4,1])).then(n=>n.themeLightBlue(t))},st={[h.community]:()=>u(()=>import("./community.style-4H64DAFG-BHrdO-YG.js"),__vite__mapDeps([5,1,6,7,8,9,10,11,12])).then(t=>t.communityStyle),[h.rainbow]:()=>u(()=>import("./rainbow.style-7EZPSI4B-DB7BYusj.js"),__vite__mapDeps([13,1,6,7,8,9,10,11,12])).then(t=>t.rainbowStyle),[h.random]:()=>u(()=>import("./random.style-C7MWPUO7-FBhZ2o6e.js"),__vite__mapDeps([14,1,6,7,8,9,10,11,12])).then(t=>t.randomStyle()),[h.orange]:()=>u(()=>import("./orange.style-XNGQPUYN-5z-gN_7X.js"),__vite__mapDeps([15,1,6,7,8,9,10,11,12])).then(t=>t.orangeStyle),[h.violet]:()=>u(()=>import("./violet.style-J42QNWBN-SpbKTrU6.js"),__vite__mapDeps([16,1,6,7,8,9,10,11,12])).then(t=>t.violetStyle)};function ct(t){var n,e;return window.matchMedia("(prefers-color-scheme: dark)").matches?(n=window==null?void 0:window.ethereum)!=null&&n.isOneInchIOSWallet?v[i.darkBlue](t):v[i.dark](t):(e=window==null?void 0:window.ethereum)!=null&&e.isOneInchIOSWallet?v[i.lightBlue](t):v[i.light](t)}var g,B,H=!1,I={[i.systemSync]:()=>mt(),[i.light]:()=>"#f1f1f1",[i.lightBlue]:()=>"#f1f1f1",[i.dark]:()=>"#0e0e0e",[i.darkBlue]:()=>"#0e0e0e"},k=window.matchMedia("(prefers-color-scheme: dark)"),j=new Y(1),_=null;function Rt(){H=!0}function mt(){return k.matches?I[i.dark]():I[i.light]()}function xt(t){_=t,G(I[g]())}function G(t){if(H)return;const n=document.head.querySelector("#theme-color");if(!n){K("meta",e=>{e.id="theme-color",e.name="theme-color",e.content=_?_(t,S(g)):t});return}n.content=_?_(t,S(g)):t}async function Ot(t,n){return await M(t,B,n)}async function Pt(t,n){return await M(g,t,n)}function Dt(){return j}k.onchange=async()=>{g===i.systemSync&&await M(i.systemSync,B)};function S(t){return t===i.systemSync?k.matches:t===i.dark||t===i.darkBlue}async function M(t,n,e){const r=async()=>{const o=await v[t](),a=await st[n]();R(V,o),R(L,a),G(I[t]()),g=t,B=n,document.documentElement.setAttribute("theme",S(t)?"dark":"light"),document.documentElement.setAttribute("brand-color",h[n]),j.next({mainColor:t,brandColor:n})};if(e&&"startViewTransition"in document&&S(g)!==S(t)){const o=e.clientX,a=e.clientY,s=window.innerWidth-a,l=window.innerHeight-o,m=Math.hypot(Math.max(a,s),Math.max(o,l))+100;document.startViewTransition(()=>{r()}).ready.then(()=>document.documentElement.animate({clipPath:[`circle(0px at ${o}px ${a}px)`,`circle(${m}px at ${o}px ${a}px)`]},{duration:600,easing:"ease-in-out",pseudoElement:"::view-transition-new(root)"}).finished);return}await r()}var dt=(t,n)=>b`
    
    ${c(t)} {
        overflow: auto;
        touch-action: pan-y;
        overscroll-behavior: none;
        scrollbar-color: var(--primary) transparent;
        scrollbar-width: ${c(n?"none":"thin")};
        scrollbar-gutter: stable;
    }

    /* width */
    ${c(t)}::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }

    /* Track */
    ${c(t)}::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Handle */
    ${c(t)}::-webkit-scrollbar-thumb {
        background: var(--primary);
        border-radius: 4px;
    }

    /* Handle on hover */
    ${c(t)}::-webkit-scrollbar-thumb:hover {
        background: var(--primary-hover);
    }
    
    ${J(b`
        ${c(t)}::-webkit-scrollbar {
            display: none;
        }
    `)}
    
    ${c(n?b`
          ${c(t)}::-webkit-scrollbar {
              display: none;
          }
    `:"")}
`,ut=dt(":host");async function ht(t=i.light,n=h.community){document.head.appendChild(V),document.head.appendChild(L),$(it()),$(lt),$(ut),await M(t,n)}function Ft(){return c(`linear-gradient(90deg, ${c(Z.join(","))})`)}var E=class extends Q{render(){return X`<slot></slot>`}};E.tagName="inch-theme-embedded-container";E=ot([z(E.tagName)],E);var Vt=class{constructor(){this.mainColorSettings=new x("main-color-name",i.systemSync),this.brandColorSettings=new x("brand-color-name",h.community)}getActiveMainColor(){return this.mainColorSettings.value??i.systemSync}getActiveBrandColor(){return this.brandColorSettings.value??h.community}async init(){const t=this.getActiveMainColor(),n=this.getActiveBrandColor();await ht(t,n)}async onChangeTheme(t,n,e){return this.mainColorSettings.setValue(t),this.brandColorSettings.setValue(n),await M(t,n,e)}async onChangeMainColor(t,n){const e=this.getActiveBrandColor();await this.onChangeTheme(t,e,n)}async onChangeBrandColor(t,n){const e=this.getActiveMainColor();await this.onChangeTheme(e,t,n)}},Lt=class{async init(t){}async onChangeTheme(t,n,e){throw new Error("ThemeEmbeddedController not support onChangeTheme")}async onChangeMainColor(t,n){throw new Error("ThemeEmbeddedController not support onChangeMainColor")}async onChangeBrandColor(t,n){throw new Error("ThemeEmbeddedController not support onChangeBrandColor")}getActiveBrandColor(){throw new Error("ThemeEmbeddedController not support getActiveBrandColor")}getActiveMainColor(){throw new Error("ThemeEmbeddedController not support getActiveMainColor")}};export{Vt as ThemeController,E as ThemeEmbeddedContainerElement,Lt as ThemeEmbeddedController,At as applyColorBrightness,Et as blendColors,st as brandColorMap,it as fontStyle,mt as getBrowserMetaColor,$t as getColorFromString,kt as getCssValue,Ft as getRainbowGradient,Tt as getRandomBrightColor,dt as getScrollbarStyle,Dt as getThemeChange,D as hexToRGBA,It as interpolateColorRange,v as mainColorMap,Bt as makeColorSchema,A as rainbowColors,_t as rainbowRandomColors,Z as rainbowRandomColorsInterpolate,Mt as rgbStrToHex,p as rgbToHex,St as rgbaStrToHex,ut as scrollbarStyle,xt as setBrowserMetaColorFilter,Rt as setEmbeddedMode,M as themeChange,Pt as themeChangeBrandColor,Ot as themeChangeMainColor,ht as themeInit,nt as transformColor};
//# sourceMappingURL=index.esm-BI_Hekqg.js.map
