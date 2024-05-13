import { html, LitElement } from 'lit';
import { chainSelectorListStyle } from './chain-selector-list.style';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@one-inch-community/ui-components/card';
import { ChainId, IConnectWalletController } from '@one-inch-community/models';
import { getMobileMatchMediaAndSubscribe } from '@one-inch-community/lit';
import { scrollbarStyle } from '@one-inch-community/ui-components/theme';
import '../chain-selector-list-item';

type ChainViewInfo = {
  name: string
  iconName: string
  chainId: ChainId
}

@customElement(ChainSelectorListElement.tagName)
export class ChainSelectorListElement extends LitElement {
  static tagName = 'inch-chain-selector-list' as const;

  static override styles = [
    chainSelectorListStyle,
    scrollbarStyle
  ]

  @property({ type: Array }) infoList?: ChainViewInfo[]

  @property({ type: Number }) activeChainId?: ChainId

  @property({ type: Object, attribute: false }) controller?: IConnectWalletController;

  private readonly mobileMedia = getMobileMatchMediaAndSubscribe(this);

  protected override render() {
    if (!this.infoList) return
    return this.mobileMedia.matches ? this.getMobileList() : this.getDesktopList()
  }

  private getList() {
    if (!this.infoList) return
    return this.infoList.map(info => html`
      <inch-chain-selector-list-item
        .info="${info}"
        .controller="${this.controller}"
        activeChainId="${ifDefined(this.activeChainId)}"
      ></inch-chain-selector-list-item>
    `)
  }

  private getMobileList() {
    return html`
      <inch-card class="card" forMobileView>
        <inch-card-header closeButton headerText="Select chain"></inch-card-header>
        <div class="scroll-container">
          <div class="scroll-overlay">
            ${this.getList()}
          </div>
        </div>
      </inch-card>
    `
  }

  private getDesktopList() {
    return html`
      <inch-card>
        ${this.getList()}
      </inch-card>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-chain-selector-list': ChainSelectorListElement
  }
}
