import './app/app.element';
import { themeInit } from '@one-inch-community/ui-components/theme'

themeInit()
  .then(() => {
    const main = document.createElement('app-root')
    document.body.appendChild(main)
  })

