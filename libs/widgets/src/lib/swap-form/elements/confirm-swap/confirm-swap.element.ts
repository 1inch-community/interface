import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { confirmSwapStyle } from './confirm-swap.style';
import { SwapSnapshot, TokenSnapshot } from '@one-inch-community/models';
import '@one-inch-community/widgets/token-icon'
import '@one-inch-community/ui-components/card'
import '@one-inch-community/ui-components/button'
import '@one-inch-community/ui-components/icon'
import { getWrapperNativeToken, isNativeToken, smartFormatNumber } from '@one-inch-community/sdk';
import { formatUnits } from 'viem';
import { getMobileMatchMediaAndSubscribe } from '@one-inch-community/lit';

@customElement(ConfirmSwapElement.tagName)
export class ConfirmSwapElement extends LitElement {
  static readonly tagName = 'inch-confirm-swap' as const;

  static override readonly styles = confirmSwapStyle

  @property({ type: Object }) swapSnapshot!: SwapSnapshot

  @state() state: 'swap' | 'wrap' = 'swap'

  private readonly mobileMedia = getMobileMatchMediaAndSubscribe(this);

  private get needWrap() {
    return isNativeToken(this.swapSnapshot.sourceToken.token.address)
  }

  protected override firstUpdated() {
    if (this.needWrap) {
      this.state = 'wrap'
    }
  }

  protected override render() {
    const size = this.mobileMedia.matches ? 'xl' : 'xxl';
    return html`
      <div class="confirm-swap-view">
        <inch-card-header backButton headerTextPosition="center" headerText="Confirm swap" headerTextPosition="left">
          <inch-button slot="right-container" type="tertiary-gray" size="m">
            <inch-icon icon="authRefresh36"></inch-icon>
          </inch-button>
        </inch-card-header>
        
        ${this.getTokenViewContainer()}

        <inch-button fullSize size="${size}">Confirm swap</inch-button>
      </div>
    `
  }

  private getTokenViewContainer() {
    return html`
      <div class="token-view-container">
        ${this.getTokenView(this.swapSnapshot.sourceToken, 'source')}
        ${this.getSeparatorView(this.needWrap ? 'wrap' : 'swap')}
        ${this.getTokenWrapView()}
        ${this.getTokenView(this.swapSnapshot.destinationToken, 'destination')}
      </div>
    `
  }

  private getTokenView(tokenSnapshot: TokenSnapshot, type: 'source' | 'wrap' | 'destination') {
    const amount = formatUnits(tokenSnapshot.amountView, tokenSnapshot.token.decimals)
    return html`
      <div class="token-view">
        <div class="token-view-row token-view-top">
          <span>
            ${choose(type, [
              ['source', () => html`You pay`],
              ['wrap', () => html`You wrap`],
              ['destination', () => html`You receive`]
            ])}
          </span>
          
          <span>~$999</span>
        </div>
        <div class="token-view-row">
          <div class="symbol-view">
            <inch-token-icon
              chainId="${this.swapSnapshot.chainId}"
              symbol="${tokenSnapshot.token.symbol}"
              address="${tokenSnapshot.token.address}"
            ></inch-token-icon>
            <span class="primary-text">${tokenSnapshot.token.symbol}</span>
          </div>
          <span class="primary-text">${smartFormatNumber(amount, 6)}</span>
        </div>
      </div>
    `
  }

  private getTokenWrapView() {
    if (this.needWrap) {
      const wrapTokenSnapshot: TokenSnapshot = {
        ...this.swapSnapshot.sourceToken,
        token: getWrapperNativeToken(this.swapSnapshot.chainId),
      }
      return html`
        ${this.getTokenView(wrapTokenSnapshot, 'wrap')}
        ${this.getSeparatorView('swap')}
      `
    }
    return html``
  }

  private getSeparatorView(state: 'swap' | 'wrap') {
    return html`
      <div class="separator">
        <div class="separator-view"></div>
        <div class="separator-arrow-container ${(this.state === state && this.needWrap) ? 'separator-arrow-container-loader' : ''}">
          <inch-icon icon="arrowDown24"></inch-icon>
        </div>
      </div>
    `
  }

}

declare global {
  interface HTMLElementTagNameMap {
    "inch-confirm-swap": ConfirmSwapElement
  }
}
