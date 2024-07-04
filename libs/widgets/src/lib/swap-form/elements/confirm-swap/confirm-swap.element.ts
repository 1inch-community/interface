import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { confirmSwapStyle } from './confirm-swap.style';
import { ISwapContext, IToken, SwapSnapshot, FusionQuoteReceiveDto } from '@one-inch-community/models';
import '@one-inch-community/widgets/token-icon'
import '@one-inch-community/ui-components/card'
import '@one-inch-community/ui-components/button'
import '@one-inch-community/ui-components/icon'
import { formatUnits } from 'viem';
import { async, dispatchEvent, getMobileMatchMediaAndSubscribe, observe } from '@one-inch-community/core/lit';
import { Observable, shareReplay, switchMap } from 'rxjs';
import { when } from 'lit/directives/when.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { isTokensEqual, TokenController } from '@one-inch-community/sdk/tokens';
import { formatSeconds, smartFormatNumber } from '@one-inch-community/core/formatters';
import { getBlockEmitter, getSymbolFromWrapToken, getWrapperNativeToken, isNativeToken } from '@one-inch-community/sdk/chain';

@customElement(ConfirmSwapElement.tagName)
export class ConfirmSwapElement extends LitElement {
  static readonly tagName = 'inch-confirm-swap' as const;

  static override readonly styles = confirmSwapStyle

  @property({ type: Object }) swapSnapshot!: SwapSnapshot<FusionQuoteReceiveDto>

  @property({ type: Object, attribute: false }) swapContext?: ISwapContext

  @state() state: 'swap' | 'wrap' | null = null

  @state() swapInProgress = false

  private fiatAmountMap = new Map<string, Observable<string>>()

  private readonly mobileMedia = getMobileMatchMediaAndSubscribe(this);

  private get needWrap() {
    return isNativeToken(this.swapSnapshot.sourceToken.address)
  }

  protected override render() {
    const size = this.mobileMedia.matches ? 'xl' : 'xxl';
    return html`
      <div class="confirm-swap-view">
        <inch-card-header backButton headerTextPosition="center" headerText="Confirm swap" headerTextPosition="left">
        </inch-card-header>
        
        ${this.getTokenViewContainer()}

        ${this.getDetailInfo()}

        <inch-button loader="${ifDefined(this.swapInProgress ? '' : undefined)}" @click="${() => this.onSwap()}" fullSize size="${size}" type="${this.swapInProgress ? 'secondary' : 'primary'}">
          ${when(this.swapInProgress,
            () => html`<span>Confirm swap in wallet</span>`,
            () => html`<span>Swap</span>`,
          )}
        </inch-button>
      </div>
    `
  }

  private async onSwap() {
    if (this.swapInProgress) return
    try {
      this.swapInProgress = true
      await this.swapContext?.fusionSwap(this.swapSnapshot)
      dispatchEvent(this, 'backCard', null)
    } catch (error) {
      //
    }
    this.swapInProgress = false
  }

  private getTokenViewContainer() {
    return html`
      <div class="token-view-container">
        ${this.getTokenView(this.swapSnapshot.sourceToken, this.swapSnapshot.sourceTokenAmount,'source')}
        ${this.getSeparatorView(this.needWrap ? 'wrap' : 'swap')}
        ${this.getTokenWrapView()}
        ${this.getTokenView(this.swapSnapshot.destinationToken, this.swapSnapshot.destinationTokenAmount, 'destination')}
      </div>
    `
  }

  private getDetailInfo() {
    return html`
      <div class="detail-info">
        ${this.getDetailInfoRow('Price', html`${async(this.getRateView())}`)}
        ${this.getDetailInfoRow('Slippage tolerance', this.getSlippageView())}
        ${this.getDetailInfoRow('Auction time', this.getAuctionTimeView())}
        ${this.getDetailInfoRow('Minimum receive', this.getMinReceive())}
        ${this.getDetailInfoRow('Network Fee', html`
          <div class="detail-info-raw-value detail-info-raw-settings-value">
            <inch-icon icon="fusion16"></inch-icon>
            <span>Free</span>
          </div>
        `)}
      </div>
    `
  }

