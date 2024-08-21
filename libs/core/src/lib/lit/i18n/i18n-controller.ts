import { Ii18nController, Locale } from '@one-inch-community/models';
import { changeLocaleAndUpdate, defaultLocaleCode } from './i18n';
import { SettingsController } from '@one-inch-community/core/settings';

export class I18nController implements Ii18nController {

  private readonly i18nSettings = new SettingsController(
    'i18n',
    defaultLocaleCode
  )

  async init(): Promise<void> {
    const settingsValue = this.i18nSettings.value ?? defaultLocaleCode
    await changeLocaleAndUpdate(settingsValue)
  }

  async changeLocale(localeCode: Locale): Promise<void> {
    this.i18nSettings.setValue(localeCode)
    return await changeLocaleAndUpdate(localeCode)
  }

}
