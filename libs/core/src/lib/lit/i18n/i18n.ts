import { Locale, Translations } from '@one-inch-community/models';
import { isRTL } from './locale';
import { BehaviorSubject, map, Observable } from 'rxjs';

export const defaultLocaleCode: Locale = getDefaultLocaleCode()
const translations = new Map<Locale, (() => Promise<Translations>)[]>()
const currentTranslations$ = new BehaviorSubject<Translations | null>(null)
let defaultTranslations!: Translations
let currentTranslations!: Translations
let currentLocaleCode: Locale = Locale.en

let lastDefaultTranslationsStorageSize = 0
let lastCurrentTranslationsStorageSize = 0

let isInitialized = false

let targetHost: HTMLElement = document.querySelector('html')!


export const localeChange$ = currentTranslations$.pipe(
  map(() => currentLocaleCode)
)

export function setTargetHost(host: HTMLElement) {
  targetHost = host
}

export async function addTranslation(translationsRecord: Record<Locale, (() => Promise<Translations>)>) {
  for (const localeCode in translationsRecord) {
    const translation: (() => Promise<Translations>) = Reflect.get(translationsRecord, localeCode);
    const storage = translations.get(localeCode as Locale) ?? [];
    storage.push(translation);
    translations.set(localeCode as Locale, storage)
  }
  if (!isInitialized) return
  await updateLocaleAndTranslations(currentLocaleCode)
}

export async function changeLocaleAndUpdate(localeCode: Locale) {
  if (!isInitialized) return
  await updateLocaleAndTranslations(localeCode)
}

export async function initLocale(localeCode: Locale) {
  await updateLocaleAndTranslations(localeCode)
  isInitialized = true
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

const translationsListToRecord = (translationsList: Translations[]): Translations =>
  translationsList.reduce((record, translations) =>
    ({ ...record, ...translations }), {})

async function updateLocaleAndTranslations(newLocaleCode: Locale) {
  targetHost.dir = isRTL(newLocaleCode) ? 'rtl' : 'ltr'


  await Promise.all([
    updateDefaultTranslationsMap(),
    updateCurrentTranslationsMap(newLocaleCode)
  ])
  currentLocaleCode = newLocaleCode
  targetHost.lang = newLocaleCode
}

async function updateDefaultTranslationsMap() {
  const defaultTranslationsByLocale = translations.get(defaultLocaleCode) ?? []
  if (defaultTranslationsByLocale.length !== lastDefaultTranslationsStorageSize) {
    const translationsList = await Promise.all(defaultTranslationsByLocale.map(fn => fn()))
    defaultTranslations = translationsListToRecord(translationsList)
    currentTranslations$.next({ ...defaultTranslations, ...currentTranslations })
    lastDefaultTranslationsStorageSize = defaultTranslationsByLocale.length
  }
}

async function updateCurrentTranslationsMap(newLocaleCode: Locale) {
  const translationsByLocale = translations.get(newLocaleCode) ?? []
  if (currentLocaleCode !== newLocaleCode || translationsByLocale.length !== lastCurrentTranslationsStorageSize) {
    const translationsList = await Promise.all(translationsByLocale.map(fn => fn()))
    currentTranslations = translationsListToRecord(translationsList)
    currentTranslations$.next({ ...defaultTranslations, ...currentTranslations })
    lastCurrentTranslationsStorageSize = translationsByLocale.length
  }
}

export function isRTLCurrentLocale() {
  return isRTL(currentLocaleCode)
}

function getDefaultLocaleCode(): Locale {
  try {
    const userLocale: string = navigator.language || (navigator as any).userLanguage
    const code = userLocale.slice(0, 2)
    if (!(code in Locale)) return Locale.en
    return code as Locale
  } catch (error) {
    return Locale.en
  }
}

Reflect.set(window, 'changeLocale', changeLocaleAndUpdate)
