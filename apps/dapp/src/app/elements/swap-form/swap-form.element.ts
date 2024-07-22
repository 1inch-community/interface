import { html, LitElement } from 'lit';
import { consume, provide } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import '@one-inch-community/ui-components/card';
import '@one-inch-community/widgets/swap-form';
import { getMobileMatchMedia, getMobileMatchMediaAndSubscribe } from '@one-inch-community/core/lit';
import { ISwapContext, IApplicationContext } from '@one-inch-community/models';
import { SwapContextToken } from '@one-inch-community/sdk/swap';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';

@customElement(SwapFormElement.tagName)
export class SwapFormElement extends LitElement {
  static tagName = 'inch-swap-form-container' as const;

  @provide({ context: SwapContextToken })
  swapContext!: ISwapContext

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext

  private mobileMedia = getMobileMatchMediaAndSubscribe(this);

  async connectedCallback() {
    await this.preloadForm(getMobileMatchMedia().matches)
    super.connectedCallback();
    this.swapContext = await this.applicationContext.makeSwapContext()
    this.requestUpdate()
    this.preloadForm(!this.mobileMedia.matches).catch(console.error)
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.swapContext.destroy()
  }

  protected render() {
    if (!this.swapContext) return
    if (this.mobileMedia.matches) {
      return html`<inch-swap-form-mobile></inch-swap-form-mobile>`
    }
    return html`<inch-swap-form-desktop></inch-swap-form-desktop>`
  }

  private async preloadForm(isMobile: boolean) {
    if (isMobile) {
      await import('./swap-form-mobile.element')
    } else {
      await import('./swap-form-desktop.element')
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-form-container': SwapFormElement;
  }
}
