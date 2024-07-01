export enum Locale {
  en = 'en',
  ar = 'ar',
}

export type Translations = Record<string, string>

const rtlLocale: Locale[] = [
  Locale.ar
]

export function isRTL(localeCode: Locale) {
  return rtlLocale.includes(localeCode)
}
