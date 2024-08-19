import { adoptStyles, CSSResult, html, LitElement } from 'lit';
import { provide, ContextProvider } from '@lit/context';
import { ApplicationContextToken, EmbeddedConfigToken } from '@one-inch-community/core/application-context';
import { customElement } from 'lit/decorators.js';
import {
  ColorHex,
  EmbeddedBootstrapConfig,
  IApplicationContext,
  IGlobalEmbeddedContextElement,
  MainColors
} from '@one-inch-community/models';
import { fontStyle, mainColorMap, makeColorSchema } from '@one-inch-community/core/theme';
import { SwapContextToken } from '@one-inch-community/sdk/swap';

const contextHolder = new WeakMap<LitElement, IApplicationContext>()

@customElement(GlobalEmbeddedContextElement.tagName)
export class GlobalEmbeddedContextElement extends LitElement implements IGlobalEmbeddedContextElement {
  static readonly tagName = 'global-embedded-context';

  @provide({ context: EmbeddedConfigToken })
  config!: EmbeddedBootstrapConfig;

  private styles: Map<string, CSSResult> = new Map();

  private isRendered = false;

  connectedCallback() {
    super.connectedCallback();
    this.isRendered = true;
    this.updateStyles();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.isRendered = false;
  }

  async setConfig(config: EmbeddedBootstrapConfig) {
    this.config = config
    await Promise.all([
      this.setThemePrimaryColor(config.primaryColor),
      this.setThemeType(config.themeType),
      this.setFounts()
    ]);
    this.updateStyles();
  }

  async setContext(context: IApplicationContext) {
    contextHolder.set(this, context);
    const swapContext = await context.makeSwapContext();
    new ContextProvider(this, { context: ApplicationContextToken, initialValue: context })
    new ContextProvider(this, { context: SwapContextToken, initialValue: swapContext })
  }

  protected render() {
    return html`
      <slot></slot>`;
  }

  async setThemePrimaryColor(primaryColor: ColorHex) {
    const color = makeColorSchema(primaryColor, ':host');
    this.styles.set('primary-color', color);
    this.updateStyles()
  }

  async setThemeType(themeType: 'dark' | 'light') {
    const themeName = themeType === 'dark' ? MainColors.dark : MainColors.light;
    const color = await mainColorMap[themeName](':host');
    this.styles.set('theme-color', color);
    this.updateStyles()
  }

  private async setFounts() {
    this.styles.set('fonts', fontStyle);
  }

  private updateStyles() {
    if (!this.isRendered) return;
    if (!this.shadowRoot) throw new Error('');
    const elementStyles = GlobalEmbeddedContextElement.finalizeStyles([...this.styles.values()]);
    adoptStyles(
      this.shadowRoot,
      elementStyles
    );
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'global-embedded-context': GlobalEmbeddedContextElement;
  }
}
