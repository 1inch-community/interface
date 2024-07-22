import { Locale } from "@one-inch-community/models"

const rtlLocale: Locale[] = [
  Locale.ar
]

export function isRTL(localeCode: Locale) {
  return rtlLocale.includes(localeCode)
}