  private async getRateView() {
    const { chainId, rate, revertedRate, sourceToken, destinationToken } = this.swapSnapshot.rate
    const primaryToken = await TokenController.getPriorityToken(chainId, [
      sourceToken.address,
      destinationToken.address
    ])
    const secondaryToken = isTokensEqual(primaryToken, sourceToken) ? destinationToken : sourceToken
    const isRevertedRate = isTokensEqual(primaryToken, sourceToken)
    const targetRate = isRevertedRate ? revertedRate : rate
    const rateFormated = smartFormatNumber(formatUnits(targetRate, secondaryToken.decimals), 2);
    return html`
      <div class="detail-info-raw-value">
        <span class="rate-view">1 ${getSymbolFromWrapToken(secondaryToken)} = ${rateFormated} ${primaryToken.symbol}</span>
      </div>
    `;
  }

  private getSlippageView() {
    const slippage = this.swapSnapshot.slippage
    return html`
      <div class="detail-info-raw-value detail-info-raw-settings-value">
        ${slippage.value === null ? '' : html`<span>${slippage.value}% · </span>`}
        <span>
          ${when(slippage.type === 'auto', () => 'Auto')}
          ${when(slippage.type === 'custom', () => 'Custom')}
          ${when(slippage.type === 'preset', () => 'Manual')}
        </span>
      </div>
      `
  }

  private getAuctionTimeView() {
    const auctionTime = this.swapSnapshot.auctionTime
    return html`
      <div class="detail-info-raw-value detail-info-raw-settings-value">
        ${auctionTime.value === null ? '' : html`<span>${formatSeconds(auctionTime.value)} · </span>`}
        <span>
          ${when(auctionTime.type === 'auto', () => 'Auto')}
          ${when(auctionTime.type === 'custom', () => 'Custom')}
          ${when(auctionTime.type === 'preset', () => 'Manual')}
      </span>
      </div>
    `
  }

  private getMinReceive() {
    const amountView = formatUnits(this.swapSnapshot.minReceive, this.swapSnapshot.destinationToken.decimals)
    return html`
      <div class="detail-info-raw-value">
        ${smartFormatNumber(amountView, 6)} ${this.swapSnapshot.destinationToken.symbol}
      </div>
    `
  }

  private getDetailInfoRow(title: string, data: TemplateResult) {
    return html`
      <div class="detail-info-row">
        <span class="detail-info-row-title">${title}</span>
        <span>${data}</span>
      </div>
    `
  }

  private getTokenView(token: IToken, amount: bigint, type: 'source' | 'wrap' | 'destination') {
    const amountView = formatUnits(amount, token.decimals)
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
          
          <span>${observe(this.getFiatAmountStream(token, amount))}</span>
        </div>
        <div class="token-view-row">
          <div class="symbol-view">
            <inch-token-icon
              chainId="${this.swapSnapshot.chainId}"
              symbol="${token.symbol}"
              address="${token.address}"
            ></inch-token-icon>
            <span class="primary-text">${token.symbol}</span>
          </div>
          <span class="primary-text">${smartFormatNumber(amountView, 6)}</span>
        </div>
      </div>
    `
  }

  private getTokenWrapView() {
    if (this.needWrap) {
      return html`
        ${this.getTokenView(getWrapperNativeToken(this.swapSnapshot.chainId), this.swapSnapshot.sourceTokenAmount,'wrap')}
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

  private getFiatAmountStream(token: IToken, amount: bigint) {
    if (this.fiatAmountMap.has(token.address)) {
      return this.fiatAmountMap.get(token.address)!
    }

    const stream = getBlockEmitter(this.swapSnapshot.chainId).pipe(
      switchMap(async () => {
        const usdPrice = await TokenController.getTokenUSDPrice(this.swapSnapshot.chainId, token.address)
        const balanceFormatted = formatUnits(amount, token.decimals);
        const balanceUsd = Number(balanceFormatted) * Number(usdPrice);
        return `~$${smartFormatNumber(balanceUsd.toString(), 2)}`
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    )
    this.fiatAmountMap.set(token.address, stream)
    return stream
  }

}

declare global {
  interface HTMLElementTagNameMap {
    "inch-confirm-swap": ConfirmSwapElement
  }
}
