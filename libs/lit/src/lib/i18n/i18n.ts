import { isRTL, Locale, Translations } from './locale';
import { BehaviorSubject, map, Observable } from 'rxjs';

const translations = new Map<Locale, (() => Promise<Translations>)[]>()
const currentTranslations$ = new BehaviorSubject<Translations | null>(null)
const defaultLocaleCode: Locale = Locale.en
let defaultTranslations!: Translations
let currentLocaleCode: Locale = Locale.en

let lastDefaultTranslationsStorageSize = 0
let lastCurrentTranslationsStorageSize = 0

let isInitialized = false

export const localeChange$ = currentTranslations$.pipe(
  map(() => currentLocaleCode)
)

export async function addTranslation(translationsRecord: Record<Locale, (() => Promise<Translations>)>) {
  for (const localeCode in translationsRecord) {
    const translation: (() => Promise<Translations>) = Reflect.get(translationsRecord, localeCode);
    const storage = translations.get(localeCode as Locale) ?? [];
    storage.push(translation);
    translations.set(localeCode as Locale, storage)
  }
  await updateLocaleAndTranslations(currentLocaleCode)
}

export async function changeLocale(localeCode: Locale) {
  await updateLocaleAndTranslations(localeCode)
}

export async function initLocale() {
  const localeCode = localStorage.getItem('1inch_locale') as (Locale | undefined) ?? Locale.en
  isInitialized = true
  await updateLocaleAndTranslations(localeCode)
}

export function listenChangesByPath(path: string, context?: Record<string, unknown>): Observable<string> {
  return currentTranslations$.pipe(
    map(translations => {
      if (!translations) return ''
      const result = translations[path] ?? ''
      if (context && result.includes('{{') && result.includes('}}')) {
        return interpolateString(result, context)
      }
      return result
    }),
  )
}

function interpolateString(value: string, context: Record<string, unknown>) {
  let newValue = value
  for (const key in context) {
    const contextValue = context[key]
    const pattern = `{{${key}}}`
    newValue = newValue.replaceAll(pattern, `${contextValue}`)
  }
  return newValue
}

async function updateLocaleAndTranslations(newLocaleCode: Locale) {
  if (!isInitialized) return
  const html = document.querySelector('html')!
  html.dir = isRTL(newLocaleCode) ? 'rtl' : 'ltr'

  const defaultTranslationsByLocale = translations.get(defaultLocaleCode) ?? []
  const translationsByLocale = translations.get(newLocaleCode) ?? []

  const translationsListToRecord = (translationsList: Translations[]): Translations =>
    translationsList.reduce((record, translations) =>
      ({ ...record, ...translations }), {})

  if (defaultTranslationsByLocale.length !== lastDefaultTranslationsStorageSize) {
    const translationsList = await Promise.all(defaultTranslationsByLocale.map(fn => fn()))
    defaultTranslations = translationsListToRecord(translationsList)
    lastDefaultTranslationsStorageSize = defaultTranslationsByLocale.length
  }

  if (currentLocaleCode !== newLocaleCode || translationsByLocale.length !== lastCurrentTranslationsStorageSize) {
    const translationsList = await Promise.all(translationsByLocale.map(fn => fn()))
    const currentTranslations = translationsListToRecord(translationsList)
    currentTranslations$.next({ ...defaultTranslations, ...currentTranslations })
    lastCurrentTranslationsStorageSize = translationsByLocale.length
  }
  currentLocaleCode = newLocaleCode

}

export function isRTLCurrentLocale() {
  return isRTL(currentLocaleCode)
}

Reflect.set(window, 'changeLocale', changeLocale)
