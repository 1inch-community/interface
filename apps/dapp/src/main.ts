import './app/app.element';
import { themeInit, MainColors } from '@one-inch-community/ui-components/theme'

themeInit(MainColors.dark)
  .then(() => {
    const main = document.createElement('app-root')
    document.body.appendChild(main)
  })

