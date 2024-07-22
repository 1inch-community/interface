import { addTranslation } from '@one-inch-community/core/lit'
import { Locale } from '@one-inch-community/models';

addTranslation({
  [Locale.en]: () => import('./en').then(m => m.default),
  [Locale.ar]: () => import('./ar').then(m => m.default)
})
