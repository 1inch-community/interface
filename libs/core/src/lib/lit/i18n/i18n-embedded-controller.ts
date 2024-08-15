import { Ii18nController, Locale } from '@one-inch-community/models';
import { changeLocaleAndUpdate, initLocale, setTargetHost } from './i18n';

export class I18nEmbeddedController implements Ii18nController {

  constructor(private readonly localeCode: Locale,
              container: HTMLElement) {
    setTargetHost(container);
  }

  async init(): Promise<void> {
    await initLocale(this.localeCode)
  }

  async changeLocale(localeCode: Locale): Promise<void> {
    return await changeLocaleAndUpdate(localeCode)
  }

}
