import { ChainId } from '../chain';
import { Locale } from '../i18n';
import { ColorHex } from './bootstrap-config';

export interface IEmbeddedController {
  setChainId(chainId: ChainId): Promise<void>
  setLocale(localeCode: Locale): Promise<void>
  setThemeType(themeType: 'dark' | 'light'): Promise<void>;
  setThemePrimaryColor(primaryColor: ColorHex): Promise<void>;
  destroy(): void
}
