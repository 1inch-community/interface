import { html, LitElement } from 'lit';
import { fusionSwapInfoMainStyle } from './fusion-swap-info-main.style';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { observe, dispatchEvent, translate } from '@one-inch-community/core/lit';
import { consume } from '@lit/context';
import {
  debounceTime,
  defer, distinctUntilChanged, map,
  shareReplay,
  startWith,
  switchMap,
  withLatestFrom
} from 'rxjs';
import { ISwapContext, Rate } from '@one-inch-community/models';
import { formatUnits, parseUnits } from 'viem';
import "@one-inch-community/ui-components/button"
import "@one-inch-community/ui-components/icon"
import { when } from 'lit/directives/when.js';
import { isRateEqual, isTokensEqual, TokenController } from '@one-inch-community/sdk/tokens';
import { formatSeconds, smartFormatAndShorteningNumber, smartFormatNumber } from '@one-inch-community/core/formatters';
import { getSymbolFromWrapToken } from '@one-inch-community/sdk/chain';
import { BigMath } from '@one-inch-community/core/math';
import { SwapContextToken } from '@one-inch-community/sdk/swap';

@customElement(FusionSwapInfoMainElement.tagName)
export class FusionSwapInfoMainElement extends LitElement {
  static tagName = 'inch-fusion-swap-info-main' as const;

  static override styles = fusionSwapInfoMainStyle

  @property({ type: Boolean }) isOpen = false;

  @consume({ context: SwapContextToken })
  context?: ISwapContext;

  readonly rate$ = defer(() => this.getContext().rate$);
  readonly minReceive$ = defer(() => this.getContext().minReceive$);
  readonly chainId$ = defer(() => this.getContext().chainId$);
  readonly destinationToken$ = defer(() => this.getContext().getTokenByType('destination'));
  readonly slippage$ = defer(() => this.getContext().slippage$).pipe(
    map((slippage) => {

      return html`
        ${slippage.value === null ? '' : html`<span>${slippage.value}% · </span>`}
        <span>
          ${when(slippage.type === 'auto', () => 'Auto')}
          ${when(slippage.type === 'custom', () => 'Custom')}
          ${when(slippage.type === 'preset', () => 'Manual')}
        </span>
      `
    })
  );

  readonly auctionTime$ = defer(() => this.getContext().auctionTime$).pipe(
    map((auctionTime) => {

      return html`
        ${auctionTime.value === null ? '' : html`<span>${formatSeconds(auctionTime.value)} · </span>`}
        <span>
          ${when(auctionTime.type === 'auto', () => 'Auto')}
          ${when(auctionTime.type === 'custom', () => 'Custom')}
          ${when(auctionTime.type === 'preset', () => 'Manual')}
        </span>
      `
    })
  );

