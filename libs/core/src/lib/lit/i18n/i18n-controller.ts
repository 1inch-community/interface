import { Ii18nController, Locale } from '@one-inch-community/models';
import { changeLocale, initLocale } from './i18n';

export class I18nController implements Ii18nController {

  async init(): Promise<void> {
    await initLocale()
  }

  async changeLocale(localeCode: Locale): Promise<void> {
    return await changeLocale(localeCode)
  }

}
