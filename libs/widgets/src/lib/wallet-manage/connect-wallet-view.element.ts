import { html, LitElement } from 'lit';
import { connectWalletViewStyle } from './connect-wallet-view.style';
import { customElement, property } from 'lit/decorators.js';
import { IConnectWalletController } from '@one-inch-community/models';
import { getMobileMatchMedia, observe, changeMobileMatchMedia } from '@one-inch-community/ui-components/lit';
import { OverlayController } from '@one-inch-community/ui-components/overlay';
import '@one-inch-community/ui-components/button';
import { defer, map } from 'rxjs';
import { formatHex, CacheActivePromise } from '@one-inch-community/sdk';
import './elements/wallet-view-address-balance'
import { when } from 'lit/directives/when.js';
import './wallet-manage.element'

@customElement(ConnectWalletViewElement.tagName)
export class ConnectWalletViewElement extends LitElement {
  static tagName = 'inch-connect-wallet-view' as const

  static override styles = connectWalletViewStyle

  @property({ type: Object, attribute: false }) controller?: IConnectWalletController

  private readonly mobileMatchMedia = getMobileMatchMedia()

  private readonly overlay = new OverlayController(
    '#app-root',
    this
  )

  private overlayId: number | null = null

  private readonly chainId$ = defer(() => this.getController().data.chainId$)
  private readonly activeAddress$ = defer(() => this.getController().data.activeAddress$)
  private readonly info$ = defer(() => this.getController().data.info$)
  private readonly icon$ = this.info$.pipe(map((item) => item.icon))
  private readonly name$ = this.info$.pipe(map((item) => item.name))
  private readonly activeAddressView$ = this.activeAddress$.pipe(map(address => {
    return address && formatHex(address)
  }))

  private readonly view$ = defer(() => this.getController().data.isConnected$).pipe(
    map((isConnected) => {
      return isConnected ? this.getConnectedView() : this.getConnectWalletButton()
    })
  )

  protected override firstUpdated() {
    changeMobileMatchMedia(this)
  }

  protected override render() {
    return html`${observe(this.view$)}`
  }

  private getConnectedView() {
    return html`
      <div class="connect-wallet-view-container">
        <img class="connect-wallet-view-icon" alt="${observe(this.name$)}" src="${observe(this.icon$)}">
        ${when(!this.mobileMatchMedia.matches, () => html`<inch-wallet-view-address-balance address="${observe(this.activeAddress$)}" chainId="${observe(this.chainId$)}"></inch-wallet-view-address-balance>`)}
        <inch-button @click="${() => this.onOpenConnectView()}" type="secondary" size="m">
          ${observe(this.activeAddressView$)}
        </inch-button>
      </div>
    `
  }

  private getConnectWalletButton() {
    return html`
      <inch-button @click="${() => this.onOpenConnectView()}" type="secondary" >Connect wallet</inch-button>
    `
  }

  private getController() {
    if (!this.controller) {
      throw new Error('')
    }
    return this.controller
  }

  @CacheActivePromise()
  private async onOpenConnectView() {
    debugger
    if (this.overlay.isOpen) {
      await this.overlay.close(this.overlayId ?? 0)
      this.overlayId = null
      return
    }
    this.overlayId = await this.overlay.open(html`
      <inch-wallet-manage @closeCard="${() => {
        if (!this.overlayId) return
        this.overlay.close(this.overlayId)
        this.overlayId = null
      }}" .controller="${this.controller}" ></inch-wallet-manage>
    `)
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-connect-wallet-view': ConnectWalletViewElement;
  }
}