  readonly rateView$ = this.rate$.pipe(
    debounceTime(0),
    distinctUntilChanged(rateViewDistinctUntilChangedHandler),
    switchMap(async (rateData) => {
      if (rateData === null) return this.getLoadRateView();
      const { chainId, rate, revertedRate, sourceToken, destinationToken } = rateData
      const primaryToken = await TokenController.getPriorityToken(chainId, [
        sourceToken.address,
        destinationToken.address
      ])
      const secondaryToken = isTokensEqual(primaryToken, sourceToken) ? destinationToken : sourceToken
      const isRevertedRate = isTokensEqual(primaryToken, sourceToken)
      const targetRate = isRevertedRate ? revertedRate : rate
      const rateFormated = smartFormatNumber(formatUnits(targetRate, secondaryToken.decimals), 2);
      const tokenPrice = await TokenController.getTokenUSDPrice(chainId, secondaryToken.address);
      const rateUsd = parseUnits(tokenPrice, secondaryToken.decimals)
      const rateUsdFormated = smartFormatNumber(formatUnits(rateUsd, secondaryToken.decimals), 2);
      return html`
        <span class="rate-view">1 ${getSymbolFromWrapToken(secondaryToken)} = ${rateFormated} ${primaryToken.symbol}  <span
          class="dst-token-rate-usd-price">~$${rateUsdFormated}</span></span>
      `;
    }),
    startWith(this.getLoadRateView()),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly minReceiveView$ = this.minReceive$.pipe(
    withLatestFrom(this.destinationToken$, this.chainId$),
    switchMap(async ([ minReceive, dstToken, chainId ]) => {
      if (!dstToken || !chainId) return html``
      const tokenPrice = await TokenController.getTokenUSDPrice(chainId, dstToken.address);
      const rateUsd = parseUnits(tokenPrice, dstToken.decimals)
      const amountUsd = BigMath.mul(
        minReceive,
        rateUsd,
        dstToken.decimals,
        dstToken.decimals
      )
      const amountUsdFormated = smartFormatAndShorteningNumber(formatUnits(amountUsd, dstToken.decimals), 2);

      return html`
        <span>~$${amountUsdFormated}</span>
        <span class="min-receive">${smartFormatAndShorteningNumber(formatUnits(minReceive, dstToken.decimals), 6)} ${dstToken.symbol}</span>
      `
    })
  )

  override connectedCallback() {
    super.connectedCallback();
    dispatchEvent(this, 'changeFusionInfoOpenState', this.isOpen)
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    dispatchEvent(this, 'changeFusionInfoOpenState', false)
  }

  protected override render() {
    const classes = {
      container: true,
      open: this.isOpen
    };
    const iconClasses = {
      icon: true,
      'open-icon': this.isOpen
    };
    const fusionIconClass = {
      'fusion-icon': true,
      'fusion-icon-open': this.isOpen
    };
    return html`
      <div class="${classMap(classes)}" @click="${() => {
        if (this.isOpen) return
        this.isOpen = true;
        dispatchEvent(this, 'changeFusionInfoOpenState', this.isOpen)
      }}">
        <div class="rate-container">
          ${observe(this.rateView$)}
        </div>
        <div class="fusion-info">
          <div class="${classMap(fusionIconClass)}">
            <inch-icon icon="fusion16"></inch-icon>
            <span>Free</span>
          </div>
          <inch-button @click="${(event: MouseEvent) => this.onChangeOpen(event)}" size="l" type="tertiary">
            <inch-icon class="${classMap(iconClasses)}" icon="chevronDown16"></inch-icon>
          </inch-button>
        </div>
        <div class="content-container">
          <div class="content-row">
            <span class="row-title">${translate('widgets.swap-form.fusion-info.slippage-tolerance')}</span>
            <div @click="${() => dispatchEvent(this, 'openSlippageSettings', null)}" class="row-content row-slippage">
              ${observe(this.slippage$)}
            </div>
          </div>
          <div class="content-row">
            <span class="row-title">${translate('widgets.swap-form.fusion-info.auction-time')}</span>
            <div @click="${() => dispatchEvent(this, 'openAuctionTimeSettings', null)}" class="row-content row-slippage">
              ${observe(this.auctionTime$)}
            </div>
          </div>
          <div class="content-row">
            <span class="row-title">${translate('widgets.swap-form.fusion-info.min-receive')}</span>
            <div class="row-content">
              ${observe(this.minReceiveView$)}
            </div>
          </div>
          <div class="content-row">
            <span class="row-title">${translate('widgets.swap-form.fusion-info.net-fee')}</span>
            <div class="row-content">
              <inch-icon icon="fusion16"></inch-icon>
              <span>Free</span>
            </div>
          </div>
        </div>
      </div>
    `
  }

  private getLoadRateView() {
    return html`
      <div class="rate-loader"></div>
    `;
  }

  private onChangeOpen(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isOpen = !this.isOpen;
    dispatchEvent(this, 'changeFusionInfoOpenState', this.isOpen)
  }

  private getContext() {
    if (!this.context) throw new Error('');
    return this.context;
  }

}

function rateViewDistinctUntilChangedHandler(rate1: Rate | null, rate2: Rate | null) {
  if (rate1 === null || rate2 === null) {
      return false;
  }
  return isRateEqual(rate1, rate2);
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-fusion-swap-info-main': FusionSwapInfoMainElement
  }
}
