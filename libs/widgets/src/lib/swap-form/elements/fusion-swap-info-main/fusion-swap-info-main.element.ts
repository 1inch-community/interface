import { html, LitElement } from 'lit';
import { fusionSwapInfoMainStyle } from './fusion-swap-info-main.style';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { observe } from '@one-inch-community/lit';
import { consume } from '@lit/context';
import { swapContext } from '../../context';
import {
  debounceTime,
  defer, distinctUntilChanged,
  shareReplay,
  startWith,
  switchMap
} from 'rxjs';
import { ISwapContext, Rate } from '@one-inch-community/models';
import { formatUnits, parseUnits } from 'viem';
import { formatSmartNumber, isRateEqual, isTokensEqual, TokenController } from '@one-inch-community/sdk';
import { dispatchEvent } from '@one-inch-community/lit';
import "@one-inch-community/ui-components/button"
import "@one-inch-community/ui-components/icon"

@customElement(FusionSwapInfoMainElement.tagName)
export class FusionSwapInfoMainElement extends LitElement {
  static tagName = 'inch-fusion-swap-info-main' as const;

  static override styles = fusionSwapInfoMainStyle

  @property({ type: Boolean }) isOpen = false;

  @consume({ context: swapContext, subscribe: true })
  context?: ISwapContext;

  readonly rate$ = defer(() => this.getContext().rate$);

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
      const isRevertedRate = isTokensEqual(primaryToken, destinationToken)
      const targetRate = isRevertedRate ? revertedRate : rate
      const rateFormated = formatSmartNumber(formatUnits(targetRate, secondaryToken.decimals), 2);
      const tokenPrice = await TokenController.getTokenUSDPrice(chainId, secondaryToken.address);
      const rateUsd = parseUnits(tokenPrice, secondaryToken.decimals)
      const rateUsdFormated = formatSmartNumber(formatUnits(rateUsd, secondaryToken.decimals), 2);
      return html`
        <span class="rate-view">1 ${secondaryToken.symbol} = ${rateFormated} ${primaryToken.symbol}  <span
          class="dst-token-rate-usd-price">~$${rateUsdFormated}</span></span>
      `;
    }),
    startWith(this.getLoadRateView()),
    shareReplay({ bufferSize: 1, refCount: true })
  );

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
      <div class="${classMap(classes)}" @click="${() => this.isOpen = true}">
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
            <span class="row-title">Slippage tolerance</span>
            <div @click="${() => dispatchEvent(this, 'openSlippageSettings', null)}" class="row-content row-slippage">
              0.4% · Auto
            </div>
          </div>
          <div class="content-row">
            <span class="row-title">Minimum receive</span>
            <div class="row-content"></div>
          </div>
          <div class="content-row">
            <span class="row-title">Network Fee</span>
            <div class="row-content"></div>
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
