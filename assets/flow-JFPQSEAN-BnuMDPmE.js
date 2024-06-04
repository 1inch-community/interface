var c=class{constructor(i){this._map=new Map,this._roundAverageSize=!1,this.totalSize=0,(i==null?void 0:i.roundAverageSize)===!0&&(this._roundAverageSize=!0)}set(i,t){const s=this._map.get(i)||0;this._map.set(i,t),this.totalSize+=t-s}get averageSize(){if(this._map.size>0){const i=this.totalSize/this._map.size;return this._roundAverageSize?Math.round(i):i}return 0}getSize(i){return this._map.get(i)}clear(){this._map.clear(),this.totalSize=0}};function m(i){return i==="horizontal"?"width":"height"}var f=class{_getDefaultConfig(){return{direction:"vertical"}}constructor(i,t){this._latestCoords={left:0,top:0},this._direction=null,this._viewportSize={width:0,height:0},this.totalScrollSize={width:0,height:0},this.offsetWithinScroller={left:0,top:0},this._pendingReflow=!1,this._pendingLayoutUpdate=!1,this._pin=null,this._firstVisible=0,this._lastVisible=0,this._physicalMin=0,this._physicalMax=0,this._first=-1,this._last=-1,this._sizeDim="height",this._secondarySizeDim="width",this._positionDim="top",this._secondaryPositionDim="left",this._scrollPosition=0,this._scrollError=0,this._items=[],this._scrollSize=1,this._overhang=1e3,this._hostSink=i,Promise.resolve().then(()=>this.config=t||this._getDefaultConfig())}set config(i){Object.assign(this,Object.assign({},this._getDefaultConfig(),i))}get config(){return{direction:this.direction}}get items(){return this._items}set items(i){this._setItems(i)}_setItems(i){i!==this._items&&(this._items=i,this._scheduleReflow())}get direction(){return this._direction}set direction(i){i=i==="horizontal"?i:"vertical",i!==this._direction&&(this._direction=i,this._sizeDim=i==="horizontal"?"width":"height",this._secondarySizeDim=i==="horizontal"?"height":"width",this._positionDim=i==="horizontal"?"left":"top",this._secondaryPositionDim=i==="horizontal"?"top":"left",this._triggerReflow())}get viewportSize(){return this._viewportSize}set viewportSize(i){const{_viewDim1:t,_viewDim2:s}=this;Object.assign(this._viewportSize,i),s!==this._viewDim2?this._scheduleLayoutUpdate():t!==this._viewDim1&&this._checkThresholds()}get viewportScroll(){return this._latestCoords}set viewportScroll(i){Object.assign(this._latestCoords,i);const t=this._scrollPosition;this._scrollPosition=this._latestCoords[this._positionDim],Math.abs(t-this._scrollPosition)>=1&&this._checkThresholds()}reflowIfNeeded(i=!1){(i||this._pendingReflow)&&(this._pendingReflow=!1,this._reflow())}set pin(i){this._pin=i,this._triggerReflow()}get pin(){if(this._pin!==null){const{index:i,block:t}=this._pin;return{index:Math.max(0,Math.min(i,this.items.length-1)),block:t}}return null}_clampScrollPosition(i){return Math.max(-this.offsetWithinScroller[this._positionDim],Math.min(i,this.totalScrollSize[m(this.direction)]-this._viewDim1))}unpin(){this._pin!==null&&(this._sendUnpinnedMessage(),this._pin=null)}_updateLayout(){}get _viewDim1(){return this._viewportSize[this._sizeDim]}get _viewDim2(){return this._viewportSize[this._secondarySizeDim]}_scheduleReflow(){this._pendingReflow=!0}_scheduleLayoutUpdate(){this._pendingLayoutUpdate=!0,this._scheduleReflow()}_triggerReflow(){this._scheduleLayoutUpdate(),Promise.resolve().then(()=>this.reflowIfNeeded())}_reflow(){this._pendingLayoutUpdate&&(this._updateLayout(),this._pendingLayoutUpdate=!1),this._updateScrollSize(),this._setPositionFromPin(),this._getActiveItems(),this._updateVisibleIndices(),this._sendStateChangedMessage()}_setPositionFromPin(){if(this.pin!==null){const i=this._scrollPosition,{index:t,block:s}=this.pin;this._scrollPosition=this._calculateScrollIntoViewPosition({index:t,block:s||"start"})-this.offsetWithinScroller[this._positionDim],this._scrollError=i-this._scrollPosition}}_calculateScrollIntoViewPosition(i){const{block:t}=i,s=Math.min(this.items.length,Math.max(0,i.index)),h=this._getItemPosition(s)[this._positionDim];let n=h;if(t!=="start"){const l=this._getItemSize(s)[this._sizeDim];if(t==="center")n=h-.5*this._viewDim1+.5*l;else{const e=h-this._viewDim1+l;if(t==="end")n=e;else{const r=this._scrollPosition;n=Math.abs(r-h)<Math.abs(r-e)?h:e}}}return n+=this.offsetWithinScroller[this._positionDim],this._clampScrollPosition(n)}getScrollIntoViewCoordinates(i){return{[this._positionDim]:this._calculateScrollIntoViewPosition(i)}}_sendUnpinnedMessage(){this._hostSink({type:"unpinned"})}_sendVisibilityChangedMessage(){this._hostSink({type:"visibilityChanged",firstVisible:this._firstVisible,lastVisible:this._lastVisible})}_sendStateChangedMessage(){const i=new Map;if(this._first!==-1&&this._last!==-1)for(let s=this._first;s<=this._last;s++)i.set(s,this._getItemPosition(s));const t={type:"stateChanged",scrollSize:{[this._sizeDim]:this._scrollSize,[this._secondarySizeDim]:null},range:{first:this._first,last:this._last,firstVisible:this._firstVisible,lastVisible:this._lastVisible},childPositions:i};this._scrollError&&(t.scrollError={[this._positionDim]:this._scrollError,[this._secondaryPositionDim]:0},this._scrollError=0),this._hostSink(t)}get _num(){return this._first===-1||this._last===-1?0:this._last-this._first+1}_checkThresholds(){if(this._viewDim1===0&&this._num>0||this._pin!==null)this._scheduleReflow();else{const i=Math.max(0,this._scrollPosition-this._overhang),t=Math.min(this._scrollSize,this._scrollPosition+this._viewDim1+this._overhang);this._physicalMin>i||this._physicalMax<t?this._scheduleReflow():this._updateVisibleIndices({emit:!0})}}_updateVisibleIndices(i){if(this._first===-1||this._last===-1)return;let t=this._first;for(;t<this._last&&Math.round(this._getItemPosition(t)[this._positionDim]+this._getItemSize(t)[this._sizeDim])<=Math.round(this._scrollPosition);)t++;let s=this._last;for(;s>this._first&&Math.round(this._getItemPosition(s)[this._positionDim])>=Math.round(this._scrollPosition+this._viewDim1);)s--;(t!==this._firstVisible||s!==this._lastVisible)&&(this._firstVisible=t,this._lastVisible=s,i&&i.emit&&this._sendVisibilityChangedMessage())}},M=i=>Object.assign({type:p},i);function g(i){return i==="horizontal"?"marginLeft":"marginTop"}function d(i){return i==="horizontal"?"marginRight":"marginBottom"}function u(i){return i==="horizontal"?"xOffset":"yOffset"}function S(i,t){const s=[i,t].sort();return s[1]<=0?Math.min(...s):s[0]>=0?Math.max(...s):s[0]+s[1]}var z=class{constructor(){this._childSizeCache=new c,this._marginSizeCache=new c,this._metricsCache=new Map}update(i,t){var h,n;const s=new Set;Object.keys(i).forEach(l=>{const e=Number(l);this._metricsCache.set(e,i[e]),this._childSizeCache.set(e,i[e][m(t)]),s.add(e),s.add(e+1)});for(const l of s){const e=((h=this._metricsCache.get(l))==null?void 0:h[g(t)])||0,r=((n=this._metricsCache.get(l-1))==null?void 0:n[d(t)])||0;this._marginSizeCache.set(l,S(e,r))}}get averageChildSize(){return this._childSizeCache.averageSize}get totalChildSize(){return this._childSizeCache.totalSize}get averageMarginSize(){return this._marginSizeCache.averageSize}get totalMarginSize(){return this._marginSizeCache.totalSize}getLeadingMarginValue(i,t){var s;return((s=this._metricsCache.get(i))==null?void 0:s[g(t)])||0}getChildSize(i){return this._childSizeCache.getSize(i)}getMarginSize(i){return this._marginSizeCache.getSize(i)}clear(){this._childSizeCache.clear(),this._marginSizeCache.clear(),this._metricsCache.clear()}},p=class extends f{constructor(){super(...arguments),this._itemSize={width:100,height:100},this._physicalItems=new Map,this._newPhysicalItems=new Map,this._metricsCache=new z,this._anchorIdx=null,this._anchorPos=null,this._stable=!0,this._measureChildren=!0,this._estimate=!0}get measureChildren(){return this._measureChildren}updateItemSizes(i){this._metricsCache.update(i,this.direction),this._scheduleReflow()}_getPhysicalItem(i){return this._newPhysicalItems.get(i)??this._physicalItems.get(i)}_getSize(i){return this._getPhysicalItem(i)&&this._metricsCache.getChildSize(i)}_getAverageSize(){return this._metricsCache.averageChildSize||this._itemSize[this._sizeDim]}_estimatePosition(i){const t=this._metricsCache;if(this._first===-1||this._last===-1)return t.averageMarginSize+i*(t.averageMarginSize+this._getAverageSize());if(i<this._first){const s=this._first-i;return this._getPhysicalItem(this._first).pos-(t.getMarginSize(this._first-1)||t.averageMarginSize)-(s*t.averageChildSize+(s-1)*t.averageMarginSize)}else{const s=i-this._last;return this._getPhysicalItem(this._last).pos+(t.getChildSize(this._last)||t.averageChildSize)+(t.getMarginSize(this._last)||t.averageMarginSize)+s*(t.averageChildSize+t.averageMarginSize)}}_getPosition(i){const t=this._getPhysicalItem(i),{averageMarginSize:s}=this._metricsCache;return i===0?this._metricsCache.getMarginSize(0)??s:t?t.pos:this._estimatePosition(i)}_calculateAnchor(i,t){return i<=0?0:t>this._scrollSize-this._viewDim1?this.items.length-1:Math.max(0,Math.min(this.items.length-1,Math.floor((i+t)/2/this._delta)))}_getAnchor(i,t){if(this._physicalItems.size===0)return this._calculateAnchor(i,t);if(this._first<0)return this._calculateAnchor(i,t);if(this._last<0)return this._calculateAnchor(i,t);const s=this._getPhysicalItem(this._first),h=this._getPhysicalItem(this._last),n=s.pos;if(h.pos+this._metricsCache.getChildSize(this._last)<i)return this._calculateAnchor(i,t);if(n>t)return this._calculateAnchor(i,t);let r=this._firstVisible-1,a=-1/0;for(;a<i;)a=this._getPhysicalItem(++r).pos+this._metricsCache.getChildSize(r);return r}_getActiveItems(){this._viewDim1===0||this.items.length===0?this._clearItems():this._getItems()}_clearItems(){this._first=-1,this._last=-1,this._physicalMin=0,this._physicalMax=0;const i=this._newPhysicalItems;this._newPhysicalItems=this._physicalItems,this._newPhysicalItems.clear(),this._physicalItems=i,this._stable=!0}_getItems(){const i=this._newPhysicalItems;this._stable=!0;let t,s;if(this.pin!==null){const{index:a}=this.pin;this._anchorIdx=a,this._anchorPos=this._getPosition(a)}if(t=this._scrollPosition-this._overhang,s=this._scrollPosition+this._viewDim1+this._overhang,s<0||t>this._scrollSize){this._clearItems();return}(this._anchorIdx===null||this._anchorPos===null)&&(this._anchorIdx=this._getAnchor(t,s),this._anchorPos=this._getPosition(this._anchorIdx));let h=this._getSize(this._anchorIdx);h===void 0&&(this._stable=!1,h=this._getAverageSize());const n=this._metricsCache.getMarginSize(this._anchorIdx)??this._metricsCache.averageMarginSize,l=this._metricsCache.getMarginSize(this._anchorIdx+1)??this._metricsCache.averageMarginSize;this._anchorIdx===0&&(this._anchorPos=n),this._anchorIdx===this.items.length-1&&(this._anchorPos=this._scrollSize-l-h);let e=0;for(this._anchorPos+h+l<t&&(e=t-(this._anchorPos+h+l)),this._anchorPos-n>s&&(e=s-(this._anchorPos-n)),e&&(this._scrollPosition-=e,t-=e,s-=e,this._scrollError+=e),i.set(this._anchorIdx,{pos:this._anchorPos,size:h}),this._first=this._last=this._anchorIdx,this._physicalMin=this._anchorPos-n,this._physicalMax=this._anchorPos+h+l;this._physicalMin>t&&this._first>0;){let a=this._getSize(--this._first);a===void 0&&(this._stable=!1,a=this._getAverageSize());let o=this._metricsCache.getMarginSize(this._first);o===void 0&&(this._stable=!1,o=this._metricsCache.averageMarginSize),this._physicalMin-=a;const _=this._physicalMin;if(i.set(this._first,{pos:_,size:a}),this._physicalMin-=o,this._stable===!1&&this._estimate===!1)break}for(;this._physicalMax<s&&this._last<this.items.length-1;){let a=this._getSize(++this._last);a===void 0&&(this._stable=!1,a=this._getAverageSize());let o=this._metricsCache.getMarginSize(this._last);o===void 0&&(this._stable=!1,o=this._metricsCache.averageMarginSize);const _=this._physicalMax;if(i.set(this._last,{pos:_,size:a}),this._physicalMax+=a+o,!this._stable&&!this._estimate)break}const r=this._calculateError();r&&(this._physicalMin-=r,this._physicalMax-=r,this._anchorPos-=r,this._scrollPosition-=r,i.forEach(a=>a.pos-=r),this._scrollError+=r),this._stable&&(this._newPhysicalItems=this._physicalItems,this._newPhysicalItems.clear(),this._physicalItems=i)}_calculateError(){return this._first===0?this._physicalMin:this._physicalMin<=0?this._physicalMin-this._first*this._delta:this._last===this.items.length-1?this._physicalMax-this._scrollSize:this._physicalMax>=this._scrollSize?this._physicalMax-this._scrollSize+(this.items.length-1-this._last)*this._delta:0}_reflow(){const{_first:i,_last:t}=this;super._reflow(),(this._first===-1&&this._last==-1||this._first===i&&this._last===t)&&this._resetReflowState()}_resetReflowState(){this._anchorIdx=null,this._anchorPos=null,this._stable=!0}_updateScrollSize(){const{averageMarginSize:i}=this._metricsCache;this._scrollSize=Math.max(1,this.items.length*(i+this._getAverageSize())+i)}get _delta(){const{averageMarginSize:i}=this._metricsCache;return this._getAverageSize()+i}_getItemPosition(i){return{[this._positionDim]:this._getPosition(i),[this._secondaryPositionDim]:0,[u(this.direction)]:-(this._metricsCache.getLeadingMarginValue(i,this.direction)??this._metricsCache.averageMarginSize)}}_getItemSize(i){return{[this._sizeDim]:this._getSize(i)||this._getAverageSize(),[this._secondarySizeDim]:this._itemSize[this._secondarySizeDim]}}_viewDim2Changed(){this._metricsCache.clear(),this._scheduleReflow()}};export{p as FlowLayout,M as flow};
//# sourceMappingURL=flow-JFPQSEAN-BnuMDPmE.js.map
