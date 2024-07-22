const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dark.style-UM7ZMMAJ-DPFgL8gz.js","assets/index-CnDYm1RO.js","assets/dark-blue.style-RCRIYV56-BiEC3E3z.js","assets/light.style-BQKHWKWO-By9F2OJ6.js","assets/light-blue.style-W6OESTNI-DuREN_Ti.js","assets/community.style-2325ZA4E-BWjk0S7u.js","assets/index.esm-drfqir4P.js","assets/index.esm-DfotAdpM.js","assets/combineLatest-Cx3jWXTV.js","assets/asap-BqWvnQ_m.js","assets/rainbow.style-KL6EELJC-BAVOnHYv.js","assets/random.style-OYX462PK-662l_9El.js","assets/orange.style-Z7PJ5G6E-7mK4PMPD.js","assets/violet.style-SHQNUURR-BYx0ZqSu.js"])))=>i.map(i=>d[i]);
import{r as c,i as h,_ as m}from"./index-CnDYm1RO.js";import{m as L,F as _,G as M,D as B}from"./index.esm-drfqir4P.js";import{R as H,B as G,M as j}from"./index.esm-DfotAdpM.js";import"./combineLatest-Cx3jWXTV.js";import"./asap-BqWvnQ_m.js";function W(t){for(let n=t.length-1;n>0;n--){const r=Math.floor(Math.random()*(n+1));[t[n],t[r]]=[t[r],t[n]]}return t}var I=["#FF0000","#FF7F00","#ffd500","#40ff00","#0000FF","#37009e","#8B00FF"],ut=W(I),R=X(I,I.length/2),z=[...R,...R.reverse()];function p(t){const n=parseInt(t.slice(1),16),r=n>>16&255,e=n>>8&255,o=n&255;return[r,e,o]}function T(t){let n=0,r=0,e=0,o=1;return t.length==4||t.length==5?(n=parseInt(t[1]+t[1],16),r=parseInt(t[2]+t[2],16),e=parseInt(t[3]+t[3],16),t.length==5&&(o=parseInt(t[4]+t[4],16)/255)):(t.length==7||t.length==9)&&(n=parseInt(t[1]+t[2],16),r=parseInt(t[3]+t[4],16),e=parseInt(t[5]+t[6],16),t.length==9&&(o=parseInt(t[7]+t[8],16)/255)),[n,r,e,o]}function f(t,n,r){return"#"+((1<<24)+(t<<16)+(n<<8)+r).toString(16).slice(1)}function A(t,n,r,e){const o=t.toString(16).padStart(2,"0"),a=n.toString(16).padStart(2,"0"),l=r.toString(16).padStart(2,"0"),i=e.toString(16).padStart(2,"0");return`#${o}${a}${l}${i}`}function mt(t){const n=t.match(/\d+(\.\d+)?/g);if(n===null||n.length!==4)throw new Error("Invalid rgba string");const r=parseInt(n[0]),e=parseInt(n[1]),o=parseInt(n[2]),a=Math.round(parseFloat(n[3])*255);return A(r,e,o,a)}function dt(t){const n=t.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+)%?)?\)/);if(!n)throw new Error("Invalid rgba format.");const r=parseInt(n[1]),e=parseInt(n[2]),o=parseInt(n[3]);return f(r,e,o)}function ft(t,n){const r=T(t+"ff"),e=T(n),o=Math.round((1-e[3])*r[0]+e[3]*e[0]),a=Math.round((1-e[3])*r[1]+e[3]*e[1]),l=Math.round((1-e[3])*r[2]+e[3]*e[2]),i=r[3];return A(o,a,l,i)}function g(t,n,r){return Math.round(t+(n-t)*r)}function Q(t,n,r){const[e,o,a]=p(t),[l,i,s]=p(n),u=[];for(let d=0;d<=r;d++){const b=d/r,v=g(e,l,b),P=g(o,i,b),V=g(a,s,b);u.push(f(v,P,V))}return u}function X(t,n){const r=[];for(let e=0;e<t.length-1;e++){const o=Q(t[e],t[e+1],n);r.push(...o.slice(0,-1))}return r.push(t[t.length-1]),r}function ht(t,n,r,e,o){const a=p(t),l=p(n),i=(o-r)/(e-r),s=g(a[0],l[0],i),u=g(a[1],l[1],i),d=g(a[2],l[2],i);return f(s,u,d)}function x(t,n=100){const[r,e,o]=p(t);return c(`rgba(${r}, ${e}, ${o}, 0.${n})`)}function Y(t){t=t.replace(/^#/,"");const n=parseInt(t,16);let r=n>>16&255,e=n>>8&255,o=n&255;const a=-32,l=-32,i=-32,s=u=>Math.max(0,Math.min(255,u));return r=s(r+a),e=s(e+l),o=s(o+i),c(f(r,e,o))}function gt(){const r=[Math.floor(Math.random()*168+32),Math.floor(Math.random()*168+32),200];return r.sort(()=>Math.random()-.5),f(r[0],r[1],r[2])}function pt(t){function n(i){let s=0;for(let u=0;u<i.length;u++)s=i.charCodeAt(u)+((s<<5)-s);return s}function r(i){const d=(i&255)%168+32,b=(i>>8&255)%168+32,v=(i>>16&255)%168+32;return{r:d,g:b,b:v}}const e=n(t),{r:o,g:a,b:l}=r(e);return f(o,a,l)}function bt(t,n){let[r,e,o]=p(t);return r=Math.min(255,Math.max(0,r*n)),e=Math.min(255,Math.max(0,e*n)),o=Math.min(255,Math.max(0,o*n)),f(Math.round(r),Math.round(e),Math.round(o))}function wt(t){return h`
      :root {
          --primary: ${c(t)};
          --primary-50: ${x(t,50)};
          --primary-12: ${x(t,12)};
          --primary-hover: ${Y(t)};
          --secondary: ${c(t)}1f;
          --secondary-hover: ${c(t)}3d;
      }
  `}var q=new RegExp("(?<=var\\().*?(?=\\))");function yt(t){const n=t.match(q),r=n?n[0]:t;return getComputedStyle(document.documentElement).getPropertyValue(r).trim()}var C=document.createElement("style"),D=document.createElement("style"),J=h`

    @font-face { font-family: "Inter"; font-style: normal; font-weight: 500; font-display: swap; src: url("fonts/Inter/Inter-Medium.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 600; font-display: swap; src: url("fonts/Inter/Inter-SemiBold.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 400; font-display: swap; src: url("fonts/Inter/Inter-Regular.woff2") format("woff2"); }

    * {
        font-family: 'Inter', sans-serif;
        font-style: normal;
    }

`,K=h`
    
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

`,U=(t=>(t[t.systemSync=0]="systemSync",t[t.dark=1]="dark",t[t.darkBlue=2]="darkBlue",t[t.light=3]="light",t[t.lightBlue=4]="lightBlue",t))(U||{}),O=(t=>(t[t.community=0]="community",t[t.random=1]="random",t[t.rainbow=2]="rainbow",t[t.orange=3]="orange",t[t.violet=4]="violet",t))(O||{}),w={0:()=>N(),1:()=>m(()=>import("./dark.style-UM7ZMMAJ-DPFgL8gz.js"),__vite__mapDeps([0,1])).then(t=>t.themeDark),2:()=>m(()=>import("./dark-blue.style-RCRIYV56-BiEC3E3z.js"),__vite__mapDeps([2,1])).then(t=>t.themeDarkBlue),3:()=>m(()=>import("./light.style-BQKHWKWO-By9F2OJ6.js"),__vite__mapDeps([3,1])).then(t=>t.themeLight),4:()=>m(()=>import("./light-blue.style-W6OESTNI-DuREN_Ti.js"),__vite__mapDeps([4,1])).then(t=>t.themeLightBlue)},Z={0:()=>m(()=>import("./community.style-2325ZA4E-BWjk0S7u.js"),__vite__mapDeps([5,1,6,7,8,9])).then(t=>t.communityStyle),2:()=>m(()=>import("./rainbow.style-KL6EELJC-BAVOnHYv.js"),__vite__mapDeps([10,1,6,7,8,9])).then(t=>t.rainbowStyle),1:()=>m(()=>import("./random.style-OYX462PK-662l_9El.js"),__vite__mapDeps([11,1,6,7,8,9])).then(t=>t.randomStyle),3:()=>m(()=>import("./orange.style-Z7PJ5G6E-7mK4PMPD.js"),__vite__mapDeps([12,1,6,7,8,9])).then(t=>t.orangeStyle),4:()=>m(()=>import("./violet.style-SHQNUURR-BYx0ZqSu.js"),__vite__mapDeps([13,1,6,7,8,9])).then(t=>t.violetStyle)};function N(){var t,n;return window.matchMedia("(prefers-color-scheme: dark)").matches?(t=window==null?void 0:window.ethereum)!=null&&t.isOneInchIOSWallet?w[2]():w[1]():(n=window==null?void 0:window.ethereum)!=null&&n.isOneInchIOSWallet?w[4]():w[3]()}var $,k,S={0:()=>tt(),3:()=>"#f1f1f1",4:()=>"#f1f1f1",1:()=>"#0e0e0e",2:()=>"#0e0e0e"},E=window.matchMedia("(prefers-color-scheme: dark)"),F=new H(1);function tt(){return E.matches?S[1]():S[3]()}async function vt(t,n){return await y(t,k,n)}async function _t(t,n){return await y($,t,n)}function It(){return F}E.onchange=async()=>{$===0&&await y(0,k)};function nt(t){return t===0?E.matches:t===1||t===2}async function y(t,n,r){const e=async()=>{const o=await w[t](),a=await Z[n]();M(C,o),M(D,a),B(S[t]()),$=t,k=n,document.documentElement.setAttribute("theme",nt(t)?"dark":"light"),document.documentElement.setAttribute("brand-color",O[n]),F.next({mainColor:t,brandColor:n})};if(r&&"startViewTransition"in document){const o=r.clientX,a=r.clientY,l=window.innerWidth-a,i=window.innerHeight-o,s=Math.hypot(Math.max(a,l),Math.max(o,i));document.startViewTransition(()=>{e()}).ready.then(()=>{document.documentElement.animate({clipPath:[`circle(0px at ${o}px ${a}px)`,`circle(${s}px at ${o}px ${a}px)`]},{duration:600,easing:"ease-in-out",pseudoElement:"::view-transition-new(root)"})});return}await e()}var rt=(t,n)=>h`
    
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
    
    ${L(h`
        ${c(t)}::-webkit-scrollbar {
            display: none;
        }
    `)}
    
    ${c(n?h`
          ${c(t)}::-webkit-scrollbar {
              display: none;
          }
    `:"")}
`,et=rt(":host");async function ot(t=3,n=0){document.head.appendChild(C),document.head.appendChild(D),_(J),_(K),_(et),await y(t,n)}function St(){return c(`linear-gradient(90deg, ${c(z.join(","))})`)}var $t=class{async init(t){await ot(j.systemSync,G.random)}async themeChange(t,n,r){return await y(t,n,r)}};export{O as BrandColors,U as MainColors,$t as ThemeController,bt as applyColorBrightness,ft as blendColors,tt as getBrowserMetaColor,pt as getColorFromString,yt as getCssValue,St as getRainbowGradient,gt as getRandomBrightColor,rt as getScrollbarStyle,It as getThemeChange,x as hexToRGBA,ht as interpolateColorRange,wt as makeColorSchema,I as rainbowColors,ut as rainbowRandomColors,z as rainbowRandomColorsInterpolate,dt as rgbStrToHex,f as rgbToHex,mt as rgbaStrToHex,et as scrollbarStyle,y as themeChange,_t as themeChangeBrandColor,vt as themeChangeMainColor,ot as themeInit,Y as transformColor};
//# sourceMappingURL=index.esm-DteWRwlU.js.map
