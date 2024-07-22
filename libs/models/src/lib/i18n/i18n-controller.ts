import { InitializingEntity } from '../base';

export enum Locale {
  en = 'en',
  ar = 'ar',
}

export type Translations = Record<string, string>

export interface Ii18nController extends InitializingEntity {
  changeLocale(localeCode: Locale): Promise<void>
}
