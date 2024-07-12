import { Ii18nController } from "@one-inch-community/models";
import { initLocale } from './i18n';

export class I18nController implements Ii18nController {

  async init(): Promise<void> {
    await initLocale()
  }

}
