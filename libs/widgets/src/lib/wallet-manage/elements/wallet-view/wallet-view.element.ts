import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { walletViewStyle } from './wallet-view.style';
import { ChainId, EIP6963ProviderInfo, IConnectWalletController } from '@one-inch-community/models';
import { formatHex } from '@one-inch-community/sdk';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { map as litMap } from 'lit/directives/map.js';
import '@one-inch-community/ui-components/icon';
import { appendStyle, async, subscribe } from '@one-inch-community/ui-components/lit';
import { tap } from 'rxjs';
import { Address } from 'viem';
import { consume } from '@lit/context';
import { controllerContext } from '../../context';
import '../wallet-view-address-balance'

@customElement(WalletViewElement.tagName)
export class WalletViewElement extends LitElement {
  static tagName = 'inch-wallet-view' as const;

  static override styles = walletViewStyle;

  @property({ type: Object }) info?: EIP6963ProviderInfo;

  @state() private showLoader = false;

  @state() private isWalletConnected = false;

  @state() private addressList: Address[] | null = null;

  @state() private activeAddress: Address | null = null;

  @state() private showAddresses = false;

  @state() private isActiveWallet = false;

  @state() private chainId?: ChainId;

  @consume({ context: controllerContext })
  private controller?: IConnectWalletController;

  protected override firstUpdated() {
    if (!this.info) {
      throw new Error('');
    }
    const providerDataAdapter = this.getController().getDataAdapter(this.info);
    const globalDataAdapter = this.getController().data;
    subscribe(this, [
      providerDataAdapter.isConnected$.pipe(tap(state => this.isWalletConnected = state)),
      providerDataAdapter.activeAddress$.pipe(tap(state => this.activeAddress = state)),
      providerDataAdapter.addresses$.pipe(tap((state) => this.addressList = !state.length ? null : state)),
      globalDataAdapter.chainId$.pipe(tap(state => this.chainId = state ?? undefined)),
      globalDataAdapter.isActiveWallet$(this.info).pipe(tap(state => this.isActiveWallet = state)),
    ], { requestUpdate: false });
  }

  protected override render() {
    if (!this.info) {
      throw new Error('');
    }
    const addressListLength = (this.addressList?.length ?? 0)
    const height = (this.showAddresses && addressListLength > 1 ? addressListLength * 64 : 0) + 64;

    appendStyle(this, {
      height: `${height}px`
    });

    return html`
      <div class="wallet-view-container" @click="${() => this.onClick()}">
        <div class="data-container left-data">
          <img class="wallet-icon" alt="${this.info.name}" src="${this.info.icon}">
          <span class="wallet-name">${this.info.name}</span>
        </div>
        <div class="data-container right-data">
          ${when(this.activeAddress, (address) => html`
            <span>${formatHex(address)}</span>
          `)}
          ${when(this.showLoader,
            () => html`
              <inch-icon class="loader-icon" icon="fire48"></inch-icon>`,
            () => {
              const classes = {
                'connect-icon': true,
                'connect-icon__connected': this.isWalletConnected,
                'connect-icon__active': this.isActiveWallet
              };
              return html`
                <inch-icon class="${classMap(classes)}" icon="connect16"></inch-icon>`;
            }
          )}
        </div>
      </div>


      ${when(this.addressList && this.addressList.length > 1,
        () => html`
          <div class="address-list">
            ${litMap(this.addressList!, address => {
              return html`
                <div @click="${() => this.setActiveAddress(address)}" class="wallet-view-container address-container ${async(this.isActiveAddress(address).then(state => state ? 'address-container__active' : ''))}">
                  <div class="data-container left-data">
                    <inch-icon icon="cornerDownRight16"></inch-icon>
                    <span>${formatHex(address, { width: this.offsetWidth })}</span>
                  </div>
                  <div class="data-container right-data">
                    <inch-wallet-view-address-balance chainId="${ifDefined(this.chainId)}" address="${address}"></inch-wallet-view-address-balance>
                    <inch-icon class="connect-icon ${async(this.isActiveAddress(address).then(state => state ? 'connect-icon__active' : ''))}" icon="link16"></inch-icon>
                  </div>
                </div>
              `;
            })}
          </div>
        `
      )}
    `;
  }

  private async onClick() {
    if (this.isWalletConnected) {
      if (this.addressList && this.addressList.length === 1) {
        await this.setActiveAddress(this.addressList[0])
        return
      }
      this.showAddresses = !this.showAddresses;
      return;
    }
    if (!this.info) return;
    this.showLoader = true;
    this.showAddresses = await this.getController().connect(this.info);
    this.showLoader = false;
  }

  private async setActiveAddress(address: Address) {
    if (!this.info) return;
    await this.getController().setActiveAddress(this.info, address);
  }


  private getController() {
    if (!this.controller) {
      throw new Error('');
    }
    return this.controller;
  }

  private isActiveAddress(address: Address): Promise<boolean> {
    if (!this.info) throw new Error('')
    return this.getController().data.isActiveAddress(this.info, address)
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-wallet-view': WalletViewElement;
  }
}