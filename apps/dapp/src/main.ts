import './app/app.element';
import { themeInit, MainColors } from '@one-inch-community/ui-components/theme'
import { connectWalletController } from './app/controllers/connect-wallet-controller';

Promise.all([
  themeInit(MainColors.systemSync),
  connectWalletController.init()
])
  .then(() => {
    const main = document.createElement('app-root')
    main.id = 'app-root'
    document.body.appendChild(main)
  })

