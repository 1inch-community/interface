import { html, LitElement } from 'lit';
import { fusionSwapInfoMainStyle } from './fusion-swap-info-main.style';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { observe } from '@one-inch-community/ui-components/lit';
import { consume } from '@lit/context';
import { swapContext } from '../../context';
import { combineLatest, debounceTime, defer, distinctUntilChanged, shareReplay, startWith, switchMap } from 'rxjs';
import { ISwapContext } from '@one-inch-community/models';
import { formatUnits, parseUnits } from 'viem';
import { BigMath, formatSmartNumber, isTokensEqual, TokenController } from '@one-inch-community/sdk';

@customElement(FusionSwapInfoMainElement.tagName)
export class FusionSwapInfoMainElement extends LitElement {
  static tagName = 'inch-fusion-swap-info-main' as const;

  static override styles = fusionSwapInfoMainStyle

  @state() isOpen = false;

  @consume({ context: swapContext, subscribe: true })
  context?: ISwapContext;

  readonly rate$ = defer(() => this.getContext().rate$);
  readonly chainId$ = defer(() => this.getContext().chainId$);
  readonly sourceToken$ = defer(() => this.getContext().getTokenByType('source'));
  readonly destinationToken$ = defer(() => this.getContext().getTokenByType('destination'));

  readonly rateView$ = combineLatest([
    this.chainId$,
    this.rate$,
    this.sourceToken$,
    this.destinationToken$
  ]).pipe(
    debounceTime(0),
    distinctUntilChanged(([chainId1, rate1, sourceToken1, destinationToken1], [chainId2, rate2, sourceToken2, destinationToken2]) => {
      return chainId1 === chainId2
        && rate1 === rate2
        && (!(sourceToken1 && sourceToken2) || isTokensEqual(sourceToken1, sourceToken2))
        && (!(destinationToken1 && destinationToken2) || isTokensEqual(destinationToken1, destinationToken2))
        && sourceToken1 === sourceToken2
        && destinationToken1 === destinationToken2;
    }),
    switchMap(async ([chainId, rate, sourceToken, destinationToken]) => {
      if (!chainId || !sourceToken || !destinationToken || rate === 0n) return this.getLoadRateView();
      const rateFormated = formatSmartNumber(formatUnits(rate, sourceToken.decimals), 2);

      const tokenPrice = await TokenController.getTokenUSDPrice(chainId, destinationToken.address);
      const tokenPriceBn = parseUnits(tokenPrice, destinationToken.decimals);
      const rateUsd = BigMath.mul(
        rate,
        tokenPriceBn,
        sourceToken.decimals,
        destinationToken.decimals
      );
      const rateUsdFormated = formatSmartNumber(formatUnits(rateUsd, destinationToken.decimals), 2);
      return html`
        <span class="rate-view">1 ${sourceToken.symbol} = ${rateFormated} ${destinationToken.symbol}  <span
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
            <div class="row-content row-slippage">
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

declare global {
  interface HTMLElementTagNameMap {
    'inch-fusion-swap-info-main': FusionSwapInfoMainElement
  }
}