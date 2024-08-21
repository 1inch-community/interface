import { Ii18nController, Locale } from '@one-inch-community/models';
import { changeLocaleAndUpdate, setTargetHost } from './i18n';

export class I18nEmbeddedController implements Ii18nController {

  constructor(private readonly localeCode: Locale,
              container: HTMLElement) {
    setTargetHost(container);
  }

  async init(): Promise<void> {
    await changeLocaleAndUpdate(this.localeCode)
  }

  async changeLocale(localeCode: Locale): Promise<void> {
    return await changeLocaleAndUpdate(localeCode)
  }

}
