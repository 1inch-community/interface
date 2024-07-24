const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dark.style-UM7ZMMAJ-D0xFZsXG.js","assets/index-sLWOp1cP.js","assets/dark-blue.style-RCRIYV56-ByGPNWRX.js","assets/light.style-BQKHWKWO-CHZkldql.js","assets/light-blue.style-W6OESTNI-gdTUltKb.js","assets/community.style-2325ZA4E-g22KXFdM.js","assets/index.esm-DfotAdpM.js","assets/index.esm-CGEC4wRC.js","assets/index.esm-CjXD2v0E.js","assets/index.esm-COc-PyqV.js","assets/combineLatest-Cx3jWXTV.js","assets/asap-BqWvnQ_m.js","assets/rainbow.style-KL6EELJC-Ctb2a_tr.js","assets/random.style-OYX462PK-C23N254K.js","assets/orange.style-Z7PJ5G6E-CaE9ZNp9.js","assets/violet.style-SHQNUURR-DBKkw6HN.js"])))=>i.map(i=>d[i]);
import{i as b,r as l,_ as d}from"./index-sLWOp1cP.js";import{M as a,B as h,R as W}from"./index.esm-DfotAdpM.js";import{E as R,m as q,F as z,G as $}from"./index.esm-CGEC4wRC.js";import{S as B}from"./index.esm-CjXD2v0E.js";import"./combineLatest-Cx3jWXTV.js";import"./asap-BqWvnQ_m.js";import"./index.esm-COc-PyqV.js";function Q(t){for(let n=t.length-1;n>0;n--){const r=Math.floor(Math.random()*(n+1));[t[n],t[r]]=[t[r],t[n]]}return t}var E=["#FF0000","#FF7F00","#ffd500","#40ff00","#0000FF","#37009e","#8B00FF"],ht=Q(E),x=J(E,E.length/2),X=[...x,...x.reverse()];function w(t){const n=parseInt(t.slice(1),16),r=n>>16&255,e=n>>8&255,o=n&255;return[r,e,o]}function F(t){let n=0,r=0,e=0,o=1;return t.length==4||t.length==5?(n=parseInt(t[1]+t[1],16),r=parseInt(t[2]+t[2],16),e=parseInt(t[3]+t[3],16),t.length==5&&(o=parseInt(t[4]+t[4],16)/255)):(t.length==7||t.length==9)&&(n=parseInt(t[1]+t[2],16),r=parseInt(t[3]+t[4],16),e=parseInt(t[5]+t[6],16),t.length==9&&(o=parseInt(t[7]+t[8],16)/255)),[n,r,e,o]}function p(t,n,r){return"#"+((1<<24)+(t<<16)+(n<<8)+r).toString(16).slice(1)}function O(t,n,r,e){const o=t.toString(16).padStart(2,"0"),i=n.toString(16).padStart(2,"0"),c=r.toString(16).padStart(2,"0"),s=e.toString(16).padStart(2,"0");return`#${o}${i}${c}${s}`}function ft(t){const n=t.match(/\d+(\.\d+)?/g);if(n===null||n.length!==4)throw new Error("Invalid rgba string");const r=parseInt(n[0]),e=parseInt(n[1]),o=parseInt(n[2]),i=Math.round(parseFloat(n[3])*255);return O(r,e,o,i)}function gt(t){const n=t.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+)%?)?\)/);if(!n)throw new Error("Invalid rgba format.");const r=parseInt(n[1]),e=parseInt(n[2]),o=parseInt(n[3]);return p(r,e,o)}function pt(t,n){const r=F(t+"ff"),e=F(n),o=Math.round((1-e[3])*r[0]+e[3]*e[0]),i=Math.round((1-e[3])*r[1]+e[3]*e[1]),c=Math.round((1-e[3])*r[2]+e[3]*e[2]),s=r[3];return O(o,i,c,s)}function y(t,n,r){return Math.round(t+(n-t)*r)}function Y(t,n,r){const[e,o,i]=w(t),[c,s,u]=w(n),m=[];for(let f=0;f<=r;f++){const v=f/r,k=y(e,c,v),G=y(o,s,v),j=y(i,u,v);m.push(p(k,G,j))}return m}function J(t,n){const r=[];for(let e=0;e<t.length-1;e++){const o=Y(t[e],t[e+1],n);r.push(...o.slice(0,-1))}return r.push(t[t.length-1]),r}function bt(t,n,r,e,o){const i=w(t),c=w(n),s=(o-r)/(e-r),u=y(i[0],c[0],s),m=y(i[1],c[1],s),f=y(i[2],c[2],s);return p(u,m,f)}function V(t,n=100){const[r,e,o]=w(t);return l(`rgba(${r}, ${e}, ${o}, 0.${n})`)}function K(t){t=t.replace(/^#/,"");const n=parseInt(t,16);let r=n>>16&255,e=n>>8&255,o=n&255;const i=-32,c=-32,s=-32,u=m=>Math.max(0,Math.min(255,m));return r=u(r+i),e=u(e+c),o=u(o+s),l(p(r,e,o))}function yt(){const r=[Math.floor(Math.random()*168+32),Math.floor(Math.random()*168+32),200];return r.sort(()=>Math.random()-.5),p(r[0],r[1],r[2])}function wt(t){function n(s){let u=0;for(let m=0;m<s.length;m++)u=s.charCodeAt(m)+((u<<5)-u);return u}function r(s){const f=(s&255)%168+32,v=(s>>8&255)%168+32,k=(s>>16&255)%168+32;return{r:f,g:v,b:k}}const e=n(t),{r:o,g:i,b:c}=r(e);return p(o,i,c)}function vt(t,n){let[r,e,o]=w(t);return r=Math.min(255,Math.max(0,r*n)),e=Math.min(255,Math.max(0,e*n)),o=Math.min(255,Math.max(0,o*n)),p(Math.round(r),Math.round(e),Math.round(o))}function Ct(t){return b`
      :root {
          --primary: ${l(t)};
          --primary-50: ${V(t,50)};
          --primary-12: ${V(t,12)};
          --primary-hover: ${K(t)};
          --secondary: ${l(t)}1f;
          --secondary-hover: ${l(t)}3d;
      }
  `}var U=new RegExp("(?<=var\\().*?(?=\\))");function St(t){const n=t.match(U),r=n?n[0]:t;return getComputedStyle(document.documentElement).getPropertyValue(r).trim()}var D=document.createElement("style"),P=document.createElement("style"),Z=b`

    @font-face { font-family: "Inter"; font-style: normal; font-weight: 500; font-display: swap; src: url("fonts/Inter/Inter-Medium.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 600; font-display: swap; src: url("fonts/Inter/Inter-SemiBold.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 400; font-display: swap; src: url("fonts/Inter/Inter-Regular.woff2") format("woff2"); }

    * {
        font-family: 'Inter', sans-serif;
        font-style: normal;
    }

`,N=b`
    
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

`,C={[a.systemSync]:()=>nt(),[a.dark]:()=>d(()=>import("./dark.style-UM7ZMMAJ-D0xFZsXG.js"),__vite__mapDeps([0,1])).then(t=>t.themeDark),[a.darkBlue]:()=>d(()=>import("./dark-blue.style-RCRIYV56-ByGPNWRX.js"),__vite__mapDeps([2,1])).then(t=>t.themeDarkBlue),[a.light]:()=>d(()=>import("./light.style-BQKHWKWO-CHZkldql.js"),__vite__mapDeps([3,1])).then(t=>t.themeLight),[a.lightBlue]:()=>d(()=>import("./light-blue.style-W6OESTNI-gdTUltKb.js"),__vite__mapDeps([4,1])).then(t=>t.themeLightBlue)},tt={[h.community]:()=>d(()=>import("./community.style-2325ZA4E-g22KXFdM.js"),__vite__mapDeps([5,1,6,7,8,9,10,11])).then(t=>t.communityStyle),[h.rainbow]:()=>d(()=>import("./rainbow.style-KL6EELJC-Ctb2a_tr.js"),__vite__mapDeps([12,1,6,7,8,9,10,11])).then(t=>t.rainbowStyle),[h.random]:()=>d(()=>import("./random.style-OYX462PK-C23N254K.js"),__vite__mapDeps([13,1,6,7,8,9,10,11])).then(t=>t.randomStyle),[h.orange]:()=>d(()=>import("./orange.style-Z7PJ5G6E-CaE9ZNp9.js"),__vite__mapDeps([14,1,6,7,8,9,10,11])).then(t=>t.orangeStyle),[h.violet]:()=>d(()=>import("./violet.style-SHQNUURR-DBKkw6HN.js"),__vite__mapDeps([15,1,6,7,8,9,10,11])).then(t=>t.violetStyle)};function nt(){var t,n;return window.matchMedia("(prefers-color-scheme: dark)").matches?(t=window==null?void 0:window.ethereum)!=null&&t.isOneInchIOSWallet?C[a.darkBlue]():C[a.dark]():(n=window==null?void 0:window.ethereum)!=null&&n.isOneInchIOSWallet?C[a.lightBlue]():C[a.light]()}var g,T,M={[a.systemSync]:()=>rt(),[a.light]:()=>"#f1f1f1",[a.lightBlue]:()=>"#f1f1f1",[a.dark]:()=>"#0e0e0e",[a.darkBlue]:()=>"#0e0e0e"},A=window.matchMedia("(prefers-color-scheme: dark)"),L=new W(1),S=null;function rt(){return A.matches?M[a.dark]():M[a.light]()}function _t(t){S=t,H(M[g]())}function H(t){const n=document.head.querySelector("#theme-color");if(!n){z("meta",r=>{r.id="theme-color",r.name="theme-color",r.content=S?S(t,_(g)):t});return}n.content=S?S(t,_(g)):t}async function It(t,n){return await I(t,T,n)}async function Mt(t,n){return await I(g,t,n)}function kt(){return L}A.onchange=async()=>{g===a.systemSync&&await I(a.systemSync,T)};function _(t){return t===a.systemSync?A.matches:t===a.dark||t===a.darkBlue}async function I(t,n,r){const e=async()=>{const o=await C[t](),i=await tt[n]();R(D,o),R(P,i),H(M[t]()),g=t,T=n,document.documentElement.setAttribute("theme",_(t)?"dark":"light"),document.documentElement.setAttribute("brand-color",h[n]),L.next({mainColor:t,brandColor:n})};if(r&&"startViewTransition"in document&&_(g)!==_(t)){const o=r.clientX,i=r.clientY,c=window.innerWidth-i,s=window.innerHeight-o,u=Math.hypot(Math.max(i,c),Math.max(o,s))+100;document.startViewTransition(()=>{e()}).ready.then(()=>document.documentElement.animate({clipPath:[`circle(0px at ${o}px ${i}px)`,`circle(${u}px at ${o}px ${i}px)`]},{duration:600,easing:"ease-in-out",pseudoElement:"::view-transition-new(root)"}).finished);return}await e()}var et=(t,n)=>b`
    
    ${l(t)} {
        overflow: auto;
        touch-action: pan-y;
        overscroll-behavior: none;
        scrollbar-color: var(--primary) transparent;
        scrollbar-width: ${l(n?"none":"thin")};
        scrollbar-gutter: stable;
    }

    /* width */
    ${l(t)}::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }

    /* Track */
    ${l(t)}::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Handle */
    ${l(t)}::-webkit-scrollbar-thumb {
        background: var(--primary);
        border-radius: 4px;
    }

    /* Handle on hover */
    ${l(t)}::-webkit-scrollbar-thumb:hover {
        background: var(--primary-hover);
    }
    
    ${q(b`
        ${l(t)}::-webkit-scrollbar {
            display: none;
        }
    `)}
    
    ${l(n?b`
          ${l(t)}::-webkit-scrollbar {
              display: none;
          }
    `:"")}
`,ot=et(":host");async function at(t=a.light,n=h.community){document.head.appendChild(D),document.head.appendChild(P),$(Z),$(N),$(ot),await I(t,n)}function $t(){return l(`linear-gradient(90deg, ${l(X.join(","))})`)}var Et=class{constructor(){this.mainColorSettings=new B("main-color-name",a.systemSync),this.brandColorSettings=new B("brand-color-name",h.community)}getActiveMainColor(){return this.mainColorSettings.value??a.systemSync}getActiveBrandColor(){return this.brandColorSettings.value??h.community}async init(t){const n=this.getActiveMainColor(),r=this.getActiveBrandColor();await at(n,r)}async onChangeTheme(t,n,r){return this.mainColorSettings.setValue(t),this.brandColorSettings.setValue(n),await I(t,n,r)}async onChangeMainColor(t,n){const r=this.getActiveBrandColor();await this.onChangeTheme(t,r,n)}async onChangeBrandColor(t,n){const r=this.getActiveMainColor();await this.onChangeTheme(r,t,n)}};export{Et as ThemeController,vt as applyColorBrightness,pt as blendColors,rt as getBrowserMetaColor,wt as getColorFromString,St as getCssValue,$t as getRainbowGradient,yt as getRandomBrightColor,et as getScrollbarStyle,kt as getThemeChange,V as hexToRGBA,bt as interpolateColorRange,Ct as makeColorSchema,E as rainbowColors,ht as rainbowRandomColors,X as rainbowRandomColorsInterpolate,gt as rgbStrToHex,p as rgbToHex,ft as rgbaStrToHex,ot as scrollbarStyle,_t as setBrowserMetaColorFilter,I as themeChange,Mt as themeChangeBrandColor,It as themeChangeMainColor,at as themeInit,K as transformColor};
//# sourceMappingURL=index.esm-B4YiEjKM.js.map
