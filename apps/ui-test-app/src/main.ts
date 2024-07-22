import './app/app.element';
import { themeInit } from '@one-inch-community/core/theme'
import { connectWalletController } from './app/connect-wallet-controller';

Promise.all([
  themeInit(),
  connectWalletController.init()
])
  .then(() => {
    const main = document.createElement('app-root')
    document.body.appendChild(main)
  })

