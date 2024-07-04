import './app/app.element';
import { initLocale } from '@one-inch-community/core/lit'
import { themeInit, MainColors, BrandColors } from '@one-inch-community/ui-components/theme'

Promise.all([
  initLocale(),
  themeInit(MainColors.systemSync, BrandColors.community),
  import('./app/controllers/connect-wallet-controller').then(m => m.connectWalletController.init())
])
  .then(() => {
    const main = document.createElement('app-root')
    main.id = 'app-root'
    document.body.appendChild(main)
  })

import('virtual:pwa-register').then(({ registerSW }) => {
  registerSW({
    onRegisteredSW: (_, worker: ServiceWorkerRegistration) => worker.update(),
    onNeedRefresh: () => console.log('update ready'),
    onOfflineReady: () => console.log('offline ready'),
  })
})
