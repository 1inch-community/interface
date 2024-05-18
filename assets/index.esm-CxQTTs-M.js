import{e as Q,a as ht,b as et,p as q,j as kt,T as Ct,m as X,r as k,c as St,l as Et,t as ct,v as x,h as H,w as dt,_ as Tt,x as c,f as $t,d as V,s as E,n as v,i as y,g as ut,k as F,o as pt,q as I,u as Y,y as mt,z as Lt,A as It,R as zt,B as ft,S as At,C as Rt,D as Z,E as tt,F as b,G as N,H as Vt,I as Ft,J as it,K as _t,L as Mt,M as Ot,N as st,O as Bt,P as G,Q as Nt,U as Pt,V as J,W as vt,X as gt,Y as Dt,Z as Wt,$ as jt,a0 as U,a1 as Ht,a2 as yt,a3 as Ut,a4 as qt,a5 as Xt}from"./index-nML9Z3oK.js";const nt=i=>Et(i)?i._$litType$.h:i.strings,Gt=Q(class extends ht{constructor(i){super(i),this.et=new WeakMap}render(i){return[i]}update(i,[t]){const e=et(this.it)?nt(this.it):null,s=et(t)?nt(t):null;if(e!==null&&(s===null||e!==s)){const n=q(i).pop();let r=this.et.get(e);if(r===void 0){const o=document.createDocumentFragment();r=kt(Ct,o),r.setConnected(!1),this.et.set(e,r)}X(r,[n]),k(r,void 0,n)}if(s!==null){if(e===null||e!==s){const n=this.et.get(s);if(n!==void 0){const r=q(n).pop();St(i),k(i,void 0,r),X(i,[r])}}this.it=t}else this.it=void 0;return this.render(t)}});const rt=(i,t,e)=>{const s=new Map;for(let n=t;n<=e;n++)s.set(i[n],n);return s},Jt=Q(class extends ht{constructor(i){if(super(i),i.type!==ct.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,t,e){let s;e===void 0?e=t:t!==void 0&&(s=t);const n=[],r=[];let o=0;for(const l of i)n[o]=s?s(l,o):o,r[o]=e(l,o),o++;return{values:r,keys:n}}render(i,t,e){return this.dt(i,t,e).values}update(i,[t,e,s]){const n=q(i),{values:r,keys:o}=this.dt(t,e,s);if(!Array.isArray(n))return this.ut=o,r;const l=this.ut??(this.ut=[]),d=[];let u,A,a=0,m=n.length-1,h=0,f=r.length-1;for(;a<=m&&h<=f;)if(n[a]===null)a++;else if(n[m]===null)m--;else if(l[a]===o[h])d[h]=x(n[a],r[h]),a++,h++;else if(l[m]===o[f])d[f]=x(n[m],r[f]),m--,f--;else if(l[a]===o[f])d[f]=x(n[a],r[f]),k(i,d[f+1],n[a]),a++,f--;else if(l[m]===o[h])d[h]=x(n[m],r[h]),k(i,n[a],n[m]),m--,h++;else if(u===void 0&&(u=rt(o,h,f),A=rt(l,a,m)),u.has(l[a]))if(u.has(l[m])){const _=A.get(o[h]),R=_!==void 0?n[_]:null;if(R===null){const M=k(i,n[a]);x(M,r[h]),d[h]=M}else d[h]=x(R,r[h]),k(i,n[a],R),n[_]=null;h++}else H(n[m]),m--;else H(n[a]),a++;for(;h<=f;){const _=k(i,d[f+1]);x(_,r[h]),d[h++]=_}for(;a<=m;){const _=n[a++];_!==null&&H(_)}return this.ut=o,X(i,d),dt}});class P extends Event{constructor(t){super(P.eventName,{bubbles:!1}),this.first=t.first,this.last=t.last}}P.eventName="rangeChanged";class D extends Event{constructor(t){super(D.eventName,{bubbles:!1}),this.first=t.first,this.last=t.last}}D.eventName="visibilityChanged";class W extends Event{constructor(){super(W.eventName,{bubbles:!1})}}W.eventName="unpinned";class Kt{constructor(t){this._element=null;const e=t??window;this._node=e,t&&(this._element=t)}get element(){return this._element||document.scrollingElement||document.documentElement}get scrollTop(){return this.element.scrollTop||window.scrollY}get scrollLeft(){return this.element.scrollLeft||window.scrollX}get scrollHeight(){return this.element.scrollHeight}get scrollWidth(){return this.element.scrollWidth}get viewportHeight(){return this._element?this._element.getBoundingClientRect().height:window.innerHeight}get viewportWidth(){return this._element?this._element.getBoundingClientRect().width:window.innerWidth}get maxScrollTop(){return this.scrollHeight-this.viewportHeight}get maxScrollLeft(){return this.scrollWidth-this.viewportWidth}}class Qt extends Kt{constructor(t,e){super(e),this._clients=new Set,this._retarget=null,this._end=null,this.__destination=null,this.correctingScrollError=!1,this._checkForArrival=this._checkForArrival.bind(this),this._updateManagedScrollTo=this._updateManagedScrollTo.bind(this),this.scrollTo=this.scrollTo.bind(this),this.scrollBy=this.scrollBy.bind(this);const s=this._node;this._originalScrollTo=s.scrollTo,this._originalScrollBy=s.scrollBy,this._originalScroll=s.scroll,this._attach(t)}get _destination(){return this.__destination}get scrolling(){return this._destination!==null}scrollTo(t,e){const s=typeof t=="number"&&typeof e=="number"?{left:t,top:e}:t;this._scrollTo(s)}scrollBy(t,e){const s=typeof t=="number"&&typeof e=="number"?{left:t,top:e}:t;s.top!==void 0&&(s.top+=this.scrollTop),s.left!==void 0&&(s.left+=this.scrollLeft),this._scrollTo(s)}_nativeScrollTo(t){this._originalScrollTo.bind(this._element||window)(t)}_scrollTo(t,e=null,s=null){this._end!==null&&this._end(),t.behavior==="smooth"?(this._setDestination(t),this._retarget=e,this._end=s):this._resetScrollState(),this._nativeScrollTo(t)}_setDestination(t){let{top:e,left:s}=t;return e=e===void 0?void 0:Math.max(0,Math.min(e,this.maxScrollTop)),s=s===void 0?void 0:Math.max(0,Math.min(s,this.maxScrollLeft)),this._destination!==null&&s===this._destination.left&&e===this._destination.top?!1:(this.__destination={top:e,left:s,behavior:"smooth"},!0)}_resetScrollState(){this.__destination=null,this._retarget=null,this._end=null}_updateManagedScrollTo(t){this._destination&&this._setDestination(t)&&this._nativeScrollTo(this._destination)}managedScrollTo(t,e,s){return this._scrollTo(t,e,s),this._updateManagedScrollTo}correctScrollError(t){this.correctingScrollError=!0,requestAnimationFrame(()=>requestAnimationFrame(()=>this.correctingScrollError=!1)),this._nativeScrollTo(t),this._retarget&&this._setDestination(this._retarget()),this._destination&&this._nativeScrollTo(this._destination)}_checkForArrival(){if(this._destination!==null){const{scrollTop:t,scrollLeft:e}=this;let{top:s,left:n}=this._destination;s=Math.min(s||0,this.maxScrollTop),n=Math.min(n||0,this.maxScrollLeft);const r=Math.abs(s-t),o=Math.abs(n-e);r<1&&o<1&&(this._end&&this._end(),this._resetScrollState())}}detach(t){return this._clients.delete(t),this._clients.size===0&&(this._node.scrollTo=this._originalScrollTo,this._node.scrollBy=this._originalScrollBy,this._node.scroll=this._originalScroll,this._node.removeEventListener("scroll",this._checkForArrival)),null}_attach(t){this._clients.add(t),this._clients.size===1&&(this._node.scrollTo=this.scrollTo,this._node.scrollBy=this.scrollBy,this._node.scroll=this.scrollTo,this._node.addEventListener("scroll",this._checkForArrival))}}let ot=window==null?void 0:window.ResizeObserver;const K=Symbol("virtualizerRef"),O="virtualizer-sizer";let lt;class Yt{constructor(t){if(this._benchmarkStart=null,this._layout=null,this._clippingAncestors=[],this._scrollSize=null,this._scrollError=null,this._childrenPos=null,this._childMeasurements=null,this._toBeMeasured=new Map,this._rangeChanged=!0,this._itemsChanged=!0,this._visibilityChanged=!0,this._scrollerController=null,this._isScroller=!1,this._sizer=null,this._hostElementRO=null,this._childrenRO=null,this._mutationObserver=null,this._scrollEventListeners=[],this._scrollEventListenerOptions={passive:!0},this._loadListener=this._childLoaded.bind(this),this._scrollIntoViewTarget=null,this._updateScrollIntoViewCoordinates=null,this._items=[],this._first=-1,this._last=-1,this._firstVisible=-1,this._lastVisible=-1,this._scheduled=new WeakSet,this._measureCallback=null,this._measureChildOverride=null,this._layoutCompletePromise=null,this._layoutCompleteResolver=null,this._layoutCompleteRejecter=null,this._pendingLayoutComplete=null,this._layoutInitialized=null,!t)throw new Error("Virtualizer constructor requires a configuration object");if(t.hostElement)this._init(t);else throw new Error('Virtualizer configuration requires the "hostElement" property')}set items(t){Array.isArray(t)&&t!==this._items&&(this._itemsChanged=!0,this._items=t,this._schedule(this._updateLayout))}_init(t){this._isScroller=!!t.scroller,this._initHostElement(t);const e=t.layout||{};this._layoutInitialized=this._initLayout(e)}_initObservers(){this._mutationObserver=new MutationObserver(this._finishDOMUpdate.bind(this)),this._hostElementRO=new ot(()=>this._hostElementSizeChanged()),this._childrenRO=new ot(this._childrenSizeChanged.bind(this))}_initHostElement(t){const e=this._hostElement=t.hostElement;this._applyVirtualizerStyles(),e[K]=this}connected(){this._initObservers();const t=this._isScroller;this._clippingAncestors=ee(this._hostElement,t),this._scrollerController=new Qt(this,this._clippingAncestors[0]),this._schedule(this._updateLayout),this._observeAndListen()}_observeAndListen(){this._mutationObserver.observe(this._hostElement,{childList:!0}),this._hostElementRO.observe(this._hostElement),this._scrollEventListeners.push(window),window.addEventListener("scroll",this,this._scrollEventListenerOptions),this._clippingAncestors.forEach(t=>{t.addEventListener("scroll",this,this._scrollEventListenerOptions),this._scrollEventListeners.push(t),this._hostElementRO.observe(t)}),this._hostElementRO.observe(this._scrollerController.element),this._children.forEach(t=>this._childrenRO.observe(t)),this._scrollEventListeners.forEach(t=>t.addEventListener("scroll",this,this._scrollEventListenerOptions))}disconnected(){var t,e,s,n;this._scrollEventListeners.forEach(r=>r.removeEventListener("scroll",this,this._scrollEventListenerOptions)),this._scrollEventListeners=[],this._clippingAncestors=[],(t=this._scrollerController)==null||t.detach(this),this._scrollerController=null,(e=this._mutationObserver)==null||e.disconnect(),this._mutationObserver=null,(s=this._hostElementRO)==null||s.disconnect(),this._hostElementRO=null,(n=this._childrenRO)==null||n.disconnect(),this._childrenRO=null,this._rejectLayoutCompletePromise("disconnected")}_applyVirtualizerStyles(){const e=this._hostElement.style;e.display=e.display||"block",e.position=e.position||"relative",e.contain=e.contain||"size layout",this._isScroller&&(e.overflow=e.overflow||"auto",e.minHeight=e.minHeight||"150px")}_getSizer(){const t=this._hostElement;if(!this._sizer){let e=t.querySelector(`[${O}]`);e||(e=document.createElement("div"),e.setAttribute(O,""),t.appendChild(e)),Object.assign(e.style,{position:"absolute",margin:"-2px 0 0 0",padding:0,visibility:"hidden",fontSize:"2px"}),e.textContent="&nbsp;",e.setAttribute(O,""),this._sizer=e}return this._sizer}async updateLayoutConfig(t){await this._layoutInitialized;const e=t.type||lt;if(typeof e=="function"&&this._layout instanceof e){const s={...t};return delete s.type,this._layout.config=s,!0}return!1}async _initLayout(t){let e,s;if(typeof t.type=="function"){s=t.type;const n={...t};delete n.type,e=n}else e=t;s===void 0&&(lt=s=(await Tt(()=>import("./flow-BSbDKKl6.js"),__vite__mapDeps([]))).FlowLayout),this._layout=new s(n=>this._handleLayoutMessage(n),e),this._layout.measureChildren&&typeof this._layout.updateItemSizes=="function"&&(typeof this._layout.measureChildren=="function"&&(this._measureChildOverride=this._layout.measureChildren),this._measureCallback=this._layout.updateItemSizes.bind(this._layout)),this._layout.listenForChildLoadEvents&&this._hostElement.addEventListener("load",this._loadListener,!0),this._schedule(this._updateLayout)}startBenchmarking(){this._benchmarkStart===null&&(this._benchmarkStart=window.performance.now())}stopBenchmarking(){if(this._benchmarkStart!==null){const t=window.performance.now(),e=t-this._benchmarkStart,n=performance.getEntriesByName("uv-virtualizing","measure").filter(r=>r.startTime>=this._benchmarkStart&&r.startTime<t).reduce((r,o)=>r+o.duration,0);return this._benchmarkStart=null,{timeElapsed:e,virtualizationTime:n}}return null}_measureChildren(){const t={},e=this._children,s=this._measureChildOverride||this._measureChild;for(let n=0;n<e.length;n++){const r=e[n],o=this._first+n;(this._itemsChanged||this._toBeMeasured.has(r))&&(t[o]=s.call(this,r,this._items[o]))}this._childMeasurements=t,this._schedule(this._updateLayout),this._toBeMeasured.clear()}_measureChild(t){const{width:e,height:s}=t.getBoundingClientRect();return Object.assign({width:e,height:s},Zt(t))}async _schedule(t){this._scheduled.has(t)||(this._scheduled.add(t),await Promise.resolve(),this._scheduled.delete(t),t.call(this))}async _updateDOM(t){this._scrollSize=t.scrollSize,this._adjustRange(t.range),this._childrenPos=t.childPositions,this._scrollError=t.scrollError||null;const{_rangeChanged:e,_itemsChanged:s}=this;this._visibilityChanged&&(this._notifyVisibility(),this._visibilityChanged=!1),(e||s)&&(this._notifyRange(),this._rangeChanged=!1),this._finishDOMUpdate()}_finishDOMUpdate(){this._children.forEach(t=>this._childrenRO.observe(t)),this._checkScrollIntoViewTarget(this._childrenPos),this._positionChildren(this._childrenPos),this._sizeHostElement(this._scrollSize),this._correctScrollError(),this._benchmarkStart&&"mark"in window.performance&&window.performance.mark("uv-end")}_updateLayout(){this._layout&&this._scrollerController&&(this._layout.items=this._items,this._updateView(),this._childMeasurements!==null&&(this._measureCallback&&this._measureCallback(this._childMeasurements),this._childMeasurements=null),this._layout.reflowIfNeeded(),this._benchmarkStart&&"mark"in window.performance&&window.performance.mark("uv-end"))}_handleScrollEvent(){var t;if(this._benchmarkStart&&"mark"in window.performance){try{window.performance.measure("uv-virtualizing","uv-start","uv-end")}catch(e){console.warn("Error measuring performance data: ",e)}window.performance.mark("uv-start")}this._scrollerController.correctingScrollError===!1&&((t=this._layout)==null||t.unpin()),this._schedule(this._updateLayout)}handleEvent(t){switch(t.type){case"scroll":(t.currentTarget===window||this._clippingAncestors.includes(t.currentTarget))&&this._handleScrollEvent();break;default:console.warn("event not handled",t)}}_handleLayoutMessage(t){t.type==="stateChanged"?this._updateDOM(t):t.type==="visibilityChanged"?(this._firstVisible=t.firstVisible,this._lastVisible=t.lastVisible,this._notifyVisibility()):t.type==="unpinned"&&this._hostElement.dispatchEvent(new W)}get _children(){const t=[];let e=this._hostElement.firstElementChild;for(;e;)e.hasAttribute(O)||t.push(e),e=e.nextElementSibling;return t}_updateView(){var n;const t=this._hostElement,e=(n=this._scrollerController)==null?void 0:n.element,s=this._layout;if(t&&e&&s){let r,o,l,d;const u=t.getBoundingClientRect();r=0,o=0,l=window.innerHeight,d=window.innerWidth;const A=this._clippingAncestors.map(T=>T.getBoundingClientRect());A.unshift(u);for(const T of A)r=Math.max(r,T.top),o=Math.max(o,T.left),l=Math.min(l,T.bottom),d=Math.min(d,T.right);const a=e.getBoundingClientRect(),m={left:u.left-a.left,top:u.top-a.top},h={width:e.scrollWidth,height:e.scrollHeight},f=r-u.top+t.scrollTop,_=o-u.left+t.scrollLeft,R=l-r,M=d-o;s.viewportSize={width:M,height:R},s.viewportScroll={top:f,left:_},s.totalScrollSize=h,s.offsetWithinScroller=m}}_sizeHostElement(t){const s=t&&t.width!==null?Math.min(82e5,t.width):0,n=t&&t.height!==null?Math.min(82e5,t.height):0;if(this._isScroller)this._getSizer().style.transform=`translate(${s}px, ${n}px)`;else{const r=this._hostElement.style;r.minWidth=s?`${s}px`:"100%",r.minHeight=n?`${n}px`:"100%"}}_positionChildren(t){t&&t.forEach(({top:e,left:s,width:n,height:r,xOffset:o,yOffset:l},d)=>{const u=this._children[d-this._first];u&&(u.style.position="absolute",u.style.boxSizing="border-box",u.style.transform=`translate(${s}px, ${e}px)`,n!==void 0&&(u.style.width=n+"px"),r!==void 0&&(u.style.height=r+"px"),u.style.left=o===void 0?null:o+"px",u.style.top=l===void 0?null:l+"px")})}async _adjustRange(t){const{_first:e,_last:s,_firstVisible:n,_lastVisible:r}=this;this._first=t.first,this._last=t.last,this._firstVisible=t.firstVisible,this._lastVisible=t.lastVisible,this._rangeChanged=this._rangeChanged||this._first!==e||this._last!==s,this._visibilityChanged=this._visibilityChanged||this._firstVisible!==n||this._lastVisible!==r}_correctScrollError(){if(this._scrollError){const{scrollTop:t,scrollLeft:e}=this._scrollerController,{top:s,left:n}=this._scrollError;this._scrollError=null,this._scrollerController.correctScrollError({top:t-s,left:e-n})}}element(t){var e;return t===1/0&&(t=this._items.length-1),((e=this._items)==null?void 0:e[t])===void 0?void 0:{scrollIntoView:(s={})=>this._scrollElementIntoView({...s,index:t})}}_scrollElementIntoView(t){if(t.index>=this._first&&t.index<=this._last)this._children[t.index-this._first].scrollIntoView(t);else if(t.index=Math.min(t.index,this._items.length-1),t.behavior==="smooth"){const e=this._layout.getScrollIntoViewCoordinates(t),{behavior:s}=t;this._updateScrollIntoViewCoordinates=this._scrollerController.managedScrollTo(Object.assign(e,{behavior:s}),()=>this._layout.getScrollIntoViewCoordinates(t),()=>this._scrollIntoViewTarget=null),this._scrollIntoViewTarget=t}else this._layout.pin=t}_checkScrollIntoViewTarget(t){const{index:e}=this._scrollIntoViewTarget||{};e&&(t!=null&&t.has(e))&&this._updateScrollIntoViewCoordinates(this._layout.getScrollIntoViewCoordinates(this._scrollIntoViewTarget))}_notifyRange(){this._hostElement.dispatchEvent(new P({first:this._first,last:this._last}))}_notifyVisibility(){this._hostElement.dispatchEvent(new D({first:this._firstVisible,last:this._lastVisible}))}get layoutComplete(){return this._layoutCompletePromise||(this._layoutCompletePromise=new Promise((t,e)=>{this._layoutCompleteResolver=t,this._layoutCompleteRejecter=e})),this._layoutCompletePromise}_rejectLayoutCompletePromise(t){this._layoutCompleteRejecter!==null&&this._layoutCompleteRejecter(t),this._resetLayoutCompleteState()}_scheduleLayoutComplete(){this._layoutCompletePromise&&this._pendingLayoutComplete===null&&(this._pendingLayoutComplete=requestAnimationFrame(()=>requestAnimationFrame(()=>this._resolveLayoutCompletePromise())))}_resolveLayoutCompletePromise(){this._layoutCompleteResolver!==null&&this._layoutCompleteResolver(),this._resetLayoutCompleteState()}_resetLayoutCompleteState(){this._layoutCompletePromise=null,this._layoutCompleteResolver=null,this._layoutCompleteRejecter=null,this._pendingLayoutComplete=null}_hostElementSizeChanged(){this._schedule(this._updateLayout)}_childLoaded(){}_childrenSizeChanged(t){var e;if((e=this._layout)!=null&&e.measureChildren){for(const s of t)this._toBeMeasured.set(s.target,s.contentRect);this._measureChildren()}this._scheduleLayoutComplete(),this._itemsChanged=!1,this._rangeChanged=!1}}function Zt(i){const t=window.getComputedStyle(i);return{marginTop:B(t.marginTop),marginRight:B(t.marginRight),marginBottom:B(t.marginBottom),marginLeft:B(t.marginLeft)}}function B(i){const t=i?parseFloat(i):NaN;return Number.isNaN(t)?0:t}function at(i){if(i.assignedSlot!==null)return i.assignedSlot;if(i.parentElement!==null)return i.parentElement;const t=i.parentNode;return t&&t.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&t.host||null}function te(i,t=!1){const e=[];let s=t?i:at(i);for(;s!==null;)e.push(s),s=at(s);return e}function ee(i,t=!1){let e=!1;return te(i,t).filter(s=>{if(e)return!1;const n=getComputedStyle(s);return e=n.position==="fixed",n.overflow!=="visible"})}const bt=i=>i,wt=(i,t)=>c`${t}: ${JSON.stringify(i,null,2)}`;class ie extends $t{constructor(t){if(super(t),this._virtualizer=null,this._first=0,this._last=-1,this._renderItem=(e,s)=>wt(e,s+this._first),this._keyFunction=(e,s)=>bt(e,s+this._first),this._items=[],t.type!==ct.CHILD)throw new Error("The virtualize directive can only be used in child expressions")}render(t){t&&this._setFunctions(t);const e=[];if(this._first>=0&&this._last>=this._first)for(let s=this._first;s<=this._last;s++)e.push(this._items[s]);return Jt(e,this._keyFunction,this._renderItem)}update(t,[e]){this._setFunctions(e);const s=this._items!==e.items;return this._items=e.items||[],this._virtualizer?this._updateVirtualizerConfig(t,e):this._initialize(t,e),s?dt:this.render()}async _updateVirtualizerConfig(t,e){if(!await this._virtualizer.updateLayoutConfig(e.layout||{})){const n=t.parentNode;this._makeVirtualizer(n,e)}this._virtualizer.items=this._items}_setFunctions(t){const{renderItem:e,keyFunction:s}=t;e&&(this._renderItem=(n,r)=>e(n,r+this._first)),s&&(this._keyFunction=(n,r)=>s(n,r+this._first))}_makeVirtualizer(t,e){this._virtualizer&&this._virtualizer.disconnected();const{layout:s,scroller:n,items:r}=e;this._virtualizer=new Yt({hostElement:t,layout:s,scroller:n}),this._virtualizer.items=r,this._virtualizer.connected()}_initialize(t,e){const s=t.parentNode;s&&s.nodeType===1&&(s.addEventListener("rangeChanged",n=>{this._first=n.first,this._last=n.last,this.setValue(this.render())}),this._makeVirtualizer(s,e))}disconnected(){var t;(t=this._virtualizer)==null||t.disconnected()}reconnected(){var t;(t=this._virtualizer)==null||t.connected()}}const se=Q(ie);class z extends E{constructor(){super(...arguments),this.items=[],this.renderItem=wt,this.keyFunction=bt,this.layout={},this.scroller=!1}createRenderRoot(){return this}render(){const{items:t,renderItem:e,keyFunction:s,layout:n,scroller:r}=this;return c`${se({items:t,renderItem:e,keyFunction:s,layout:n,scroller:r})}`}element(t){var e;return(e=this[K])==null?void 0:e.element(t)}get layoutComplete(){var t;return(t=this[K])==null?void 0:t.layoutComplete}scrollToIndex(t,e="start"){var s;(s=this.element(t))==null||s.scrollIntoView({block:e})}}V([v({attribute:!1})],z.prototype,"items",void 0);V([v()],z.prototype,"renderItem",void 0);V([v()],z.prototype,"keyFunction",void 0);V([v({attribute:!1})],z.prototype,"layout",void 0);V([v({reflect:!0,type:Boolean})],z.prototype,"scroller",void 0);customElements.define("lit-virtualizer",z);var ne=Object.defineProperty,re=Object.getOwnPropertyDescriptor,p=(i,t,e,s)=>{for(var n=s>1?void 0:s?re(t,e):t,r=i.length-1,o;r>=0;r--)(o=i[r])&&(n=(s?o(t,e,n):o(n))||n);return s&&n&&ne(t,e,n),n},oe=y`
  
  :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      position: relative;
  }
  
`,j=It(Symbol("select token context")),le=class{constructor(){this.chainId$=new zt(1),this.connectedWalletAddress$=new ft(null),this.changeFavoriteTokenState$=new At,this.favoriteTokens$=this.chainId$.pipe(Rt(i=>b.liveQuery(()=>b.getAllFavoriteTokenAddresses(i)))),this.tokenAddressList$=Z([this.chainId$,this.connectedWalletAddress$]).pipe(tt(([i,t])=>b.getSortedForViewTokenAddresses(i,t??void 0)))}setChainId(i){this.chainId$.next(i)}setConnectedWalletAddress(i){this.connectedWalletAddress$.next(i??null)}async setFavoriteTokenState(i,t,e){await b.setFavoriteState(i,t,e),this.changeFavoriteTokenState$.next([i,t])}},ae=y`

    .search-token-input-container {
        display: flex;
        background-color: var(--color-background-bg-secondary);
        height: 48px;
        border-radius: 12px;
        color: var(--color-content-content-tertiary);
        align-items: center;
        padding-left: 12px;
        padding-right: 12px;
        box-sizing: border-box;
        gap: 8px;
        margin-top: 5px;
        transition: box-shadow .2s;
    }
    
    .search-token-input {
        border: none;
        background-color: transparent;
        height: 100%;
        width: 100%;
        outline: none;
        color: var(--color-content-content-primary);
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
    }
    
    .search-token-input::placeholder {
        color: var(--color-content-content-secondary);
    }
    
    @media (hover: hover) {
        .search-token-input-container:hover {
            box-shadow: 0 0 0 1px var(--primary);
        }
    }
    
    .search-token-input-container__focused {
        box-shadow: 0 0 0 1px var(--primary);
    }

`,C=class extends E{constructor(){super(...arguments),this.isFocused=!1}render(){const i={"search-token-input-container":!0,"search-token-input-container__focused":this.isFocused};return c`
      <div class="${N(i)}">
        <inch-icon icon="search24"></inch-icon>
        <input
          id="search"
          autofocus
          autocomplete="off"
          @focus="${()=>this.isFocused=!0}"
          @blur="${()=>this.isFocused=!1}"
          placeholder="Search token by name or address"
          class="search-token-input"
        >
      </div>
    `}async firstUpdated(){this.renderRoot.querySelector("#search")&&this.sceneContext&&this.sceneContext.animationInProgress&&await this.sceneContext.animationInEnd}};C.tagName="inch-search-token-input";C.styles=ae;p([ut()],C.prototype,"isFocused",2);p([F({context:pt})],C.prototype,"sceneContext",2);C=p([I(C.tagName)],C);var he=y`
    
    :host {
        height: 72px;
        width: 100%;
        outline: none;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
    }
    
    .item-container {
        padding: 12px 16px;
        display: flex;
        gap: 8px;
        align-items: center;
        cursor: pointer;
        border-radius: 16px;
        transition: background-color .2s;
    }

    .name-and-balance {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-width: 50%;
    }

    .name-and-balance .name {
        color: var(--color-content-content-primary);
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .name-and-balance .balance {
        color: var(--color-content-content-secondary);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    
    .usd-balance {
        color: var(--color-content-content-primary);
        text-align: right;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        white-space: nowrap
    }
    
    .usd-balance-and-favorite-start {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-left: auto;
    }
    
    @media (hover: hover) {
        .item-container:hover {
            background-color: var(--color-background-bg-secondary);
        }

        .item-container:not(.is-favorite-token) .usd-balance {
            transform: translateX(24px);
            transition: transform .2s;
        }

        .item-container:not(.is-favorite-token) .is-favorite-start {
            transform: scale(0);
            transition: transform .2s;
        }

        .item-container:hover .is-favorite-start {
            transform: scale(1);
        }

        .item-container:hover .usd-balance {
            transform: translateX(0);
        }
    }
    
    ${Y(y`
        .item-container {
            padding: 8px 0;
            gap: 4px;
        }
    `)}

    .item-container:active {
        background-color: var(--color-background-bg-secondary);
    }

`,ce=y`
    
    :host {
        height: 72px;
        width: 100%;
    }
    
    .item-container {
        padding: 12px 16px;
        display: flex;
        gap: 8px;
        align-items: center;
        cursor: pointer;
        border-radius: 16px;
        transition: background-color .2s;
    }

    .name-and-balance {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
    }

    .stub-loader {
        will-change: filter;
        animation: stub-loader-animation 3s ease-in-out infinite;
    }

    .stub-token-icon {
        min-width: 40px;
        min-height: 40px;
        border-radius: 50%;
        background-color: var(--color-background-bg-secondary);
    }

    .name-stub {
        background-color: var(--color-background-bg-secondary);
        height: 24px;
        width: 40%;
        border-radius: 8px;
    }

    .balance-stub {
        background-color: var(--color-background-bg-secondary);
        height: 20px;
        width: 30%;
        border-radius: 8px;
    }

    @keyframes stub-loader-animation {
        0%, 100% {
            filter: opacity(1);
        }
        50% {
            filter: opacity(0.5);
        }
    }

    ${Y(y`
        .item-container {
            padding: 8px 0;
            gap: 4px;
        }
    `)}

`,$=class extends E{constructor(){super(...arguments),this.notShowLoader=!1}render(){const i={"item-container":!0,"stub-loader":!this.notShowLoader};return c`
      <div class="${N(i)}">
        <div class="stub-token-icon"></div>
        <div class="name-and-balance">
          <span class="name-stub"></span>
          <span class="balance-stub"></span>
        </div>
      </div>
    `}};$.tagName="inch-token-list-stub-item";$.styles=ce;p([v({type:Boolean,attribute:!0})],$.prototype,"notShowLoader",2);$=p([I($.tagName)],$);function xt(i,t,e){Ut(i,"selectToken",t,e)}var g=class extends E{constructor(){super(...arguments),this.isDestroy=!1,this.preRenderTemplate=null,this.isFavorite=!1,this.task=new Vt(this,async([i,t,e,s])=>{if(s){const l=this.task.value;if(l)return l}if(!i||!t)return[];if(await Ft(200),this.isDestroy)throw new Error("");const n=await b.getToken(i,t);let r=null,o=null;if(e){r=await b.getTokenBalance(i,t,e);const l=await b.getTokenUSDPrice(i,t),d=it(BigInt(r.amount),n.decimals);o=Number(d)*Number(l)}return[n,r,o]},()=>[this.chainId,this.tokenAddress,this.walletAddress,!1])}disconnectedCallback(){super.disconnectedCallback(),this.isDestroy=!0}firstUpdated(){if(!this.chainId)throw new Error("");_t(this,Mt(Ot(this.chainId),this.getTokenUpdateEmitter()).pipe(tt(()=>this.task.run([this.chainId,this.tokenAddress,this.walletAddress,!1]))),{requestUpdate:!1})}render(){return c`
      ${this.task.render({complete:([i,t,e])=>this.getTokenView(i,t,e),pending:()=>this.preRenderTemplate?this.preRenderTemplate:this.getStub(),error:()=>this.preRenderTemplate?this.preRenderTemplate:this.getStub()})}
    `}getTokenView(i,t,e){if(!i)return c``;this.isFavorite=i.isFavorite??!1;let s="0";t&&(s=st(it(BigInt(t.amount),i.decimals),6));let n="$0";e&&(n="$"+st(e.toString(),2));let r={border:"var(--color-border-border-secondary)",body:"none"};this.isFavorite&&(r={border:"var(--color-core-orange-warning)",body:"var(--color-core-orange-warning)"});const o={"item-container":!0,"is-favorite-token":i.isFavorite};return this.preRenderTemplate=c`
      <div class="${N(o)}" @click="${l=>xt(this,i,l)}">
        <inch-token-icon symbol="${i.symbol}" address="${i.address}" chainId="${i.chainId}"
                         size="40"></inch-token-icon>
        <div class="name-and-balance">
          <span class="name">${i.name}</span>
          <span class="balance">${s} ${i.symbol}</span>
        </div>

        <div class="usd-balance-and-favorite-start">
          <span class="usd-balance">${n}</span>
          <inch-icon class="is-favorite-start" @click="${l=>this.onMarkFavoriteToken(l,i)}"
                     icon="startDefault16" .props="${r}"></inch-icon>
        </div>
      </div>
    `,this.preRenderTemplate}async onMarkFavoriteToken(i,t){var e;i.preventDefault(),i.stopPropagation(),this.isFavorite=!t.isFavorite,await this.task.run([this.chainId,this.tokenAddress,this.walletAddress,!0]),await((e=this.context)==null?void 0:e.setFavoriteTokenState(t.chainId,t.address,!t.isFavorite))}getTokenUpdateEmitter(){if(!this.context)throw new Error("");return this.context.changeFavoriteTokenState$.pipe(Bt(([i,t])=>{var s,n;const e=((n=(s=this.task)==null?void 0:s.value)==null?void 0:n[0])??null;return e&&e.chainId===i&&yt(e.address,t)}))}getStub(){return c`
      <inch-token-list-stub-item></inch-token-list-stub-item>
    `}};g.tagName="inch-token-list-item";g.styles=he;p([v({type:String,attribute:!0})],g.prototype,"tokenAddress",2);p([v({type:String,attribute:!0})],g.prototype,"walletAddress",2);p([v({type:Number,attribute:!0})],g.prototype,"chainId",2);p([F({context:j})],g.prototype,"context",2);g=p([I(g.tagName)],g);var de=y`

    :host {
        height: 50vh;
        width: 100%;
        position: relative;
    }
    
    ${Y(y`
        :host {
            height: 100%;
            width: 100%;
            position: relative;
        }
    `)}
    
    .list-container {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 100%;
    }

    .loader-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .loader-view-container {
        padding-right: 7px;
    }


`,w=class extends E{constructor(){super(...arguments),this.transitionReady=!1,this.view$=G(()=>Z([this.getTokenAddressList(),this.getChainId(),this.getConnectedWalletAddress(),Nt(this)])).pipe(Pt(0),J(([i,t,e])=>this.getTokenListView(i,t,e??void 0)),vt(this.getLoaderView()))}render(){return this.transitionReady?c`
      <div class="list-container">
        ${gt(this.view$)}
      </div>`:this.getLoaderView()}async firstUpdated(){this.sceneContext&&this.sceneContext.animationInProgress&&await this.sceneContext.animationInEnd,this.transitionReady=!0}getTokenAddressList(){if(!this.context)throw new Error("");return this.context.tokenAddressList$}getChainId(){if(!this.context)throw new Error("");return this.context.chainId$}getConnectedWalletAddress(){if(!this.context)throw new Error("");return this.context.connectedWalletAddress$}getLoaderView(){return c`
      <div class="${N({"loader-view-container":!0})}">
        ${Dt(Array.from(Array(30).keys()),()=>c`<inch-token-list-stub-item></inch-token-list-stub-item>`)}
      </div>
    `}getTokenListView(i,t,e){const n={overflow:"auto",display:"block",position:"relative",contain:"size layout",minHeight:"150px",height:`${this.offsetHeight}px`};return c`
      ${Gt(c`
        <lit-virtualizer
          scroller
          style="${Wt(n)}"
          .items=${i}
          .keyFunction="${r=>[t,e,r].join(":")}"
          .renderItem=${r=>c`
            <inch-token-list-item
              tokenAddress="${r}"
              walletAddress="${jt(e)}"
              chainId="${t}"
            ></inch-token-list-item>`}
        ></lit-virtualizer>
      `)}
    `}};w.tagName="inch-token-list";w.styles=[de,mt];p([F({context:j})],w.prototype,"context",2);p([F({context:pt})],w.prototype,"sceneContext",2);p([ut()],w.prototype,"transitionReady",2);w=p([I(w.tagName)],w);var ue=y`
    :host {
        display: flex;
        width: 100%;
        height: 60px;
    }
    
    :host(.empty) {
        height: 16px;
        padding-bottom: 0;
        margin-bottom: 0;
    }
    
    :host(.transition-host) {
        transition: height .2s, padding-bottom .2s, margin-bottom .2s;
    }
    
    :host(.remove-favorite-token-show) .remove-favorite-token {
        transform: scale(1) translate(0, 0);
    }
    
    .favorite-container-scroll {
        overflow-y: hidden;
        overflow-x: auto;
        position: relative;
        width: 100%;
        padding-top: 16px;
        padding-bottom: 8px;
        margin-bottom: 8px;
        height: 36px;
    }
    
    .favorite-container {
        display: flex;
        gap: 12px;
        height: 36px;
        position: absolute;
    }

    ::-webkit-scrollbar {
        height: 2px;
    }

    .favorite-container-scroll::-webkit-scrollbar-thumb {
        transition: background-color .2s;
        background: var(--color-background-bg-primary);
    }
    
    .favorite-token-item-container {
        position: relative;
    }
    
    .remove-favorite-token {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-background-bg-secondary);
        z-index: 9;
        transition: transform .2s;
        transform: scale(0) translate(-16px, 16px);
        cursor: pointer;
        color: var(--color-content-content-primary);
    }
    
    @media (hover: hover) {
        .favorite-container-scroll:hover::-webkit-scrollbar-thumb {
            background: var(--primary);
        }
        .favorite-token-item-container:hover .remove-favorite-token {
            transform: scale(1) translate(0, 0);
        }
        .remove-favorite-token:hover {
            background-color: var(--secondary-hover);
        }
        .edit-favorite-token-list {
            display: none;
        }
    }
    
    

`,L=class extends E{constructor(){super(...arguments),this.editAllMode$=new ft(!1),this.favoriteTokensView$=Z([G(()=>this.getFavoriteTokens()),G(()=>this.getChainId())]).pipe(tt(([i,t])=>b.getTokenList(t,i)),J(i=>i.sort((t,e)=>e.priority-t.priority)),vt([]),U(i=>{i.length&&this.classList.contains("empty")&&this.classList.remove("empty"),!i.length&&!this.classList.contains("empty")&&this.classList.add("empty")}),U(()=>{this.classList.contains("transition-host")||setTimeout(()=>{this.classList.add("transition-host")},100)}),J(i=>(i.length&&i.push(null),c`
        <div class="favorite-container-scroll">
          <div class="favorite-container">
            ${c`${qt(i,t=>t!==null?"t"+t.address:"edit",pe,t=>Xt(t,e=>c`
                <div class="favorite-token-item-container">
                  <div class="remove-favorite-token" @click="${s=>this.onRemoveFavoriteToken(e,s)}">
                    <inch-icon icon="cross8"></inch-icon>
                  </div>
                  <inch-button size="m" type="secondary" class="favorite-token-item" @click="${s=>xt(this,e,s)}">
                    <inch-token-icon symbol="${e.symbol}" address="${e.address}"
                                     chainId="${e.chainId}"></inch-token-icon>
                    <span>${e.symbol}</span>
                  </inch-button>
                </div>
              `,()=>c`
                <inch-button size="l" type="secondary" class="favorite-token-item edit-favorite-token-list"
                             @click="${()=>this.editAllMode$.next(!this.editAllMode$.value)}">
                  <inch-icon icon="edit24"></inch-icon>
                </inch-button>
              `))}`}
          </div>
        </div>
      `)),Ht({bufferSize:1,refCount:!0}))}firstUpdated(){_t(this,this.editAllMode$.pipe(U(i=>{i?this.classList.add("remove-favorite-token-show"):this.classList.remove("remove-favorite-token-show")})),{requestUpdate:!1})}render(){return c`${gt(this.favoriteTokensView$)}`}getFavoriteTokens(){if(!this.context)throw new Error("");return this.context.favoriteTokens$}getChainId(){if(!this.context)throw new Error("");return this.context.chainId$}async onRemoveFavoriteToken(i,t){var e;t.stopPropagation(),t.preventDefault(),await((e=this.context)==null?void 0:e.setFavoriteTokenState(i.chainId,i.address,!1))}};L.tagName="inch-favorite-tokens";L.styles=[ue,mt];p([F({context:j})],L.prototype,"context",2);L=p([I(L.tagName)],L);var pe={deleteElement:async i=>{i.style.overflow="hidden",await i.animate([{flexBasis:`${i.offsetWidth}px`,transform:"scale(1) translateX(0)"},{flexBasis:"0",transform:"scale(0) translateX(-20%)"}],{duration:i.id==="edit"?50:150}).finished,i.style.overflow=""},addedElement:async i=>{i.style.overflow="hidden",i.style.transform="scale(0) translateX(-20%)",i.style.position="absolute",i.style.top="-9999",i.style.left="-9999",document.body.appendChild(i),await new Promise(e=>requestAnimationFrame(e));const t=i.offsetWidth;return i.remove(),i.style.position="",i.style.top="",i.style.left="",async e=>{await e.animate([{flexBasis:"0",transform:"scale(0) translateX(-20%)"},{flexBasis:`${t}px`,transform:"scale(1) translateX(0)"}],{duration:150}).finished,e.style.transform="",e.style.overflow=""}}};function me(i,t){return t?!yt(i,t):!0}var S=class extends E{constructor(){super(...arguments),this.context=new Lt(this,{context:j})}render(){return this.initContext(),c`
      <inch-card-header backButton headerText="Select token"></inch-card-header>
      <inch-search-token-input></inch-search-token-input>
      <inch-favorite-tokens></inch-favorite-tokens>
      <inch-token-list></inch-token-list>
    `}updated(i){let t=!1;const e=this.context.value;i.has("chainId")&&this.chainId&&(e.setChainId(this.chainId),t=!0),i.has("connectedWalletAddress")&&(e.setConnectedWalletAddress(this.connectedWalletAddress),t=!0),t&&this.requestUpdate()}initContext(){if(this.context.value)return;const{chainId:i,connectedWalletAddress:t}=this;if(!i)throw new Error("");const e=new le;e.setChainId(i),e.setConnectedWalletAddress(t),this.context.setValue(e)}};S.tagName="inch-select-token";S.styles=oe;p([v({type:Number})],S.prototype,"chainId",2);p([v({type:String,hasChanged:me})],S.prototype,"connectedWalletAddress",2);S=p([I(S.tagName)],S);export{S as SelectTokenElement};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
//# sourceMappingURL=index.esm-CxQTTs-M.js.map
