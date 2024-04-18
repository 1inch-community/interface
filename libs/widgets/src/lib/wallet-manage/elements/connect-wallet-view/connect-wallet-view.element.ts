import { html, LitElement } from 'lit';
import { connectWalletViewStyle } from './connect-wallet-view.style';
import { customElement, property } from 'lit/decorators.js';
import { IConnectWalletController } from '@one-inch-community/models';
import { getMobileMatchMedia, observe, changeMobileMatchMedia } from '@one-inch-community/ui-components/lit';
import '@one-inch-community/ui-components/button';
import { defer, map } from 'rxjs';
import { formatHex } from '@one-inch-community/sdk';
import '../wallet-view-address-balance'
import { when } from 'lit/directives/when.js';

@customElement(ConnectWalletViewElement.tagName)
export class ConnectWalletViewElement extends LitElement {
  static tagName = 'inch-connect-wallet-view' as const

  static override styles = connectWalletViewStyle

  @property({ type: Object, attribute: false }) controller?: IConnectWalletController

  private readonly mobileMatchMedia = getMobileMatchMedia()

  private readonly chainId$ = defer(() => this.getController().data.chainId$)
  private readonly activeAddress$ = defer(() => this.getController().data.activeAddress$)
  private readonly info$ = defer(() => this.getController().data.info$)
  private readonly icon$ = this.info$.pipe(map((item) => item.icon))
  private readonly name$ = this.info$.pipe(map((item) => item.name))
  private readonly activeAddressView$ = this.activeAddress$.pipe(map(address => address && formatHex(address)))

  protected override firstUpdated() {
    changeMobileMatchMedia(this)
  }

  protected override render() {
    return html`
      <div class="connect-wallet-view-container">
        <img class="connect-wallet-view-icon" alt="${observe(this.name$)}" src="${observe(this.icon$)}">
        ${when(!this.mobileMatchMedia.matches, () => html`<inch-wallet-view-address-balance address="${observe(this.activeAddress$)}" chainId="${observe(this.chainId$)}"></inch-wallet-view-address-balance>`)}
        <inch-button type="secondary" size="m">
          ${observe(this.activeAddressView$)}
        </inch-button>
      </div>
    `
  }

  private getController() {
    if (!this.controller) {
      throw new Error('')
    }
    return this.controller
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-connect-wallet-view': ConnectWalletViewElement;
  }
}