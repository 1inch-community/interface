if(!self.define){let s,e={};const l=(l,n)=>(l=new URL(l+".js",n).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(n,i)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let u={};const o=s=>l(s,r),a={module:{uri:r},exports:u,require:o};e[r]=Promise.all(n.map((s=>a[s]||o(s)))).then((s=>(i(...s),u)))}}define(["./workbox-24af8f38"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/alert_24.svg-ASSJ27DL-B-iNsby1.js",revision:null},{url:"assets/app.element-eR6i_LRN.js",revision:null},{url:"assets/ar-5E2DVKJM-qxeDwuXM.js",revision:null},{url:"assets/ar-EHVYY5BX-C_gxvB5t.js",revision:null},{url:"assets/arbitrum_24.svg-EOHJT7SH-CQHQTPq5.js",revision:null},{url:"assets/arrow-down_16.svg-IK237GS3-w59mu4Qc.js",revision:null},{url:"assets/arrow-down_24.svg-QVWWMIAG-Eq8Z1DMa.js",revision:null},{url:"assets/arrow-left_24.svg-SRUSUV6K-CJuC3Adi.js",revision:null},{url:"assets/asap-D-qxMtYG.js",revision:null},{url:"assets/aurora_24.svg-W4HBGYPD-D0wDNhlk.js",revision:null},{url:"assets/auth-refresh_36.svg-TLQZRG73-BrmbqBG8.js",revision:null},{url:"assets/avalanche_24.svg-RACIZF5H-BzcRh2v-.js",revision:null},{url:"assets/base_24.svg-TRYUGEDS-CeAmjdhK.js",revision:null},{url:"assets/bell_24.svg-TDYDRRA3-Cxck9e5V.js",revision:null},{url:"assets/bnb_24.svg-GK3J7TR7-OrHq4SLi.js",revision:null},{url:"assets/ccip-CRIuC5qW.js",revision:null},{url:"assets/chevron-down_16.svg-BND54YF5-CGo5u_O6.js",revision:null},{url:"assets/circle_16.svg-ZXVELFJT-Bwg6Lp7q.js",revision:null},{url:"assets/circle_24.svg-NZRHXSXM-efN2bpUn.js",revision:null},{url:"assets/combineLatest-Bzt_9bb6.js",revision:null},{url:"assets/command_24.svg-6ZPVIHIB-DNYXrazD.js",revision:null},{url:"assets/community.style-4H64DAFG-DgjDqmGy.js",revision:null},{url:"assets/connect_16.svg-NSXNVWXM-YA0V0jf6.js",revision:null},{url:"assets/connect_24.svg-B72L67KC-DvGLuC5g.js",revision:null},{url:"assets/corner-down-right_16.svg-YYSNWS3X-HzR1R4gU.js",revision:null},{url:"assets/cross_24.svg-Y6TXDXMZ-C2hx7fLs.js",revision:null},{url:"assets/cross_8.svg-UQSEH4S4-Dshxuxj1.js",revision:null},{url:"assets/dark-blue.style-NUK7A3IA-C_b9ivMH.js",revision:null},{url:"assets/dark.style-IHZRPSJZ-CSUkb-mP.js",revision:null},{url:"assets/de-6LJ5U5KP-BBNlfbH1.js",revision:null},{url:"assets/de-JMXTJR4F-CH9zb0Xd.js",revision:null},{url:"assets/default-icon-UF676TO4-57bNFlKZ.js",revision:null},{url:"assets/defer-BRewiDsk.js",revision:null},{url:"assets/edit_24.svg-LIXQVG7G-JhX2GeY5.js",revision:null},{url:"assets/empty_search.svg-HTH3MFNW-OIwvVrNS.js",revision:null},{url:"assets/en-2MFTSBRT-D4hWu1bY.js",revision:null},{url:"assets/en-LH2H6NI6-C_uq8EBm.js",revision:null},{url:"assets/es-H5L7GO7Q-BC52Rg6L.js",revision:null},{url:"assets/es-V55QBK65-oJVmnjDB.js",revision:null},{url:"assets/esm-SGGH4NIO-Chj0b88S.js",revision:null},{url:"assets/eth_24.svg-QSL6GA7V-BiVqhXZb.js",revision:null},{url:"assets/fantom_24.svg-HII4JJB6-DmmH_qKc.js",revision:null},{url:"assets/fire_48.png-H24EZB6E-B2eTxNRi.js",revision:null},{url:"assets/firstValueFrom-RTAQ66ca.js",revision:null},{url:"assets/flow-MWNAY6JH-L9ck0Z9u.js",revision:null},{url:"assets/fr-CR6ZYPHE-C9aeuylw.js",revision:null},{url:"assets/fr-HW5JB3YP-DGulpzQJ.js",revision:null},{url:"assets/fusion_16.svg-DS2KKM4D-CpxoFCVh.js",revision:null},{url:"assets/fusion_24.svg-DJY4GZBN-CdDY5rlp.js",revision:null},{url:"assets/globe_24.svg-3EBQMDCF-kYWTiAd2.js",revision:null},{url:"assets/gnosis_24.svg-OA645ZO3-ChwSuPPX.js",revision:null},{url:"assets/image_24.svg-LMEQRSRL-CwMq81Va.js",revision:null},{url:"assets/import-wrapper-7PBGHSLX-WQunETuU.js",revision:null},{url:"assets/import-wrapper-prod-BvIURD_x.js",revision:null},{url:"assets/inch-wallet-icon-FTPZOH6D-S89rj93W.js",revision:null},{url:"assets/index-C0bLhRb1.js",revision:null},{url:"assets/index-DCEnXKZj.js",revision:null},{url:"assets/index-DtyFm1iN.js",revision:null},{url:"assets/index-w6Xy5dA-.js",revision:null},{url:"assets/index.esm-5Aerb1sL.js",revision:null},{url:"assets/index.esm-BcUoR516.js",revision:null},{url:"assets/index.esm-BIr1Zwfc.js",revision:null},{url:"assets/index.esm-Brqf5fnK.js",revision:null},{url:"assets/index.esm-COc-PyqV.js",revision:null},{url:"assets/index.esm-D_9Ml8zN.js",revision:null},{url:"assets/index.esm-D5WAmJbY.js",revision:null},{url:"assets/index.esm-D8v7tmlf.js",revision:null},{url:"assets/index.esm-DDMialSG.js",revision:null},{url:"assets/index.esm-DhH_RRvh.js",revision:null},{url:"assets/index.esm-DhwY4kHm.js",revision:null},{url:"assets/index.esm-DLID6q_T.js",revision:null},{url:"assets/index.esm-DPlwgymR.js",revision:null},{url:"assets/index.esm-FtrHNrrZ.js",revision:null},{url:"assets/index.esm-o5TvcBkS.js",revision:null},{url:"assets/index.esm-OIwjBXxl.js",revision:null},{url:"assets/klaytn_24.svg-3HGJORYN-C1V_Us8W.js",revision:null},{url:"assets/l2-chain_24.svg-BVBNWDAX-fGZrF7Ni.js",revision:null},{url:"assets/l2-chain-rtl_24.svg-7UVTOITU-DFlSYnKl.js",revision:null},{url:"assets/light-blue.style-VY6NMOV6-DVv3Y1wE.js",revision:null},{url:"assets/light.style-5IM57SAI-Cf9T-fNz.js",revision:null},{url:"assets/link_16.svg-ILSOSF3Q-BOEOJ3T9.js",revision:null},{url:"assets/link_24.svg-ME7P2JZJ-BimNTQaz.js",revision:null},{url:"assets/logo-full.svg-GX4A5T7B-CyBnEJ2a.js",revision:null},{url:"assets/matic_24.svg-MR2PZC5O-DoQWAbNF.js",revision:null},{url:"assets/moon_24.svg-UFSZTNKT-VgZAQYNk.js",revision:null},{url:"assets/multi-connect-provider-YOTZYVBH-DHroBqAK.js",revision:null},{url:"assets/native-DCTjMhwz.js",revision:null},{url:"assets/one-inch-wallet-icon-5SPUNDFK-BHMg-Ox7.js",revision:null},{url:"assets/one-inch.repository-AF3TE4XT-DAssC24p.js",revision:null},{url:"assets/op_24.svg-C7QI3DAY-SHryIKjL.js",revision:null},{url:"assets/orange.style-XNGQPUYN-BJxLYRfX.js",revision:null},{url:"assets/pancakeswap.repository-LI7PUPCX-G-Ch2CcF.js",revision:null},{url:"assets/permit2_abi-TSO4Q6OK-5IYTefWS.js",revision:null},{url:"assets/plus-circle_16.svg-LAFJERR4-yAl6QKNd.js",revision:null},{url:"assets/rainbow.style-7EZPSI4B-nJGtc5u1.js",revision:null},{url:"assets/random.style-C7MWPUO7-B_OmdWAL.js",revision:null},{url:"assets/search_24.svg-7BVVC7QD-DGDQSLwo.js",revision:null},{url:"assets/settings_24.svg-LB2NPHFL-HJ_YJa7a.js",revision:null},{url:"assets/start-default_16.svg-CD2J7L7X-AnTtCh_3.js",revision:null},{url:"assets/sun_24.svg-J2JEBXWO-DeDD9pEY.js",revision:null},{url:"assets/swap-form-desktop.element-Cy8ARBui.js",revision:null},{url:"assets/swap-form-mobile.element-BL60PdKP.js",revision:null},{url:"assets/swap-form.style-Wt8hKvzO.js",revision:null},{url:"assets/takeUntil-B9okj2Im.js",revision:null},{url:"assets/tap-DGvjHJum.js",revision:null},{url:"assets/trustwallet.repository-P6G45YEI-BFgW0bNZ.js",revision:null},{url:"assets/unicorn_run.svg-FIWXVX57-DEsuebOP.js",revision:null},{url:"assets/uniswap.repository-MXTOGC4T-VfaWNt67.js",revision:null},{url:"assets/violet.style-J42QNWBN-CYbJ3hRa.js",revision:null},{url:"assets/virtual_pwa-register-BNCyFztQ.js",revision:null},{url:"assets/wallet_24.svg-NRI5NRWL-JF6PtNzJ.js",revision:null},{url:"assets/wallet-connect-icon-NJ76IV67-lPk-W8Bs.js",revision:null},{url:"assets/wallet-connect-init-options-ACAHGVFG-BMydaQuJ.js",revision:null},{url:"assets/workbox-window.prod.es5-D5gOYdM7.js",revision:null},{url:"assets/zksyncera_24.svg-6GCDLJI2-B0C8XFd6.js",revision:null},{url:"fonts/Inter/inter.css",revision:"0ec0a83ecf3b2b0bafa7e83a91bf1da5"},{url:"index.html",revision:"473ac60bf69c367c74c3543e124bd139"},{url:"icons/android/android-launchericon-48-48.png",revision:"29d21205e0b7e75d5e5f40c563a2409f"},{url:"icons/android/android-launchericon-72-72.png",revision:"05d2128353963a80031c64d3367ec244"},{url:"icons/android/android-launchericon-96-96.png",revision:"5dbf2bacb98e3910c246005fd35bfafa"},{url:"icons/android/android-launchericon-144-144.png",revision:"2d68d56cdc8bc9db3a62b83a4f36230a"},{url:"icons/android/android-launchericon-192-192.png",revision:"a0322f6e632d0739a6c4b6952abb7c4b"},{url:"icons/android/android-launchericon-512-512.png",revision:"58e36c371b84849909c90c65ee0bf6c5"},{url:"manifest.webmanifest",revision:"04144e5601cf98cea8d24e571571f094"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html"))),s.registerRoute((({url:s})=>s.origin!==self.location.origin&&/\.(png|jpg|jpeg|svg|gif)$/.test(s.pathname)),new s.CacheFirst({cacheName:"external-images",plugins:[new s.ExpirationPlugin({maxEntries:1500,maxAgeSeconds:7776e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),s.registerRoute((({url:s})=>s.origin===self.location.origin&&/\.(woff2)$/.test(s.pathname)),new s.CacheFirst({cacheName:"fonts",plugins:[new s.ExpirationPlugin({maxEntries:100,maxAgeSeconds:31104e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),s.registerRoute(/.*\.svg-.*\.js(\?.*)?$/,new s.CacheFirst({cacheName:"js-svg-templates",plugins:[new s.ExpirationPlugin({maxEntries:100,maxAgeSeconds:31536e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),s.registerRoute(/^(?!.*\.svg-.*\.js$).*\.js(\?.*)?$/,new s.StaleWhileRevalidate({cacheName:"js-bundles",plugins:[new s.ExpirationPlugin({maxEntries:100,maxAgeSeconds:2592e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),self.__WB_DISABLE_DEV_LOGS=!0}));
//# sourceMappingURL=sw.js.map
