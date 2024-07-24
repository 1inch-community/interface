import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { footerStyle } from './footer.style';
import { getMobileMatchMedia, changeMobileMatchMedia } from '@one-inch-community/core/lit';
import { getEnvironmentValue } from '@one-inch-community/core/environment';
import { getFooterHeight } from '../../platform/sizes';
import { consume } from '@lit/context';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';
import { IApplicationContext } from '@one-inch-community/models';
import '@one-inch-community/widgets/wallet-manage';
import '@one-inch-community/widgets/notifications'
import { OverlayMobileController } from '@one-inch-community/ui-components/overlay';

import('@one-inch-community/ui-components/card');
import('../settings');

@customElement(FooterElement.tagName)
export class FooterElement extends LitElement {
  static tagName = 'inch-footer' as const

  static styles = footerStyle

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext

  private mobileMedia = getMobileMatchMedia()

  private readonly mobileOverlay = new OverlayMobileController('app-root');

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
      height: `${getFooterHeight()}px`
    }
    return html`
      <div class="footer-container" style="${styleMap(styles)}">
        <span class="power-by">© ${new Date().getFullYear()} Powered by 1inch</span>
        <span class="version">version: ${getEnvironmentValue('appVersion')}</span>
      </div>
    `
  }

  private getMobileFooter() {
    return html`
      <div class="footer-container mobile-footer">

        <inch-chain-selector .controller="${this.applicationContext.connectWalletController}"></inch-chain-selector>
        <inch-connect-wallet-view .controller="${this.applicationContext.connectWalletController}"></inch-connect-wallet-view>
        
        <inch-notifications-open-button></inch-notifications-open-button>

        <inch-button @click="${() => this.onOpenSettings()}" type="primary-gray" size="l">
          <inch-icon icon="settings24"></inch-icon>
        </inch-button>
      
      </div>
    `
  }

  private async onOpenSettings() {
    const id = await this.mobileOverlay.open(html`
      <inch-card forMobileView>
        <inch-settings
          @closeSettings="${() => this.mobileOverlay.close(id)}"
        ></inch-settings>
      </inch-card>
    `)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-footer': FooterElement
  }
}
