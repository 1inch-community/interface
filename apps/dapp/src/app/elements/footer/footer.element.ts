import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { footerStyle } from './footer.style';
import { getMobileMatchMedia, changeMobileMatchMedia } from '@one-inch-community/ui-components/lit';
import '@one-inch-community/widgets/wallet-manage';
import { getFooterHeight } from '../../platform/sizes';
import { connectWalletController } from '../../controllers/connect-wallet-controller';

@customElement(FooterElement.tagName)
export class FooterElement extends LitElement {
  static tagName = 'inch-footer' as const

  static styles = footerStyle

  private mobileMedia = getMobileMatchMedia()

  connectedCallback() {
    super.connectedCallback();
    changeMobileMatchMedia(this)
  }

  protected render() {
    if (this.mobileMedia.matches) {
      return this.getMobileFooter()
    }

    return this.getDesktopFooter()
  }

  private getDesktopFooter() {
    const styles = {
      height: getFooterHeight()
    }
    return html`
      <div class="footer-container" style="${styleMap(styles)}">
        
      </div>
    `
  }

  private getMobileFooter() {
    return html`
      <div class="footer-container mobile-footer">
        <inch-chain-selector .controller="${connectWalletController}"></inch-chain-selector>
        <inch-connect-wallet-view .controller="${connectWalletController}"></inch-connect-wallet-view>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-footer': FooterElement
  }
}