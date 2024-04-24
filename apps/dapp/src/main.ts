import './app/app.element';
import { themeInit, MainColors } from '@one-inch-community/ui-components/theme'

Promise.all([
  themeInit(MainColors.systemSync),
  import('./app/controllers/connect-wallet-controller').then(m => m.connectWalletController.init())
])
  .then(() => {
    const main = document.createElement('app-root')
    main.id = 'app-root'
    document.body.appendChild(main)
  })

