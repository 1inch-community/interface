const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/import-wrapper-7PBGHSLX-BP65Uu9B.js","assets/startWith-CUA0N737.js","assets/index-DyOQYfny.js","assets/index.esm-COc-PyqV.js"])))=>i.map(i=>d[i]);
import{q as Vt,A as Wt,O as At,w as _t,b as Ut,x as qt,y as Xt,i as bt,z as Ht,o as ct,c as tt,t as Jt}from"./startWith-CUA0N737.js";import{_ as Qt}from"./index-DyOQYfny.js";import{storage as It,JsonParser as Zt}from"./index.esm-COc-PyqV.js";var xt=new Vt(Wt),tr=xt,rr=new At(function(s){return s.complete()});function Br(){for(var s=[],c=0;c<arguments.length;c++)s[c]=arguments[c];var l=_t(s);return Ut(s,l)}function er(s){return s instanceof Date&&!isNaN(s)}function Er(s,c,l){s===void 0&&(s=0),l===void 0&&(l=tr);var p=-1;return c!=null&&(qt(c)?l=c:p=c),new At(function(h){var y=er(s)?+s-l.now():s;y<0&&(y=0);var o=0;return l.schedule(function(){h.closed||(h.next(o++),0<=p?this.schedule(void 0,p):h.complete())},y)})}function Ir(){for(var s=[],c=0;c<arguments.length;c++)s[c]=arguments[c];var l=_t(s),p=Xt(s,1/0),h=s;return h.length?h.length===1?bt(h[0]):Ht(p)(Ut(h,l)):rr}function Ar(s,c){return c===void 0&&(c=xt),ct(function(l,p){var h=null,y=null,o=null,E=function(){if(h){h.unsubscribe(),h=null;var U=y;y=null,p.next(U)}};function T(){var U=o+s,m=c.now();if(m<U){h=this.schedule(void 0,U-m),p.add(h);return}E()}l.subscribe(tt(p,function(U){y=U,o=c.now(),h||(h=c.schedule(T,s),p.add(h))},function(){E(),p.complete()},void 0,function(){y=h=null}))})}function _r(s,c){return c===void 0&&(c=Jt),s=s??ir,ct(function(l,p){var h,y=!0;l.subscribe(tt(p,function(o){var E=c(o);(y||!s(h,E))&&(y=!1,h=E,p.next(o))}))})}function ir(s,c){return s===c}function Ur(s,c){return ct(function(l,p){var h=null,y=0,o=!1,E=function(){return o&&!h&&p.complete()};l.subscribe(tt(p,function(T){h==null||h.unsubscribe();var U=0,m=y++;bt(s(T,m)).subscribe(h=tt(p,function(b){return p.next(c?c(T,b,m,U++):b)},function(){h=null,E()}))},function(){o=!0,E()}))})}var nr=(s=>(s[s.eth=1]="eth",s[s.bnb=56]="bnb",s[s.matic=137]="matic",s[s.op=10]="op",s[s.arbitrum=42161]="arbitrum",s[s.gnosis=100]="gnosis",s[s.avalanche=43114]="avalanche",s[s.fantom=250]="fantom",s[s.aurora=1313161554]="aurora",s[s.klaytn=8217]="klaytn",s[s.zkSyncEra=324]="zkSyncEra",s))(nr||{}),or=Object.create,Tt=Object.defineProperty,sr=Object.getOwnPropertyDescriptor,at=Object.getOwnPropertyNames,ur=Object.getPrototypeOf,cr=Object.prototype.hasOwnProperty,X=(s,c)=>function(){return s&&(c=(0,s[at(s)[0]])(s=0)),c},br=(s,c)=>function(){return c||(0,s[at(s)[0]])((c={exports:{}}).exports,c),c.exports},ar=(s,c,l,p)=>{if(c&&typeof c=="object"||typeof c=="function")for(let h of at(c))!cr.call(s,h)&&h!==l&&Tt(s,h,{get:()=>c[h],enumerable:!(p=sr(c,h))||p.enumerable});return s},xr=(s,c,l)=>(l=s!=null?or(ur(s)):{},ar(Tt(l,"default",{value:s,enumerable:!0}),s)),F=X({"<define:__environment__>"(){}}),K=X({"node_modules/.pnpm/esbuild-plugin-polyfill-node@0.3.0_esbuild@0.23.0/node_modules/esbuild-plugin-polyfill-node/polyfills/__dirname.js"(){}});function hr(){if(ot)return q;ot=!0,q.byteLength=E,q.toByteArray=U,q.fromByteArray=k;for(var s=[],c=[],l=typeof Uint8Array<"u"?Uint8Array:Array,p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",h=0,y=p.length;h<y;++h)s[h]=p[h],c[p.charCodeAt(h)]=h;c[45]=62,c[95]=63;function o(f){var d=f.length;if(d%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var B=f.indexOf("=");B===-1&&(B=d);var R=B===d?0:4-B%4;return[B,R]}function E(f){var d=o(f),B=d[0],R=d[1];return(B+R)*3/4-R}function T(f,d,B){return(d+B)*3/4-B}function U(f){var d,B=o(f),R=B[0],P=B[1],x=new l(T(f,R,P)),v=0,L=P>0?R-4:R,M;for(M=0;M<L;M+=4)d=c[f.charCodeAt(M)]<<18|c[f.charCodeAt(M+1)]<<12|c[f.charCodeAt(M+2)]<<6|c[f.charCodeAt(M+3)],x[v++]=d>>16&255,x[v++]=d>>8&255,x[v++]=d&255;return P===2&&(d=c[f.charCodeAt(M)]<<2|c[f.charCodeAt(M+1)]>>4,x[v++]=d&255),P===1&&(d=c[f.charCodeAt(M)]<<10|c[f.charCodeAt(M+1)]<<4|c[f.charCodeAt(M+2)]>>2,x[v++]=d>>8&255,x[v++]=d&255),x}function m(f){return s[f>>18&63]+s[f>>12&63]+s[f>>6&63]+s[f&63]}function b(f,d,B){for(var R,P=[],x=d;x<B;x+=3)R=(f[x]<<16&16711680)+(f[x+1]<<8&65280)+(f[x+2]&255),P.push(m(R));return P.join("")}function k(f){for(var d,B=f.length,R=B%3,P=[],x=16383,v=0,L=B-R;v<L;v+=x)P.push(b(f,v,v+x>L?L:v+x));return R===1?(d=f[B-1],P.push(s[d>>2]+s[d<<4&63]+"==")):R===2&&(d=(f[B-2]<<8)+f[B-1],P.push(s[d>>10]+s[d>>4&63]+s[d<<2&63]+"=")),P.join("")}return q}function lr(){return st||(st=!0,Q.read=function(s,c,l,p,h){var y,o,E=h*8-p-1,T=(1<<E)-1,U=T>>1,m=-7,b=l?h-1:0,k=l?-1:1,f=s[c+b];for(b+=k,y=f&(1<<-m)-1,f>>=-m,m+=E;m>0;y=y*256+s[c+b],b+=k,m-=8);for(o=y&(1<<-m)-1,y>>=-m,m+=p;m>0;o=o*256+s[c+b],b+=k,m-=8);if(y===0)y=1-U;else{if(y===T)return o?NaN:(f?-1:1)*(1/0);o=o+Math.pow(2,p),y=y-U}return(f?-1:1)*o*Math.pow(2,y-p)},Q.write=function(s,c,l,p,h,y){var o,E,T,U=y*8-h-1,m=(1<<U)-1,b=m>>1,k=h===23?Math.pow(2,-24)-Math.pow(2,-77):0,f=p?0:y-1,d=p?1:-1,B=c<0||c===0&&1/c<0?1:0;for(c=Math.abs(c),isNaN(c)||c===1/0?(E=isNaN(c)?1:0,o=m):(o=Math.floor(Math.log(c)/Math.LN2),c*(T=Math.pow(2,-o))<1&&(o--,T*=2),o+b>=1?c+=k/T:c+=k*Math.pow(2,1-b),c*T>=2&&(o++,T/=2),o+b>=m?(E=0,o=m):o+b>=1?(E=(c*T-1)*Math.pow(2,h),o=o+b):(E=c*Math.pow(2,b-1)*Math.pow(2,h),o=0));h>=8;s[l+f]=E&255,f+=d,E/=256,h-=8);for(o=o<<h|E,U+=h;U>0;s[l+f]=o&255,f+=d,o/=256,U-=8);s[l+f-d]|=B*128}),Q}function pr(){if(ut)return $;ut=!0;const s=hr(),c=lr(),l=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;$.Buffer=o,$.SlowBuffer=P,$.INSPECT_MAX_BYTES=50;const p=2147483647;$.kMaxLength=p,o.TYPED_ARRAY_SUPPORT=h(),!o.TYPED_ARRAY_SUPPORT&&typeof console<"u"&&typeof console.error=="function"&&console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");function h(){try{const e=new Uint8Array(1),t={foo:function(){return 42}};return Object.setPrototypeOf(t,Uint8Array.prototype),Object.setPrototypeOf(e,t),e.foo()===42}catch{return!1}}Object.defineProperty(o.prototype,"parent",{enumerable:!0,get:function(){if(o.isBuffer(this))return this.buffer}}),Object.defineProperty(o.prototype,"offset",{enumerable:!0,get:function(){if(o.isBuffer(this))return this.byteOffset}});function y(e){if(e>p)throw new RangeError('The value "'+e+'" is invalid for option "size"');const t=new Uint8Array(e);return Object.setPrototypeOf(t,o.prototype),t}function o(e,t,r){if(typeof e=="number"){if(typeof t=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return m(e)}return E(e,t,r)}o.poolSize=8192;function E(e,t,r){if(typeof e=="string")return b(e,t);if(ArrayBuffer.isView(e))return f(e);if(e==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e);if(C(e,ArrayBuffer)||e&&C(e.buffer,ArrayBuffer)||typeof SharedArrayBuffer<"u"&&(C(e,SharedArrayBuffer)||e&&C(e.buffer,SharedArrayBuffer)))return d(e,t,r);if(typeof e=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');const i=e.valueOf&&e.valueOf();if(i!=null&&i!==e)return o.from(i,t,r);const n=B(e);if(n)return n;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof e[Symbol.toPrimitive]=="function")return o.from(e[Symbol.toPrimitive]("string"),t,r);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e)}o.from=function(e,t,r){return E(e,t,r)},Object.setPrototypeOf(o.prototype,Uint8Array.prototype),Object.setPrototypeOf(o,Uint8Array);function T(e){if(typeof e!="number")throw new TypeError('"size" argument must be of type number');if(e<0)throw new RangeError('The value "'+e+'" is invalid for option "size"')}function U(e,t,r){return T(e),e<=0?y(e):t!==void 0?typeof r=="string"?y(e).fill(t,r):y(e).fill(t):y(e)}o.alloc=function(e,t,r){return U(e,t,r)};function m(e){return T(e),y(e<0?0:R(e)|0)}o.allocUnsafe=function(e){return m(e)},o.allocUnsafeSlow=function(e){return m(e)};function b(e,t){if((typeof t!="string"||t==="")&&(t="utf8"),!o.isEncoding(t))throw new TypeError("Unknown encoding: "+t);const r=x(e,t)|0;let i=y(r);const n=i.write(e,t);return n!==r&&(i=i.slice(0,n)),i}function k(e){const t=e.length<0?0:R(e.length)|0,r=y(t);for(let i=0;i<t;i+=1)r[i]=e[i]&255;return r}function f(e){if(C(e,Uint8Array)){const t=new Uint8Array(e);return d(t.buffer,t.byteOffset,t.byteLength)}return k(e)}function d(e,t,r){if(t<0||e.byteLength<t)throw new RangeError('"offset" is outside of buffer bounds');if(e.byteLength<t+(r||0))throw new RangeError('"length" is outside of buffer bounds');let i;return t===void 0&&r===void 0?i=new Uint8Array(e):r===void 0?i=new Uint8Array(e,t):i=new Uint8Array(e,t,r),Object.setPrototypeOf(i,o.prototype),i}function B(e){if(o.isBuffer(e)){const t=R(e.length)|0,r=y(t);return r.length===0||e.copy(r,0,0,t),r}if(e.length!==void 0)return typeof e.length!="number"||it(e.length)?y(0):k(e);if(e.type==="Buffer"&&Array.isArray(e.data))return k(e.data)}function R(e){if(e>=p)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+p.toString(16)+" bytes");return e|0}function P(e){return+e!=e&&(e=0),o.alloc(+e)}o.isBuffer=function(t){return t!=null&&t._isBuffer===!0&&t!==o.prototype},o.compare=function(t,r){if(C(t,Uint8Array)&&(t=o.from(t,t.offset,t.byteLength)),C(r,Uint8Array)&&(r=o.from(r,r.offset,r.byteLength)),!o.isBuffer(t)||!o.isBuffer(r))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(t===r)return 0;let i=t.length,n=r.length;for(let u=0,a=Math.min(i,n);u<a;++u)if(t[u]!==r[u]){i=t[u],n=r[u];break}return i<n?-1:n<i?1:0},o.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},o.concat=function(t,r){if(!Array.isArray(t))throw new TypeError('"list" argument must be an Array of Buffers');if(t.length===0)return o.alloc(0);let i;if(r===void 0)for(r=0,i=0;i<t.length;++i)r+=t[i].length;const n=o.allocUnsafe(r);let u=0;for(i=0;i<t.length;++i){let a=t[i];if(C(a,Uint8Array))u+a.length>n.length?(o.isBuffer(a)||(a=o.from(a)),a.copy(n,u)):Uint8Array.prototype.set.call(n,a,u);else if(o.isBuffer(a))a.copy(n,u);else throw new TypeError('"list" argument must be an Array of Buffers');u+=a.length}return n};function x(e,t){if(o.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||C(e,ArrayBuffer))return e.byteLength;if(typeof e!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof e);const r=e.length,i=arguments.length>2&&arguments[2]===!0;if(!i&&r===0)return 0;let n=!1;for(;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return et(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return r*2;case"hex":return r>>>1;case"base64":return Et(e).length;default:if(n)return i?-1:et(e).length;t=(""+t).toLowerCase(),n=!0}}o.byteLength=x;function v(e,t,r){let i=!1;if((t===void 0||t<0)&&(t=0),t>this.length||((r===void 0||r>this.length)&&(r=this.length),r<=0)||(r>>>=0,t>>>=0,r<=t))return"";for(e||(e="utf8");;)switch(e){case"hex":return Nt(this,t,r);case"utf8":case"utf-8":return lt(this,t,r);case"ascii":return kt(this,t,r);case"latin1":case"binary":return Ct(this,t,r);case"base64":return Dt(this,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return Ot(this,t,r);default:if(i)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),i=!0}}o.prototype._isBuffer=!0;function L(e,t,r){const i=e[t];e[t]=e[r],e[r]=i}o.prototype.swap16=function(){const t=this.length;if(t%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let r=0;r<t;r+=2)L(this,r,r+1);return this},o.prototype.swap32=function(){const t=this.length;if(t%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let r=0;r<t;r+=4)L(this,r,r+3),L(this,r+1,r+2);return this},o.prototype.swap64=function(){const t=this.length;if(t%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let r=0;r<t;r+=8)L(this,r,r+7),L(this,r+1,r+6),L(this,r+2,r+5),L(this,r+3,r+4);return this},o.prototype.toString=function(){const t=this.length;return t===0?"":arguments.length===0?lt(this,0,t):v.apply(this,arguments)},o.prototype.toLocaleString=o.prototype.toString,o.prototype.equals=function(t){if(!o.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t?!0:o.compare(this,t)===0},o.prototype.inspect=function(){let t="";const r=$.INSPECT_MAX_BYTES;return t=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(t+=" ... "),"<Buffer "+t+">"},l&&(o.prototype[l]=o.prototype.inspect),o.prototype.compare=function(t,r,i,n,u){if(C(t,Uint8Array)&&(t=o.from(t,t.offset,t.byteLength)),!o.isBuffer(t))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof t);if(r===void 0&&(r=0),i===void 0&&(i=t?t.length:0),n===void 0&&(n=0),u===void 0&&(u=this.length),r<0||i>t.length||n<0||u>this.length)throw new RangeError("out of range index");if(n>=u&&r>=i)return 0;if(n>=u)return-1;if(r>=i)return 1;if(r>>>=0,i>>>=0,n>>>=0,u>>>=0,this===t)return 0;let a=u-n,w=i-r;const A=Math.min(a,w),I=this.slice(n,u),_=t.slice(r,i);for(let g=0;g<A;++g)if(I[g]!==_[g]){a=I[g],w=_[g];break}return a<w?-1:w<a?1:0};function M(e,t,r,i,n){if(e.length===0)return-1;if(typeof r=="string"?(i=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),r=+r,it(r)&&(r=n?0:e.length-1),r<0&&(r=e.length+r),r>=e.length){if(n)return-1;r=e.length-1}else if(r<0)if(n)r=0;else return-1;if(typeof t=="string"&&(t=o.from(t,i)),o.isBuffer(t))return t.length===0?-1:ht(e,t,r,i,n);if(typeof t=="number")return t=t&255,typeof Uint8Array.prototype.indexOf=="function"?n?Uint8Array.prototype.indexOf.call(e,t,r):Uint8Array.prototype.lastIndexOf.call(e,t,r):ht(e,[t],r,i,n);throw new TypeError("val must be string, number or Buffer")}function ht(e,t,r,i,n){let u=1,a=e.length,w=t.length;if(i!==void 0&&(i=String(i).toLowerCase(),i==="ucs2"||i==="ucs-2"||i==="utf16le"||i==="utf-16le")){if(e.length<2||t.length<2)return-1;u=2,a/=2,w/=2,r/=2}function A(_,g){return u===1?_[g]:_.readUInt16BE(g*u)}let I;if(n){let _=-1;for(I=r;I<a;I++)if(A(e,I)===A(t,_===-1?0:I-_)){if(_===-1&&(_=I),I-_+1===w)return _*u}else _!==-1&&(I-=I-_),_=-1}else for(r+w>a&&(r=a-w),I=r;I>=0;I--){let _=!0;for(let g=0;g<w;g++)if(A(e,I+g)!==A(t,g)){_=!1;break}if(_)return I}return-1}o.prototype.includes=function(t,r,i){return this.indexOf(t,r,i)!==-1},o.prototype.indexOf=function(t,r,i){return M(this,t,r,i,!0)},o.prototype.lastIndexOf=function(t,r,i){return M(this,t,r,i,!1)};function Rt(e,t,r,i){r=Number(r)||0;const n=e.length-r;i?(i=Number(i),i>n&&(i=n)):i=n;const u=t.length;i>u/2&&(i=u/2);let a;for(a=0;a<i;++a){const w=parseInt(t.substr(a*2,2),16);if(it(w))return a;e[r+a]=w}return a}function St(e,t,r,i){return Z(et(t,e.length-r),e,r,i)}function Mt(e,t,r,i){return Z(Kt(t),e,r,i)}function Pt(e,t,r,i){return Z(Et(t),e,r,i)}function vt(e,t,r,i){return Z(zt(t,e.length-r),e,r,i)}o.prototype.write=function(t,r,i,n){if(r===void 0)n="utf8",i=this.length,r=0;else if(i===void 0&&typeof r=="string")n=r,i=this.length,r=0;else if(isFinite(r))r=r>>>0,isFinite(i)?(i=i>>>0,n===void 0&&(n="utf8")):(n=i,i=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");const u=this.length-r;if((i===void 0||i>u)&&(i=u),t.length>0&&(i<0||r<0)||r>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");let a=!1;for(;;)switch(n){case"hex":return Rt(this,t,r,i);case"utf8":case"utf-8":return St(this,t,r,i);case"ascii":case"latin1":case"binary":return Mt(this,t,r,i);case"base64":return Pt(this,t,r,i);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return vt(this,t,r,i);default:if(a)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),a=!0}},o.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function Dt(e,t,r){return t===0&&r===e.length?s.fromByteArray(e):s.fromByteArray(e.slice(t,r))}function lt(e,t,r){r=Math.min(e.length,r);const i=[];let n=t;for(;n<r;){const u=e[n];let a=null,w=u>239?4:u>223?3:u>191?2:1;if(n+w<=r){let A,I,_,g;switch(w){case 1:u<128&&(a=u);break;case 2:A=e[n+1],(A&192)===128&&(g=(u&31)<<6|A&63,g>127&&(a=g));break;case 3:A=e[n+1],I=e[n+2],(A&192)===128&&(I&192)===128&&(g=(u&15)<<12|(A&63)<<6|I&63,g>2047&&(g<55296||g>57343)&&(a=g));break;case 4:A=e[n+1],I=e[n+2],_=e[n+3],(A&192)===128&&(I&192)===128&&(_&192)===128&&(g=(u&15)<<18|(A&63)<<12|(I&63)<<6|_&63,g>65535&&g<1114112&&(a=g))}}a===null?(a=65533,w=1):a>65535&&(a-=65536,i.push(a>>>10&1023|55296),a=56320|a&1023),i.push(a),n+=w}return Lt(i)}const pt=4096;function Lt(e){const t=e.length;if(t<=pt)return String.fromCharCode.apply(String,e);let r="",i=0;for(;i<t;)r+=String.fromCharCode.apply(String,e.slice(i,i+=pt));return r}function kt(e,t,r){let i="";r=Math.min(e.length,r);for(let n=t;n<r;++n)i+=String.fromCharCode(e[n]&127);return i}function Ct(e,t,r){let i="";r=Math.min(e.length,r);for(let n=t;n<r;++n)i+=String.fromCharCode(e[n]);return i}function Nt(e,t,r){const i=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>i)&&(r=i);let n="";for(let u=t;u<r;++u)n+=Yt[e[u]];return n}function Ot(e,t,r){const i=e.slice(t,r);let n="";for(let u=0;u<i.length-1;u+=2)n+=String.fromCharCode(i[u]+i[u+1]*256);return n}o.prototype.slice=function(t,r){const i=this.length;t=~~t,r=r===void 0?i:~~r,t<0?(t+=i,t<0&&(t=0)):t>i&&(t=i),r<0?(r+=i,r<0&&(r=0)):r>i&&(r=i),r<t&&(r=t);const n=this.subarray(t,r);return Object.setPrototypeOf(n,o.prototype),n};function S(e,t,r){if(e%1!==0||e<0)throw new RangeError("offset is not uint");if(e+t>r)throw new RangeError("Trying to access beyond buffer length")}o.prototype.readUintLE=o.prototype.readUIntLE=function(t,r,i){t=t>>>0,r=r>>>0,i||S(t,r,this.length);let n=this[t],u=1,a=0;for(;++a<r&&(u*=256);)n+=this[t+a]*u;return n},o.prototype.readUintBE=o.prototype.readUIntBE=function(t,r,i){t=t>>>0,r=r>>>0,i||S(t,r,this.length);let n=this[t+--r],u=1;for(;r>0&&(u*=256);)n+=this[t+--r]*u;return n},o.prototype.readUint8=o.prototype.readUInt8=function(t,r){return t=t>>>0,r||S(t,1,this.length),this[t]},o.prototype.readUint16LE=o.prototype.readUInt16LE=function(t,r){return t=t>>>0,r||S(t,2,this.length),this[t]|this[t+1]<<8},o.prototype.readUint16BE=o.prototype.readUInt16BE=function(t,r){return t=t>>>0,r||S(t,2,this.length),this[t]<<8|this[t+1]},o.prototype.readUint32LE=o.prototype.readUInt32LE=function(t,r){return t=t>>>0,r||S(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+this[t+3]*16777216},o.prototype.readUint32BE=o.prototype.readUInt32BE=function(t,r){return t=t>>>0,r||S(t,4,this.length),this[t]*16777216+(this[t+1]<<16|this[t+2]<<8|this[t+3])},o.prototype.readBigUInt64LE=N(function(t){t=t>>>0,V(t,"offset");const r=this[t],i=this[t+7];(r===void 0||i===void 0)&&H(t,this.length-8);const n=r+this[++t]*2**8+this[++t]*2**16+this[++t]*2**24,u=this[++t]+this[++t]*2**8+this[++t]*2**16+i*2**24;return BigInt(n)+(BigInt(u)<<BigInt(32))}),o.prototype.readBigUInt64BE=N(function(t){t=t>>>0,V(t,"offset");const r=this[t],i=this[t+7];(r===void 0||i===void 0)&&H(t,this.length-8);const n=r*2**24+this[++t]*2**16+this[++t]*2**8+this[++t],u=this[++t]*2**24+this[++t]*2**16+this[++t]*2**8+i;return(BigInt(n)<<BigInt(32))+BigInt(u)}),o.prototype.readIntLE=function(t,r,i){t=t>>>0,r=r>>>0,i||S(t,r,this.length);let n=this[t],u=1,a=0;for(;++a<r&&(u*=256);)n+=this[t+a]*u;return u*=128,n>=u&&(n-=Math.pow(2,8*r)),n},o.prototype.readIntBE=function(t,r,i){t=t>>>0,r=r>>>0,i||S(t,r,this.length);let n=r,u=1,a=this[t+--n];for(;n>0&&(u*=256);)a+=this[t+--n]*u;return u*=128,a>=u&&(a-=Math.pow(2,8*r)),a},o.prototype.readInt8=function(t,r){return t=t>>>0,r||S(t,1,this.length),this[t]&128?(255-this[t]+1)*-1:this[t]},o.prototype.readInt16LE=function(t,r){t=t>>>0,r||S(t,2,this.length);const i=this[t]|this[t+1]<<8;return i&32768?i|4294901760:i},o.prototype.readInt16BE=function(t,r){t=t>>>0,r||S(t,2,this.length);const i=this[t+1]|this[t]<<8;return i&32768?i|4294901760:i},o.prototype.readInt32LE=function(t,r){return t=t>>>0,r||S(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},o.prototype.readInt32BE=function(t,r){return t=t>>>0,r||S(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},o.prototype.readBigInt64LE=N(function(t){t=t>>>0,V(t,"offset");const r=this[t],i=this[t+7];(r===void 0||i===void 0)&&H(t,this.length-8);const n=this[t+4]+this[t+5]*2**8+this[t+6]*2**16+(i<<24);return(BigInt(n)<<BigInt(32))+BigInt(r+this[++t]*2**8+this[++t]*2**16+this[++t]*2**24)}),o.prototype.readBigInt64BE=N(function(t){t=t>>>0,V(t,"offset");const r=this[t],i=this[t+7];(r===void 0||i===void 0)&&H(t,this.length-8);const n=(r<<24)+this[++t]*2**16+this[++t]*2**8+this[++t];return(BigInt(n)<<BigInt(32))+BigInt(this[++t]*2**24+this[++t]*2**16+this[++t]*2**8+i)}),o.prototype.readFloatLE=function(t,r){return t=t>>>0,r||S(t,4,this.length),c.read(this,t,!0,23,4)},o.prototype.readFloatBE=function(t,r){return t=t>>>0,r||S(t,4,this.length),c.read(this,t,!1,23,4)},o.prototype.readDoubleLE=function(t,r){return t=t>>>0,r||S(t,8,this.length),c.read(this,t,!0,52,8)},o.prototype.readDoubleBE=function(t,r){return t=t>>>0,r||S(t,8,this.length),c.read(this,t,!1,52,8)};function D(e,t,r,i,n,u){if(!o.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>n||t<u)throw new RangeError('"value" argument is out of bounds');if(r+i>e.length)throw new RangeError("Index out of range")}o.prototype.writeUintLE=o.prototype.writeUIntLE=function(t,r,i,n){if(t=+t,r=r>>>0,i=i>>>0,!n){const w=Math.pow(2,8*i)-1;D(this,t,r,i,w,0)}let u=1,a=0;for(this[r]=t&255;++a<i&&(u*=256);)this[r+a]=t/u&255;return r+i},o.prototype.writeUintBE=o.prototype.writeUIntBE=function(t,r,i,n){if(t=+t,r=r>>>0,i=i>>>0,!n){const w=Math.pow(2,8*i)-1;D(this,t,r,i,w,0)}let u=i-1,a=1;for(this[r+u]=t&255;--u>=0&&(a*=256);)this[r+u]=t/a&255;return r+i},o.prototype.writeUint8=o.prototype.writeUInt8=function(t,r,i){return t=+t,r=r>>>0,i||D(this,t,r,1,255,0),this[r]=t&255,r+1},o.prototype.writeUint16LE=o.prototype.writeUInt16LE=function(t,r,i){return t=+t,r=r>>>0,i||D(this,t,r,2,65535,0),this[r]=t&255,this[r+1]=t>>>8,r+2},o.prototype.writeUint16BE=o.prototype.writeUInt16BE=function(t,r,i){return t=+t,r=r>>>0,i||D(this,t,r,2,65535,0),this[r]=t>>>8,this[r+1]=t&255,r+2},o.prototype.writeUint32LE=o.prototype.writeUInt32LE=function(t,r,i){return t=+t,r=r>>>0,i||D(this,t,r,4,4294967295,0),this[r+3]=t>>>24,this[r+2]=t>>>16,this[r+1]=t>>>8,this[r]=t&255,r+4},o.prototype.writeUint32BE=o.prototype.writeUInt32BE=function(t,r,i){return t=+t,r=r>>>0,i||D(this,t,r,4,4294967295,0),this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=t&255,r+4};function ft(e,t,r,i,n){Bt(t,i,n,e,r,7);let u=Number(t&BigInt(4294967295));e[r++]=u,u=u>>8,e[r++]=u,u=u>>8,e[r++]=u,u=u>>8,e[r++]=u;let a=Number(t>>BigInt(32)&BigInt(4294967295));return e[r++]=a,a=a>>8,e[r++]=a,a=a>>8,e[r++]=a,a=a>>8,e[r++]=a,r}function yt(e,t,r,i,n){Bt(t,i,n,e,r,7);let u=Number(t&BigInt(4294967295));e[r+7]=u,u=u>>8,e[r+6]=u,u=u>>8,e[r+5]=u,u=u>>8,e[r+4]=u;let a=Number(t>>BigInt(32)&BigInt(4294967295));return e[r+3]=a,a=a>>8,e[r+2]=a,a=a>>8,e[r+1]=a,a=a>>8,e[r]=a,r+8}o.prototype.writeBigUInt64LE=N(function(t,r=0){return ft(this,t,r,BigInt(0),BigInt("0xffffffffffffffff"))}),o.prototype.writeBigUInt64BE=N(function(t,r=0){return yt(this,t,r,BigInt(0),BigInt("0xffffffffffffffff"))}),o.prototype.writeIntLE=function(t,r,i,n){if(t=+t,r=r>>>0,!n){const A=Math.pow(2,8*i-1);D(this,t,r,i,A-1,-A)}let u=0,a=1,w=0;for(this[r]=t&255;++u<i&&(a*=256);)t<0&&w===0&&this[r+u-1]!==0&&(w=1),this[r+u]=(t/a>>0)-w&255;return r+i},o.prototype.writeIntBE=function(t,r,i,n){if(t=+t,r=r>>>0,!n){const A=Math.pow(2,8*i-1);D(this,t,r,i,A-1,-A)}let u=i-1,a=1,w=0;for(this[r+u]=t&255;--u>=0&&(a*=256);)t<0&&w===0&&this[r+u+1]!==0&&(w=1),this[r+u]=(t/a>>0)-w&255;return r+i},o.prototype.writeInt8=function(t,r,i){return t=+t,r=r>>>0,i||D(this,t,r,1,127,-128),t<0&&(t=255+t+1),this[r]=t&255,r+1},o.prototype.writeInt16LE=function(t,r,i){return t=+t,r=r>>>0,i||D(this,t,r,2,32767,-32768),this[r]=t&255,this[r+1]=t>>>8,r+2},o.prototype.writeInt16BE=function(t,r,i){return t=+t,r=r>>>0,i||D(this,t,r,2,32767,-32768),this[r]=t>>>8,this[r+1]=t&255,r+2},o.prototype.writeInt32LE=function(t,r,i){return t=+t,r=r>>>0,i||D(this,t,r,4,2147483647,-2147483648),this[r]=t&255,this[r+1]=t>>>8,this[r+2]=t>>>16,this[r+3]=t>>>24,r+4},o.prototype.writeInt32BE=function(t,r,i){return t=+t,r=r>>>0,i||D(this,t,r,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=t&255,r+4},o.prototype.writeBigInt64LE=N(function(t,r=0){return ft(this,t,r,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),o.prototype.writeBigInt64BE=N(function(t,r=0){return yt(this,t,r,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))});function wt(e,t,r,i,n,u){if(r+i>e.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function dt(e,t,r,i,n){return t=+t,r=r>>>0,n||wt(e,t,r,4),c.write(e,t,r,i,23,4),r+4}o.prototype.writeFloatLE=function(t,r,i){return dt(this,t,r,!0,i)},o.prototype.writeFloatBE=function(t,r,i){return dt(this,t,r,!1,i)};function mt(e,t,r,i,n){return t=+t,r=r>>>0,n||wt(e,t,r,8),c.write(e,t,r,i,52,8),r+8}o.prototype.writeDoubleLE=function(t,r,i){return mt(this,t,r,!0,i)},o.prototype.writeDoubleBE=function(t,r,i){return mt(this,t,r,!1,i)},o.prototype.copy=function(t,r,i,n){if(!o.isBuffer(t))throw new TypeError("argument should be a Buffer");if(i||(i=0),!n&&n!==0&&(n=this.length),r>=t.length&&(r=t.length),r||(r=0),n>0&&n<i&&(n=i),n===i||t.length===0||this.length===0)return 0;if(r<0)throw new RangeError("targetStart out of bounds");if(i<0||i>=this.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-r<n-i&&(n=t.length-r+i);const u=n-i;return this===t&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(r,i,n):Uint8Array.prototype.set.call(t,this.subarray(i,n),r),u},o.prototype.fill=function(t,r,i,n){if(typeof t=="string"){if(typeof r=="string"?(n=r,r=0,i=this.length):typeof i=="string"&&(n=i,i=this.length),n!==void 0&&typeof n!="string")throw new TypeError("encoding must be a string");if(typeof n=="string"&&!o.isEncoding(n))throw new TypeError("Unknown encoding: "+n);if(t.length===1){const a=t.charCodeAt(0);(n==="utf8"&&a<128||n==="latin1")&&(t=a)}}else typeof t=="number"?t=t&255:typeof t=="boolean"&&(t=Number(t));if(r<0||this.length<r||this.length<i)throw new RangeError("Out of range index");if(i<=r)return this;r=r>>>0,i=i===void 0?this.length:i>>>0,t||(t=0);let u;if(typeof t=="number")for(u=r;u<i;++u)this[u]=t;else{const a=o.isBuffer(t)?t:o.from(t,n),w=a.length;if(w===0)throw new TypeError('The value "'+t+'" is invalid for argument "value"');for(u=0;u<i-r;++u)this[u+r]=a[u%w]}return this};const G={};function rt(e,t,r){G[e]=class extends r{constructor(){super(),Object.defineProperty(this,"message",{value:t.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${e}]`,this.stack,delete this.name}get code(){return e}set code(n){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:n,writable:!0})}toString(){return`${this.name} [${e}]: ${this.message}`}}}rt("ERR_BUFFER_OUT_OF_BOUNDS",function(e){return e?`${e} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),rt("ERR_INVALID_ARG_TYPE",function(e,t){return`The "${e}" argument must be of type number. Received type ${typeof t}`},TypeError),rt("ERR_OUT_OF_RANGE",function(e,t,r){let i=`The value of "${e}" is out of range.`,n=r;return Number.isInteger(r)&&Math.abs(r)>2**32?n=gt(String(r)):typeof r=="bigint"&&(n=String(r),(r>BigInt(2)**BigInt(32)||r<-(BigInt(2)**BigInt(32)))&&(n=gt(n)),n+="n"),i+=` It must be ${t}. Received ${n}`,i},RangeError);function gt(e){let t="",r=e.length;const i=e[0]==="-"?1:0;for(;r>=i+4;r-=3)t=`_${e.slice(r-3,r)}${t}`;return`${e.slice(0,r)}${t}`}function $t(e,t,r){V(t,"offset"),(e[t]===void 0||e[t+r]===void 0)&&H(t,e.length-(r+1))}function Bt(e,t,r,i,n,u){if(e>r||e<t){const a=typeof t=="bigint"?"n":"";let w;throw t===0||t===BigInt(0)?w=`>= 0${a} and < 2${a} ** ${(u+1)*8}${a}`:w=`>= -(2${a} ** ${(u+1)*8-1}${a}) and < 2 ** ${(u+1)*8-1}${a}`,new G.ERR_OUT_OF_RANGE("value",w,e)}$t(i,n,u)}function V(e,t){if(typeof e!="number")throw new G.ERR_INVALID_ARG_TYPE(t,"number",e)}function H(e,t,r){throw Math.floor(e)!==e?(V(e,r),new G.ERR_OUT_OF_RANGE("offset","an integer",e)):t<0?new G.ERR_BUFFER_OUT_OF_BOUNDS:new G.ERR_OUT_OF_RANGE("offset",`>= 0 and <= ${t}`,e)}const jt=/[^+/0-9A-Za-z-_]/g;function Ft(e){if(e=e.split("=")[0],e=e.trim().replace(jt,""),e.length<2)return"";for(;e.length%4!==0;)e=e+"=";return e}function et(e,t){t=t||1/0;let r;const i=e.length;let n=null;const u=[];for(let a=0;a<i;++a){if(r=e.charCodeAt(a),r>55295&&r<57344){if(!n){if(r>56319){(t-=3)>-1&&u.push(239,191,189);continue}else if(a+1===i){(t-=3)>-1&&u.push(239,191,189);continue}n=r;continue}if(r<56320){(t-=3)>-1&&u.push(239,191,189),n=r;continue}r=(n-55296<<10|r-56320)+65536}else n&&(t-=3)>-1&&u.push(239,191,189);if(n=null,r<128){if((t-=1)<0)break;u.push(r)}else if(r<2048){if((t-=2)<0)break;u.push(r>>6|192,r&63|128)}else if(r<65536){if((t-=3)<0)break;u.push(r>>12|224,r>>6&63|128,r&63|128)}else if(r<1114112){if((t-=4)<0)break;u.push(r>>18|240,r>>12&63|128,r>>6&63|128,r&63|128)}else throw new Error("Invalid code point")}return u}function Kt(e){const t=[];for(let r=0;r<e.length;++r)t.push(e.charCodeAt(r)&255);return t}function zt(e,t){let r,i,n;const u=[];for(let a=0;a<e.length&&!((t-=2)<0);++a)r=e.charCodeAt(a),i=r>>8,n=r%256,u.push(n),u.push(i);return u}function Et(e){return s.toByteArray(Ft(e))}function Z(e,t,r,i){let n;for(n=0;n<i&&!(n+r>=t.length||n>=e.length);++n)t[n+r]=e[n];return n}function C(e,t){return e instanceof t||e!=null&&e.constructor!=null&&e.constructor.name!=null&&e.constructor.name===t.name}function it(e){return e!==e}const Yt=function(){const e="0123456789abcdef",t=new Array(256);for(let r=0;r<16;++r){const i=r*16;for(let n=0;n<16;++n)t[i+n]=e[r]+e[n]}return t}();function N(e){return typeof BigInt>"u"?Gt:e}function Gt(){throw new Error("BigInt not supported")}return $}var q,ot,Q,st,$,ut,O,fr=X({"node_modules/.pnpm/@jspm+core@2.0.1/node_modules/@jspm/core/nodelibs/browser/buffer.js"(){F(),K(),z(),Y(),q={},ot=!1,Q={},st=!1,$={},ut=!1,O=pr(),O.Buffer,O.SlowBuffer,O.INSPECT_MAX_BYTES,O.kMaxLength,O.Buffer,O.INSPECT_MAX_BYTES,O.kMaxLength}}),z=X({"node_modules/.pnpm/esbuild-plugin-polyfill-node@0.3.0_esbuild@0.23.0/node_modules/esbuild-plugin-polyfill-node/polyfills/buffer.js"(){fr()}}),W,nt,yr=X({"node_modules/.pnpm/@jspm+core@2.0.1/node_modules/@jspm/core/nodelibs/browser/process.js"(){F(),K(),z(),Y(),W={now:typeof performance<"u"?performance.now.bind(performance):void 0,timing:typeof performance<"u"?performance.timing:void 0},W.now===void 0&&(nt=Date.now(),W.timing&&W.timing.navigationStart&&(nt=W.timing.navigationStart),W.now=()=>Date.now()-nt)}}),Y=X({"node_modules/.pnpm/esbuild-plugin-polyfill-node@0.3.0_esbuild@0.23.0/node_modules/esbuild-plugin-polyfill-node/polyfills/process.js"(){yr()}});F();K();z();Y();F();K();z();Y();var Rr=class{constructor(s,c=!1){this.ttlMs=s,this.autoClean=c,this.cache=new Map,this.enabledAutoClean()}set(s,c){this.cache.set(s,{value:c,timestamp:Date.now()})}get(s){const c=this.cache.get(s);return c?Date.now()-c.timestamp>this.ttlMs?(this.cache.delete(s),null):c.value:null}has(s){const c=this.cache.get(s);return c?Date.now()-c.timestamp>this.ttlMs?(this.cache.delete(s),!1):!0:!1}delete(s){return this.cache.delete(s)}clear(){this.cache.clear(),this.autoCleanTimer&&clearInterval(this.autoCleanTimer)}size(){return 0}enabledAutoClean(){this.autoClean&&(this.autoCleanTimer=setInterval(()=>{for(const s of[...this.cache.keys()])this.get(s)},this.ttlMs))}};F();K();z();Y();var Sr=class{constructor(s){this.bufferSize=s,this.cache=new Map,this.indexes=new Map,this.lastIndex=0}set(s,c){if(this.has(s))return;if(this.cache.size>=this.bufferSize){const p=Math.min(...this.indexes.keys()),h=this.indexes.get(p);this.indexes.delete(p),this.cache.delete(h);return}const l=this.lastIndex++;this.indexes.set(l,s),this.cache.set(s,c)}get(s){return this.cache.get(s)??null}has(s){return this.cache.has(s)}delete(s){return this.cache.delete(s)}clear(){this.cache.clear(),this.indexes.clear(),this.lastIndex=0}size(){return this.cache.size}};F();K();z();Y();var Mr=class{constructor(s,c){this.storageKey=s,this.ttlDays=c,this.cache=new Map;const l=It.get(this.storageKeyAndVersion,Zt);this.cache=new Map(l)}get storageKeyAndVersion(){return[this.storageKey,"v2"].join(":")}set(s,c){this.cache.set(s,{value:c,timestamp:Date.now()}),this.updatePersistence()}get(s){var c;return this.checkCacheData(s),((c=this.cache.get(s))==null?void 0:c.value)??null}has(s){return this.checkCacheData(s),this.cache.has(s)}delete(s){const c=this.cache.delete(s);return this.updatePersistence(),c}clear(){this.cache.clear(),this.updatePersistence()}size(){let s=!1;return this.cache.forEach((c,l)=>{this.checkCacheData(l,!0)&&!s&&(s=!0)}),s&&this.updatePersistence(),this.cache.size}checkCacheData(s,c){const l=this.cache.get(s);if(!l)return!1;let p=!1;return Date.now()-l.timestamp>this.ttlDays*864e5&&(this.cache.delete(s),p=!0,(c??!1)||this.updatePersistence()),p}updatePersistence(){It.set(this.storageKeyAndVersion,Array.from(this.cache.entries()))}};F();K();z();Y();var wr=1,J;async function j(s){if(J)return Reflect.get(J,"cache");const c=await Qt(()=>import("./import-wrapper-7PBGHSLX-BP65Uu9B.js"),__vite__mapDeps([0,1,2,3])).then(l=>l.Dexie);return J=new c("one-inch-long-time-async-cache_"+s),J.version(wr).stores({cache:["key","value","timestamp"].join(", ")}),Reflect.get(J,"cache")}var Pr=class{constructor(s,c){this.storageKey=s,this.ttlDays=c}async set(s,c){await(await j(this.storageKey)).put({key:s.toLowerCase(),value:c,timestamp:Date.now()}),this.cleanOldRecords().catch(console.error)}async get(s){const c=s.toLowerCase(),p=await(await j(this.storageKey)).filter(h=>Date.now()-h.timestamp<this.ttlDays*864e5&&h.key===c).first();return this.cleanOldRecords().catch(console.error),(p==null?void 0:p.value)??null}async getAll(){const c=await(await j(this.storageKey)).filter(l=>Date.now()-l.timestamp<this.ttlDays*864e5).toArray();return this.cleanOldRecords().catch(console.error),c.map(l=>l.value)}async has(s){return await this.get(s)!==null}async delete(s){try{return await(await j(this.storageKey)).delete(s),this.cleanOldRecords().catch(console.error),!0}catch{return!1}}async clear(){(await j(this.storageKey)).clear()}async size(){return await this.cleanOldRecords().catch(console.error),(await j(this.storageKey)).count()}async cleanOldRecords(){await(await j(this.storageKey)).where("timestamp").below(Date.now()-this.ttlDays*864e5).delete()}};export{nr as C,rr as E,Mr as L,Sr as Q,Rr as T,xr as _,Ar as a,Pr as b,xt as c,_r as d,K as e,z as f,Y as g,br as h,F as i,Ir as m,Br as o,Ur as s,Er as t};
//# sourceMappingURL=index.esm-BmGDGD-v.js.map
