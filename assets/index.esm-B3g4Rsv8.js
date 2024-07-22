const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dark.style-UM7ZMMAJ-Bvu5nXzR.js","assets/index-BluBRmZF.js","assets/dark-blue.style-RCRIYV56-DAY1ciOm.js","assets/light.style-BQKHWKWO-PjY55Uda.js","assets/light-blue.style-W6OESTNI-DmdV5t7K.js","assets/community.style-2325ZA4E-DeNRg-o_.js","assets/index.esm-DfotAdpM.js","assets/index.esm-CIcHJF57.js","assets/combineLatest-Cx3jWXTV.js","assets/asap-BqWvnQ_m.js","assets/rainbow.style-KL6EELJC-CbS8dnj9.js","assets/random.style-OYX462PK-DzkbOfZ1.js","assets/orange.style-Z7PJ5G6E-BkTIoc_I.js","assets/violet.style-SHQNUURR-Am2ybq4D.js"])))=>i.map(i=>d[i]);
import{i as p,r as s,_ as d}from"./index-BluBRmZF.js";import{M as a,B as f,R as L}from"./index.esm-DfotAdpM.js";import{F as R,D as H,m as G,G as S}from"./index.esm-CIcHJF57.js";import"./combineLatest-Cx3jWXTV.js";import"./asap-BqWvnQ_m.js";function j(t){for(let n=t.length-1;n>0;n--){const r=Math.floor(Math.random()*(n+1));[t[n],t[r]]=[t[r],t[n]]}return t}var M=["#FF0000","#FF7F00","#ffd500","#40ff00","#0000FF","#37009e","#8B00FF"],st=j(M),T=Q(M,M.length/2),W=[...T,...T.reverse()];function w(t){const n=parseInt(t.slice(1),16),r=n>>16&255,o=n>>8&255,e=n&255;return[r,o,e]}function x(t){let n=0,r=0,o=0,e=1;return t.length==4||t.length==5?(n=parseInt(t[1]+t[1],16),r=parseInt(t[2]+t[2],16),o=parseInt(t[3]+t[3],16),t.length==5&&(e=parseInt(t[4]+t[4],16)/255)):(t.length==7||t.length==9)&&(n=parseInt(t[1]+t[2],16),r=parseInt(t[3]+t[4],16),o=parseInt(t[5]+t[6],16),t.length==9&&(e=parseInt(t[7]+t[8],16)/255)),[n,r,o,e]}function g(t,n,r){return"#"+((1<<24)+(t<<16)+(n<<8)+r).toString(16).slice(1)}function A(t,n,r,o){const e=t.toString(16).padStart(2,"0"),i=n.toString(16).padStart(2,"0"),c=r.toString(16).padStart(2,"0"),l=o.toString(16).padStart(2,"0");return`#${e}${i}${c}${l}`}function ct(t){const n=t.match(/\d+(\.\d+)?/g);if(n===null||n.length!==4)throw new Error("Invalid rgba string");const r=parseInt(n[0]),o=parseInt(n[1]),e=parseInt(n[2]),i=Math.round(parseFloat(n[3])*255);return A(r,o,e,i)}function ut(t){const n=t.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+)%?)?\)/);if(!n)throw new Error("Invalid rgba format.");const r=parseInt(n[1]),o=parseInt(n[2]),e=parseInt(n[3]);return g(r,o,e)}function mt(t,n){const r=x(t+"ff"),o=x(n),e=Math.round((1-o[3])*r[0]+o[3]*o[0]),i=Math.round((1-o[3])*r[1]+o[3]*o[1]),c=Math.round((1-o[3])*r[2]+o[3]*o[2]),l=r[3];return A(e,i,c,l)}function b(t,n,r){return Math.round(t+(n-t)*r)}function z(t,n,r){const[o,e,i]=w(t),[c,l,u]=w(n),m=[];for(let h=0;h<=r;h++){const y=h/r,I=b(o,c,y),P=b(e,l,y),V=b(i,u,y);m.push(g(I,P,V))}return m}function Q(t,n){const r=[];for(let o=0;o<t.length-1;o++){const e=z(t[o],t[o+1],n);r.push(...e.slice(0,-1))}return r.push(t[t.length-1]),r}function dt(t,n,r,o,e){const i=w(t),c=w(n),l=(e-r)/(o-r),u=b(i[0],c[0],l),m=b(i[1],c[1],l),h=b(i[2],c[2],l);return g(u,m,h)}function B(t,n=100){const[r,o,e]=w(t);return s(`rgba(${r}, ${o}, ${e}, 0.${n})`)}function X(t){t=t.replace(/^#/,"");const n=parseInt(t,16);let r=n>>16&255,o=n>>8&255,e=n&255;const i=-32,c=-32,l=-32,u=m=>Math.max(0,Math.min(255,m));return r=u(r+i),o=u(o+c),e=u(e+l),s(g(r,o,e))}function ft(){const r=[Math.floor(Math.random()*168+32),Math.floor(Math.random()*168+32),200];return r.sort(()=>Math.random()-.5),g(r[0],r[1],r[2])}function ht(t){function n(l){let u=0;for(let m=0;m<l.length;m++)u=l.charCodeAt(m)+((u<<5)-u);return u}function r(l){const h=(l&255)%168+32,y=(l>>8&255)%168+32,I=(l>>16&255)%168+32;return{r:h,g:y,b:I}}const o=n(t),{r:e,g:i,b:c}=r(o);return g(e,i,c)}function gt(t,n){let[r,o,e]=w(t);return r=Math.min(255,Math.max(0,r*n)),o=Math.min(255,Math.max(0,o*n)),e=Math.min(255,Math.max(0,e*n)),g(Math.round(r),Math.round(o),Math.round(e))}function pt(t){return p`
      :root {
          --primary: ${s(t)};
          --primary-50: ${B(t,50)};
          --primary-12: ${B(t,12)};
          --primary-hover: ${X(t)};
          --secondary: ${s(t)}1f;
          --secondary-hover: ${s(t)}3d;
      }
  `}var Y=new RegExp("(?<=var\\().*?(?=\\))");function bt(t){const n=t.match(Y),r=n?n[0]:t;return getComputedStyle(document.documentElement).getPropertyValue(r).trim()}var D=document.createElement("style"),O=document.createElement("style"),q=p`

    @font-face { font-family: "Inter"; font-style: normal; font-weight: 500; font-display: swap; src: url("fonts/Inter/Inter-Medium.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 600; font-display: swap; src: url("fonts/Inter/Inter-SemiBold.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 400; font-display: swap; src: url("fonts/Inter/Inter-Regular.woff2") format("woff2"); }

    * {
        font-family: 'Inter', sans-serif;
        font-style: normal;
    }

`,J=p`
    
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

`,v={[a.systemSync]:()=>U(),[a.dark]:()=>d(()=>import("./dark.style-UM7ZMMAJ-Bvu5nXzR.js"),__vite__mapDeps([0,1])).then(t=>t.themeDark),[a.darkBlue]:()=>d(()=>import("./dark-blue.style-RCRIYV56-DAY1ciOm.js"),__vite__mapDeps([2,1])).then(t=>t.themeDarkBlue),[a.light]:()=>d(()=>import("./light.style-BQKHWKWO-PjY55Uda.js"),__vite__mapDeps([3,1])).then(t=>t.themeLight),[a.lightBlue]:()=>d(()=>import("./light-blue.style-W6OESTNI-DmdV5t7K.js"),__vite__mapDeps([4,1])).then(t=>t.themeLightBlue)},K={[f.community]:()=>d(()=>import("./community.style-2325ZA4E-DeNRg-o_.js"),__vite__mapDeps([5,1,6,7,8,9])).then(t=>t.communityStyle),[f.rainbow]:()=>d(()=>import("./rainbow.style-KL6EELJC-CbS8dnj9.js"),__vite__mapDeps([10,1,6,7,8,9])).then(t=>t.rainbowStyle),[f.random]:()=>d(()=>import("./random.style-OYX462PK-DzkbOfZ1.js"),__vite__mapDeps([11,1,6,7,8,9])).then(t=>t.randomStyle),[f.orange]:()=>d(()=>import("./orange.style-Z7PJ5G6E-BkTIoc_I.js"),__vite__mapDeps([12,1,6,7,8,9])).then(t=>t.orangeStyle),[f.violet]:()=>d(()=>import("./violet.style-SHQNUURR-Am2ybq4D.js"),__vite__mapDeps([13,1,6,7,8,9])).then(t=>t.violetStyle)};function U(){var t,n;return window.matchMedia("(prefers-color-scheme: dark)").matches?(t=window==null?void 0:window.ethereum)!=null&&t.isOneInchIOSWallet?v[a.darkBlue]():v[a.dark]():(n=window==null?void 0:window.ethereum)!=null&&n.isOneInchIOSWallet?v[a.lightBlue]():v[a.light]()}var C,$,k={[a.systemSync]:()=>Z(),[a.light]:()=>"#f1f1f1",[a.lightBlue]:()=>"#f1f1f1",[a.dark]:()=>"#0e0e0e",[a.darkBlue]:()=>"#0e0e0e"},E=window.matchMedia("(prefers-color-scheme: dark)"),F=new L(1);function Z(){return E.matches?k[a.dark]():k[a.light]()}async function wt(t,n){return await _(t,$,n)}async function yt(t,n){return await _(C,t,n)}function vt(){return F}E.onchange=async()=>{C===a.systemSync&&await _(a.systemSync,$)};function N(t){return t===a.systemSync?E.matches:t===a.dark||t===a.darkBlue}async function _(t,n,r){const o=async()=>{const e=await v[t](),i=await K[n]();R(D,e),R(O,i),H(k[t]()),C=t,$=n,document.documentElement.setAttribute("theme",N(t)?"dark":"light"),document.documentElement.setAttribute("brand-color",f[n]),F.next({mainColor:t,brandColor:n})};if(r&&"startViewTransition"in document){const e=r.clientX,i=r.clientY,c=window.innerWidth-i,l=window.innerHeight-e,u=Math.hypot(Math.max(i,c),Math.max(e,l));document.startViewTransition(()=>{o()}).ready.then(()=>{document.documentElement.animate({clipPath:[`circle(0px at ${e}px ${i}px)`,`circle(${u}px at ${e}px ${i}px)`]},{duration:600,easing:"ease-in-out",pseudoElement:"::view-transition-new(root)"})});return}await o()}var tt=(t,n)=>p`
    
    ${s(t)} {
        overflow: auto;
        touch-action: pan-y;
        overscroll-behavior: none;
        scrollbar-color: var(--primary) transparent;
        scrollbar-width: ${s(n?"none":"thin")};
        scrollbar-gutter: stable;
    }

    /* width */
    ${s(t)}::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }

    /* Track */
    ${s(t)}::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Handle */
    ${s(t)}::-webkit-scrollbar-thumb {
        background: var(--primary);
        border-radius: 4px;
    }

    /* Handle on hover */
    ${s(t)}::-webkit-scrollbar-thumb:hover {
        background: var(--primary-hover);
    }
    
    ${G(p`
        ${s(t)}::-webkit-scrollbar {
            display: none;
        }
    `)}
    
    ${s(n?p`
          ${s(t)}::-webkit-scrollbar {
              display: none;
          }
    `:"")}
`,nt=tt(":host");async function rt(t=a.light,n=f.community){document.head.appendChild(D),document.head.appendChild(O),S(q),S(J),S(nt),await _(t,n)}function _t(){return s(`linear-gradient(90deg, ${s(W.join(","))})`)}var It=class{async init(t){await rt(a.systemSync,f.random)}async themeChange(t,n,r){return await _(t,n,r)}};export{It as ThemeController,gt as applyColorBrightness,mt as blendColors,Z as getBrowserMetaColor,ht as getColorFromString,bt as getCssValue,_t as getRainbowGradient,ft as getRandomBrightColor,tt as getScrollbarStyle,vt as getThemeChange,B as hexToRGBA,dt as interpolateColorRange,pt as makeColorSchema,M as rainbowColors,st as rainbowRandomColors,W as rainbowRandomColorsInterpolate,ut as rgbStrToHex,g as rgbToHex,ct as rgbaStrToHex,nt as scrollbarStyle,_ as themeChange,yt as themeChangeBrandColor,wt as themeChangeMainColor,rt as themeInit,X as transformColor};
//# sourceMappingURL=index.esm-B3g4Rsv8.js.map
