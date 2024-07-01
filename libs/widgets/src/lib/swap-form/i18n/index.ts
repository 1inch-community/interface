import { addTranslation, Locale } from '@one-inch-community/lit'

addTranslation({
  [Locale.en]: () => import('./en').then(m => m.default),
  [Locale.ar]: () => import('./ar').then(m => m.default)
})
