import { addTranslation } from "@one-inch-community/core/lit";

addTranslation({
  en: () => import('./en').then(m => m.default),
  ar: () => import('./ar').then(m => m.default),
  fr: () => import('./fr').then(m => m.default),
  es: () => import('./es').then(m => m.default),
  de: () => import('./de').then(m => m.default),
})
