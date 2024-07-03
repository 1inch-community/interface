import { html, LitElement } from 'lit';
import { chainSelectorListItemStyle } from './chain-selector-list-item.style';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '@one-inch-community/ui-components/icon';
import { ChainId, IConnectWalletController } from '@one-inch-community/models';
import { isL2Chain } from '@one-inch-community/sdk/chain';
import { dispatchEvent, getMobileMatchMediaAndSubscribe, isRTLCurrentLocale } from '@one-inch-community/core/lit';
import { when } from 'lit/directives/when.js';

type ChainViewInfo = {
  name: string
  iconName: string
  chainId: ChainId
}

@customElement(ChainSelectorListItemElement.tagName)
export class ChainSelectorListItemElement extends LitElement {
  static tagName = 'inch-chain-selector-list-item' as const;

  static override styles = chainSelectorListItemStyle

  private readonly mobileMedia = getMobileMatchMediaAndSubscribe(this)

  @property({ type: Object }) info?: ChainViewInfo

  @property({ type: Number }) activeChainId?: ChainId

  @property({ type: Object, attribute: false }) controller?: IConnectWalletController;

  protected override render() {
    if (!this.info) return
    const isL2 = isL2Chain(this.info.chainId)
    const isActiveChain = Number(this.info.chainId) === this.activeChainId
    const classes = {
      container: true,
      active: isActiveChain
    }
    const iconSize = this.mobileMedia.matches ? 26 : 24
    return html`
      <div class="${classMap(classes)}" @click="${() => this.setChainId()}">
        ${when(isL2, () => html`<inch-icon icon="${isRTLCurrentLocale() ? 'l2ChainRTL24' : 'l2Chain24'}"></inch-icon>`)}
        <inch-icon width="${iconSize}px" height="${iconSize}px" icon="${this.info.iconName}"></inch-icon>
        <span>${this.info.name}</span>
        <inch-icon class="list-icon" icon="link16"></inch-icon>
      </div>
    `
  }

  private async setChainId() {
    if (!this.info) throw new Error('')
    await this.controller?.changeChain(this.info.chainId)
    dispatchEvent(this, 'closeCard', null)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-chain-selector-list-item': ChainSelectorListItemElement
  }
}
