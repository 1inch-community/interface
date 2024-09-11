const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dark.style-IHZRPSJZ-0gf-7c54.js","assets/index-DuIRcoZI.js","assets/dark-blue.style-NUK7A3IA-DY4CZyDm.js","assets/light.style-5IM57SAI-Bg_QGrFz.js","assets/light-blue.style-VY6NMOV6-C5Tgqw2Z.js","assets/community.style-RWKB44BC-B60D1wOx.js","assets/index.esm-DhwY4kHm.js","assets/index.esm-CXOrnIqP.js","assets/index.esm-OIwjBXxl.js","assets/index.esm-COc-PyqV.js","assets/combineLatest-Bzt_9bb6.js","assets/defer-BRewiDsk.js","assets/asap-D-qxMtYG.js","assets/rainbow.style-POOUJKCE-DKAv20hd.js","assets/random.style-5KLAHRBN-CBEk5goo.js","assets/orange.style-SHX2AUWW-Cl_R1BQt.js","assets/violet.style-Y3WLLZZ6-DCjgsSXd.js"])))=>i.map(i=>d[i]);
import{i as g,r as l,_ as u,t as z,h as q,k as Q}from"./index-DuIRcoZI.js";import{M as i,B as h,R as Y}from"./index.esm-DhwY4kHm.js";import{D as x,m as J,E as K,F as k}from"./index.esm-CXOrnIqP.js";import{S as D}from"./index.esm-OIwjBXxl.js";import"./defer-BRewiDsk.js";import"./combineLatest-Bzt_9bb6.js";import"./asap-D-qxMtYG.js";import"./index.esm-COc-PyqV.js";function U(t){for(let n=t.length-1;n>0;n--){const e=Math.floor(Math.random()*(n+1));[t[n],t[e]]=[t[e],t[n]]}return t}var A=["#FF0000","#FF7F00","#ffd500","#40ff00","#0000FF","#37009e","#8B00FF"],St=U(A),O=tt(A,A.length/2),Z=[...O,...O.reverse()];function w(t){const n=parseInt(t.slice(1),16),e=n>>16&255,r=n>>8&255,o=n&255;return[e,r,o]}function P(t){let n=0,e=0,r=0,o=1;return t.length==4||t.length==5?(n=parseInt(t[1]+t[1],16),e=parseInt(t[2]+t[2],16),r=parseInt(t[3]+t[3],16),t.length==5&&(o=parseInt(t[4]+t[4],16)/255)):(t.length==7||t.length==9)&&(n=parseInt(t[1]+t[2],16),e=parseInt(t[3]+t[4],16),r=parseInt(t[5]+t[6],16),t.length==9&&(o=parseInt(t[7]+t[8],16)/255)),[n,e,r,o]}function b(t,n,e){return"#"+((1<<24)+(t<<16)+(n<<8)+e).toString(16).slice(1)}function F(t,n,e,r){const o=t.toString(16).padStart(2,"0"),a=n.toString(16).padStart(2,"0"),c=e.toString(16).padStart(2,"0"),s=r.toString(16).padStart(2,"0");return`#${o}${a}${c}${s}`}function Mt(t){const n=t.match(/\d+(\.\d+)?/g);if(n===null||n.length!==4)throw new Error("Invalid rgba string");const e=parseInt(n[0]),r=parseInt(n[1]),o=parseInt(n[2]),a=Math.round(parseFloat(n[3])*255);return F(e,r,o,a)}function Et(t){const n=t.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+)%?)?\)/);if(!n)throw new Error("Invalid rgba format.");const e=parseInt(n[1]),r=parseInt(n[2]),o=parseInt(n[3]);return b(e,r,o)}function It(t,n){const e=P(t+"ff"),r=P(n),o=Math.round((1-r[3])*e[0]+r[3]*r[0]),a=Math.round((1-r[3])*e[1]+r[3]*r[1]),c=Math.round((1-r[3])*e[2]+r[3]*r[2]),s=e[3];return F(o,a,c,s)}function y(t,n,e){return Math.round(t+(n-t)*e)}function N(t,n,e){const[r,o,a]=w(t),[c,s,m]=w(n),d=[];for(let f=0;f<=e;f++){const v=f/e,T=y(r,c,v),W=y(o,s,v),X=y(a,m,v);d.push(b(T,W,X))}return d}function tt(t,n){const e=[];for(let r=0;r<t.length-1;r++){const o=N(t[r],t[r+1],n);e.push(...o.slice(0,-1))}return e.push(t[t.length-1]),e}function $t(t,n,e,r,o){const a=w(t),c=w(n),s=(o-e)/(r-e),m=y(a[0],c[0],s),d=y(a[1],c[1],s),f=y(a[2],c[2],s);return b(m,d,f)}function E(t,n=100){const[e,r,o]=w(t);return l(`rgba(${e}, ${r}, ${o}, 0.${n})`)}function nt(t){t=t.replace(/^#/,"");const n=parseInt(t,16);let e=n>>16&255,r=n>>8&255,o=n&255;const a=-32,c=-32,s=-32,m=d=>Math.max(0,Math.min(255,d));return e=m(e+a),r=m(r+c),o=m(o+s),l(b(e,r,o))}function Tt(){const e=[Math.floor(Math.random()*168+32),Math.floor(Math.random()*168+32),200];return e.sort(()=>Math.random()-.5),b(e[0],e[1],e[2])}function kt(t){function n(s){let m=0;for(let d=0;d<s.length;d++)m=s.charCodeAt(d)+((m<<5)-m);return m}function e(s){const f=(s&255)%168+32,v=(s>>8&255)%168+32,T=(s>>16&255)%168+32;return{r:f,g:v,b:T}}const r=n(t),{r:o,g:a,b:c}=e(r);return b(o,a,c)}function At(t,n){let[e,r,o]=w(t);return e=Math.min(255,Math.max(0,e*n)),r=Math.min(255,Math.max(0,r*n)),o=Math.min(255,Math.max(0,o*n)),b(Math.round(e),Math.round(r),Math.round(o))}function Bt(t,n=":root"){return g`
      ${l(n)} {
          --primary: ${l(t)};
          --primary-50: ${E(t,50)};
          --primary-12: ${E(t,12)};
          --primary-5: ${E(t,5)};
          --primary-1: ${E(t,1)};
          --primary-hover: ${nt(t)};
          --secondary: ${l(t)}1f;
          --secondary-hover: ${l(t)}3d;
      }
  `}var et=Object.defineProperty,rt=Object.getOwnPropertyDescriptor,ot=(t,n,e,r)=>{for(var o=r>1?void 0:r?rt(n,e):n,a=t.length-1,c;a>=0;a--)(c=t[a])&&(o=(r?c(n,e,o):c(o))||o);return r&&o&&et(n,e,o),o},at=new RegExp("(?<=var\\().*?(?=\\))");function Rt(t){const n=t.match(at),e=n?n[0]:t;return getComputedStyle(document.documentElement).getPropertyValue(e).trim()}var V=document.createElement("style"),L=document.createElement("style"),it=(t="")=>g`

    @font-face { font-family: "Inter"; font-style: normal; font-weight: 500; font-display: swap; src: url("fonts/Inter/Inter-Medium.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 600; font-display: swap; src: url("fonts/Inter/Inter-SemiBold.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 400; font-display: swap; src: url("fonts/Inter/Inter-Regular.woff2") format("woff2"); }

    ${l(t)} * {
        font-family: 'Inter', sans-serif;
        font-style: normal;
    }

`,lt=g`
    
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

`,C={[i.systemSync]:t=>ct(t),[i.dark]:t=>u(()=>import("./dark.style-IHZRPSJZ-0gf-7c54.js"),__vite__mapDeps([0,1])).then(n=>n.themeDark(t)),[i.darkBlue]:t=>u(()=>import("./dark-blue.style-NUK7A3IA-DY4CZyDm.js"),__vite__mapDeps([2,1])).then(n=>n.themeDarkBlue(t)),[i.light]:t=>u(()=>import("./light.style-5IM57SAI-Bg_QGrFz.js"),__vite__mapDeps([3,1])).then(n=>n.themeLight(t)),[i.lightBlue]:t=>u(()=>import("./light-blue.style-VY6NMOV6-C5Tgqw2Z.js"),__vite__mapDeps([4,1])).then(n=>n.themeLightBlue(t))},st={[h.community]:()=>u(()=>import("./community.style-RWKB44BC-B60D1wOx.js"),__vite__mapDeps([5,1,6,7,8,9,10,11,12])).then(t=>t.communityStyle),[h.rainbow]:()=>u(()=>import("./rainbow.style-POOUJKCE-DKAv20hd.js"),__vite__mapDeps([13,1,6,7,8,9,10,11,12])).then(t=>t.rainbowStyle),[h.random]:()=>u(()=>import("./random.style-5KLAHRBN-CBEk5goo.js"),__vite__mapDeps([14,1,6,7,8,9,10,11,12])).then(t=>t.randomStyle()),[h.orange]:()=>u(()=>import("./orange.style-SHX2AUWW-Cl_R1BQt.js"),__vite__mapDeps([15,1,6,7,8,9,10,11,12])).then(t=>t.orangeStyle),[h.violet]:()=>u(()=>import("./violet.style-Y3WLLZZ6-DCjgsSXd.js"),__vite__mapDeps([16,1,6,7,8,9,10,11,12])).then(t=>t.violetStyle)};function ct(t){var n,e;return window.matchMedia("(prefers-color-scheme: dark)").matches?(n=window==null?void 0:window.ethereum)!=null&&n.isOneInchIOSWallet?C[i.darkBlue](t):C[i.dark](t):(e=window==null?void 0:window.ethereum)!=null&&e.isOneInchIOSWallet?C[i.lightBlue](t):C[i.light](t)}var p,B,H=!1,$={[i.systemSync]:()=>mt(),[i.light]:()=>"#f1f1f1",[i.lightBlue]:()=>"#f1f1f1",[i.dark]:()=>"#0e0e0e",[i.darkBlue]:()=>"#0e0e0e"},R=window.matchMedia("(prefers-color-scheme: dark)"),j=new Y(1),_=null;function xt(){H=!0}function mt(){return R.matches?$[i.dark]():$[i.light]()}function Dt(t){_=t,G($[p]())}function G(t){if(H)return;const n=document.head.querySelector("#theme-color");if(!n){K("meta",e=>{e.id="theme-color",e.name="theme-color",e.content=_?_(t,S(p)):t});return}n.content=_?_(t,S(p)):t}async function Ot(t,n){return await M(t,B,n)}async function Pt(t,n){return await M(p,t,n)}function Ft(){return j}R.onchange=async()=>{p===i.systemSync&&await M(i.systemSync,B)};function S(t){return t===i.systemSync?R.matches:t===i.dark||t===i.darkBlue}async function M(t,n,e){const r=async()=>{const o=await C[t](),a=await st[n]();x(V,o),x(L,a),G($[t]()),p=t,B=n,document.documentElement.setAttribute("theme",S(t)?"dark":"light"),document.documentElement.setAttribute("brand-color",h[n]),j.next({mainColor:t,brandColor:n})};if(e&&"startViewTransition"in document&&S(p)!==S(t)){const o=e.clientX,a=e.clientY,c=window.innerWidth-a,s=window.innerHeight-o,m=Math.hypot(Math.max(a,c),Math.max(o,s))+100;document.startViewTransition(()=>{r()}).ready.then(()=>document.documentElement.animate({clipPath:[`circle(0px at ${o}px ${a}px)`,`circle(${m}px at ${o}px ${a}px)`]},{duration:600,easing:"ease-in-out",pseudoElement:"::view-transition-new(root)"}).finished);return}await r()}var dt=(t,n)=>g`
    
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
    
    ${J(g`
        ${l(t)}::-webkit-scrollbar {
            display: none;
        }
    `)}
    
    ${l(n?g`
          ${l(t)}::-webkit-scrollbar {
              display: none;
          }
    `:"")}
`,ut=dt(":host");async function ht(t=i.light,n=h.community){document.head.appendChild(V),document.head.appendChild(L),k(it()),k(lt),k(ut),await M(t,n)}function Vt(){return l(`linear-gradient(90deg, ${l(Z.join(","))})`)}var I=class extends q{render(){return Q`<slot></slot>`}};I.tagName="inch-theme-embedded-container";I=ot([z(I.tagName)],I);var Lt=class{constructor(){this.mainColorSettings=new D("main-color-name",i.systemSync),this.brandColorSettings=new D("brand-color-name",h.community)}getActiveMainColor(){return this.mainColorSettings.value??i.systemSync}getActiveBrandColor(){return this.brandColorSettings.value??h.community}async init(){const t=this.getActiveMainColor(),n=this.getActiveBrandColor();await ht(t,n)}async onChangeTheme(t,n,e){return this.mainColorSettings.setValue(t),this.brandColorSettings.setValue(n),await M(t,n,e)}async onChangeMainColor(t,n){const e=this.getActiveBrandColor();await this.onChangeTheme(t,e,n)}async onChangeBrandColor(t,n){const e=this.getActiveMainColor();await this.onChangeTheme(e,t,n)}},Ht=class{async init(t){}async onChangeTheme(t,n,e){throw new Error("ThemeEmbeddedController not support onChangeTheme")}async onChangeMainColor(t,n){throw new Error("ThemeEmbeddedController not support onChangeMainColor")}async onChangeBrandColor(t,n){throw new Error("ThemeEmbeddedController not support onChangeBrandColor")}getActiveBrandColor(){throw new Error("ThemeEmbeddedController not support getActiveBrandColor")}getActiveMainColor(){throw new Error("ThemeEmbeddedController not support getActiveMainColor")}},ft={prefixName:"",animationDuration:"2s",animationDelay:"0s"},jt=t=>{const n={...ft,...t},e=["skeleton",n.prefixName].filter(Boolean).join("-");return g`
      .${l(e)} {
          position: relative;
          overflow: hidden;
          color: transparent;
      }

      .${l(e)}::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 1;
          transform: translateX(-110%);
          opacity: .5;
          background-image: linear-gradient(
                  90deg,
                  var(--primary-1) 0,
                  var(--primary-5) 50%,
                  var(--primary-1) 100%
          );
          animation: shimmer ${l(n.animationDuration)} infinite;
          animation-delay: ${l(n.animationDelay)};
          content: '';
      }

      @keyframes shimmer {
          100% {
              transform: translateX(110%);
          }
      }

  `};export{Lt as ThemeController,I as ThemeEmbeddedContainerElement,Ht as ThemeEmbeddedController,At as applyColorBrightness,It as blendColors,st as brandColorMap,it as fontStyle,mt as getBrowserMetaColor,kt as getColorFromString,Rt as getCssValue,Vt as getRainbowGradient,Tt as getRandomBrightColor,dt as getScrollbarStyle,Ft as getThemeChange,E as hexToRGBA,$t as interpolateColorRange,C as mainColorMap,Bt as makeColorSchema,A as rainbowColors,St as rainbowRandomColors,Z as rainbowRandomColorsInterpolate,Et as rgbStrToHex,b as rgbToHex,Mt as rgbaStrToHex,ut as scrollbarStyle,Dt as setBrowserMetaColorFilter,xt as setEmbeddedMode,jt as skeletonStyle,M as themeChange,Pt as themeChangeBrandColor,Ot as themeChangeMainColor,ht as themeInit,nt as transformColor};
//# sourceMappingURL=index.esm-CH2W14bC.js.map
