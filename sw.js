if(!self.define){let s,e={};const l=(l,n)=>(l=new URL(l+".js",n).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(n,i)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let u={};const o=s=>l(s,r),a={module:{uri:r},exports:u,require:o};e[r]=Promise.all(n.map((s=>a[s]||o(s)))).then((s=>(i(...s),u)))}}define(["./workbox-24af8f38"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/alert_24.svg-ASSJ27DL-BXCqL0VD.js",revision:null},{url:"assets/app.element-DrSXkIJL.js",revision:null},{url:"assets/ar-EHVYY5BX-C_gxvB5t.js",revision:null},{url:"assets/arbitrum_24.svg-EOHJT7SH-D8sfVD9u.js",revision:null},{url:"assets/arrow-down_16.svg-IK237GS3-CZ3YN03x.js",revision:null},{url:"assets/arrow-down_24.svg-QVWWMIAG-CS2-NYCC.js",revision:null},{url:"assets/arrow-left_24.svg-SRUSUV6K-C1Ju7dg0.js",revision:null},{url:"assets/asap-BqWvnQ_m.js",revision:null},{url:"assets/aurora_24.svg-W4HBGYPD-CTvNyiOl.js",revision:null},{url:"assets/auth-refresh_36.svg-TLQZRG73-xlfxR8Vy.js",revision:null},{url:"assets/avalanche_24.svg-RACIZF5H-DeTagt4f.js",revision:null},{url:"assets/base_24.svg-TRYUGEDS-BVb3mpXc.js",revision:null},{url:"assets/bell_24.svg-TDYDRRA3-CF28Y_ms.js",revision:null},{url:"assets/bnb_24.svg-GK3J7TR7-XEs1XERY.js",revision:null},{url:"assets/ccip-Bm-E4Vin.js",revision:null},{url:"assets/chevron-down_16.svg-BND54YF5-D-ut2TuV.js",revision:null},{url:"assets/circle_16.svg-ZXVELFJT-B-wxrW5u.js",revision:null},{url:"assets/circle_24.svg-NZRHXSXM-tITISic-.js",revision:null},{url:"assets/combineLatest-Cx3jWXTV.js",revision:null},{url:"assets/community.style-2325ZA4E-X6JXsGZl.js",revision:null},{url:"assets/connect_16.svg-NSXNVWXM-CHGvarfW.js",revision:null},{url:"assets/connect_24.svg-B72L67KC-BG0y7TNM.js",revision:null},{url:"assets/corner-down-right_16.svg-YYSNWS3X-DSOa0_W9.js",revision:null},{url:"assets/cross_24.svg-Y6TXDXMZ-BdMNONua.js",revision:null},{url:"assets/cross_8.svg-UQSEH4S4-DfqAp3SV.js",revision:null},{url:"assets/dark-blue.style-RCRIYV56-CpnR-4L-.js",revision:null},{url:"assets/dark.style-UM7ZMMAJ-CNyTpWdZ.js",revision:null},{url:"assets/default-icon-UF676TO4-57bNFlKZ.js",revision:null},{url:"assets/edit_24.svg-LIXQVG7G-CsN942tg.js",revision:null},{url:"assets/empty_search.svg-HTH3MFNW-w9zPGA1O.js",revision:null},{url:"assets/en-ANTPJ7PG-CCYv60hu.js",revision:null},{url:"assets/esm-WMGHUIL7-yhki3Y2y.js",revision:null},{url:"assets/eth_24.svg-QSL6GA7V-CZwjCHSj.js",revision:null},{url:"assets/fantom_24.svg-HII4JJB6-DFP5UHVm.js",revision:null},{url:"assets/fire_48.png-H24EZB6E-DS5ShLr3.js",revision:null},{url:"assets/firstValueFrom-Ch7AjPMY.js",revision:null},{url:"assets/flow-MWNAY6JH-L9ck0Z9u.js",revision:null},{url:"assets/fusion_16-NGHTDRJX-BhtU4n-d.js",revision:null},{url:"assets/gnosis_24.svg-OA645ZO3-C-IzuaQ5.js",revision:null},{url:"assets/import-wrapper-7PBGHSLX-D-m54aKz.js",revision:null},{url:"assets/import-wrapper-prod-mRNndFxq.js",revision:null},{url:"assets/inch-wallet-icon-FTPZOH6D-S89rj93W.js",revision:null},{url:"assets/index-DAtEUpr3.js",revision:null},{url:"assets/index-PK74fOVD.js",revision:null},{url:"assets/index-rE3B-wbD.js",revision:null},{url:"assets/index.esm-5Aerb1sL.js",revision:null},{url:"assets/index.esm-B0T4hOcN.js",revision:null},{url:"assets/index.esm-BFx2cDgb.js",revision:null},{url:"assets/index.esm-C-jz8WLf.js",revision:null},{url:"assets/index.esm-C3q7nLoX.js",revision:null},{url:"assets/index.esm-CmSQaEKv.js",revision:null},{url:"assets/index.esm-CNmU7HaR.js",revision:null},{url:"assets/index.esm-COc-PyqV.js",revision:null},{url:"assets/index.esm-DfotAdpM.js",revision:null},{url:"assets/index.esm-DIyynJVA.js",revision:null},{url:"assets/index.esm-DRrviodR.js",revision:null},{url:"assets/index.esm-gX2eCmPk.js",revision:null},{url:"assets/klaytn_24.svg-3HGJORYN-C3A9FYr0.js",revision:null},{url:"assets/l2-chain_24.svg-BVBNWDAX-CvYM1200.js",revision:null},{url:"assets/l2-chain-rtl_24.svg-7UVTOITU-C8iDC0W6.js",revision:null},{url:"assets/light-blue.style-W6OESTNI-BxciLI38.js",revision:null},{url:"assets/light.style-BQKHWKWO-BezZOBcf.js",revision:null},{url:"assets/link_16.svg-ILSOSF3Q-D_KHz3na.js",revision:null},{url:"assets/link_24.svg-ME7P2JZJ-Bhqee9dQ.js",revision:null},{url:"assets/logo-full.svg-GX4A5T7B-DIoOTXV0.js",revision:null},{url:"assets/matic_24.svg-MR2PZC5O-LY6hg5w3.js",revision:null},{url:"assets/multi-connect-provider-YOTZYVBH-DqwCy9zQ.js",revision:null},{url:"assets/native-DCTjMhwz.js",revision:null},{url:"assets/one-inch-wallet-icon-5SPUNDFK-BHMg-Ox7.js",revision:null},{url:"assets/one-inch.repository-AF3TE4XT-BDmhtuiN.js",revision:null},{url:"assets/op_24.svg-C7QI3DAY-DfEkniyd.js",revision:null},{url:"assets/orange.style-Z7PJ5G6E-CEShs-ry.js",revision:null},{url:"assets/pancakeswap.repository-LI7PUPCX-CyF8SBY_.js",revision:null},{url:"assets/permit2_abi-TSO4Q6OK-5IYTefWS.js",revision:null},{url:"assets/plus-circle_16.svg-LAFJERR4-P_CFUQYr.js",revision:null},{url:"assets/rainbow.style-KL6EELJC-MEYUhNXr.js",revision:null},{url:"assets/random.style-OYX462PK-hG075NU6.js",revision:null},{url:"assets/search_24.svg-7BVVC7QD-CoN9S6zP.js",revision:null},{url:"assets/start-default_16.svg-CD2J7L7X-BGvMNmvL.js",revision:null},{url:"assets/swap-form-desktop.element-BSKFt5RY.js",revision:null},{url:"assets/swap-form-mobile.element-6YlTrYPy.js",revision:null},{url:"assets/swap-form.style-QVWsmFiI.js",revision:null},{url:"assets/takeUntil-CSuw8jL4.js",revision:null},{url:"assets/tap-CWNNm5Pt.js",revision:null},{url:"assets/trustwallet.repository-P6G45YEI--zP4gFS0.js",revision:null},{url:"assets/unicorn_run.svg-FIWXVX57-B2OlpsSk.js",revision:null},{url:"assets/uniswap.repository-MXTOGC4T-F-Y9fA1x.js",revision:null},{url:"assets/violet.style-SHQNUURR-DILyIYrj.js",revision:null},{url:"assets/virtual_pwa-register-DzvFlyyK.js",revision:null},{url:"assets/wallet-connect-icon-NJ76IV67-lPk-W8Bs.js",revision:null},{url:"assets/wallet-connect-init-options-ACAHGVFG-zilvn69m.js",revision:null},{url:"assets/workbox-window.prod.es5-D5gOYdM7.js",revision:null},{url:"assets/zksyncera_24.svg-6GCDLJI2-BGQ9G93x.js",revision:null},{url:"fonts/Inter/inter.css",revision:"0ec0a83ecf3b2b0bafa7e83a91bf1da5"},{url:"index.html",revision:"ccf6b3d0971640035c4936c09e290e93"},{url:"icons/android/android-launchericon-48-48.png",revision:"29d21205e0b7e75d5e5f40c563a2409f"},{url:"icons/android/android-launchericon-72-72.png",revision:"05d2128353963a80031c64d3367ec244"},{url:"icons/android/android-launchericon-96-96.png",revision:"5dbf2bacb98e3910c246005fd35bfafa"},{url:"icons/android/android-launchericon-144-144.png",revision:"2d68d56cdc8bc9db3a62b83a4f36230a"},{url:"icons/android/android-launchericon-192-192.png",revision:"a0322f6e632d0739a6c4b6952abb7c4b"},{url:"icons/android/android-launchericon-512-512.png",revision:"58e36c371b84849909c90c65ee0bf6c5"},{url:"manifest.webmanifest",revision:"04144e5601cf98cea8d24e571571f094"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html"))),s.registerRoute((({url:s})=>s.origin!==self.location.origin&&/\.(png|jpg|jpeg|svg|gif)$/.test(s.pathname)),new s.CacheFirst({cacheName:"external-images",plugins:[new s.ExpirationPlugin({maxEntries:1500,maxAgeSeconds:7776e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),s.registerRoute((({url:s})=>s.origin===self.location.origin&&/\.(woff2)$/.test(s.pathname)),new s.CacheFirst({cacheName:"fonts",plugins:[new s.ExpirationPlugin({maxEntries:100,maxAgeSeconds:31104e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),s.registerRoute(/.*\.svg-.*\.js(\?.*)?$/,new s.CacheFirst({cacheName:"js-svg-templates",plugins:[new s.ExpirationPlugin({maxEntries:100,maxAgeSeconds:31536e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),s.registerRoute(/^(?!.*\.svg-.*\.js$).*\.js(\?.*)?$/,new s.StaleWhileRevalidate({cacheName:"js-bundles",plugins:[new s.ExpirationPlugin({maxEntries:100,maxAgeSeconds:2592e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),self.__WB_DISABLE_DEV_LOGS=!0}));
//# sourceMappingURL=sw.js.map
