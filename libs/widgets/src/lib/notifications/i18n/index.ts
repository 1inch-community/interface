import { addTranslation } from "@one-inch-community/core/lit";

addTranslation({
  en: () => import('./en').then(m => m.default),
  ar: () => import('./ar').then(m => m.default)
})
