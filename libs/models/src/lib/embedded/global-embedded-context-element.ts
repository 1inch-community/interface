import { ColorHex } from './bootstrap-config';

export interface IGlobalEmbeddedContextElement extends HTMLElement {
  setThemeType(themeType: 'dark' | 'light'): Promise<void>;
  setThemePrimaryColor(primaryColor: ColorHex): Promise<void>
}
