import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { headerStyle } from './header.style';
import { getMobileMatchMediaAndSubscribe } from '@one-inch-community/core/lit';
import '@one-inch-community/ui-components/icon';
import '@one-inch-community/widgets/wallet-manage';
import '@one-inch-community/widgets/notifications'
import { getHeaderHeight } from '../../platform/sizes';
import { styleMap } from 'lit/directives/style-map.js';
import { consume } from '@lit/context';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';
import { IApplicationContext } from '@one-inch-community/models';

@customElement(HeaderElement.tagName)
export class HeaderElement extends LitElement {
  static tagName = 'inch-header' as const

  static override styles = headerStyle

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext

  private mobileMedia = getMobileMatchMediaAndSubscribe(this)

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
          <inch-chain-selector .controller="${this.applicationContext.connectWalletController}"></inch-chain-selector>
          <inch-connect-wallet-view .controller="${this.applicationContext.connectWalletController}"></inch-connect-wallet-view>
          <inch-notifications-open-button></inch-notifications-open-button>
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
