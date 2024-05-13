import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { headerStyle } from './header.style';
import { changeMobileMatchMedia, getMobileMatchMedia } from '@one-inch-community/lit';
import '@one-inch-community/ui-components/icon';
import '@one-inch-community/widgets/wallet-manage';
import { getHeaderHeight } from '../../platform/sizes';
import { styleMap } from 'lit/directives/style-map.js';
import { connectWalletController } from '../../controllers/connect-wallet-controller';

@customElement(HeaderElement.tagName)
export class HeaderElement extends LitElement {
  static tagName = 'inch-header' as const

  static override styles = headerStyle

  private mobileMedia = getMobileMatchMedia()

  connectedCallback() {
    super.connectedCallback();
    changeMobileMatchMedia(this)
  }

  protected render() {
    if (this.mobileMedia.matches) {
      return this.getMobileHeader()
    }

    return this.getDesktopHeader()
  }

  private getDesktopHeader() {
    const styles = {
      height: `${getHeaderHeight()}px`
    }
    return html`
      <div class="header-container" style="${styleMap(styles)}">
        <div class="left-content">
          <inch-icon icon="logoFull"></inch-icon>
        </div>
        <div class="right-content">
          <inch-chain-selector .controller="${connectWalletController}"></inch-chain-selector>
          <inch-connect-wallet-view .controller="${connectWalletController}"></inch-connect-wallet-view>
        </div>
      </div>
    `
  }

  private getMobileHeader() {
    return html`
      <div class="header-container mobile-header">
        <inch-icon icon="logoFull"></inch-icon>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-header': HeaderElement
  }
}
