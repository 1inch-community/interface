import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '@one-inch-community/ui-components/button';
import { consume } from '@lit/context';
import { swapContext } from '../../context';
import { ChainId, ISwapContext, IToken, Rate } from '@one-inch-community/models';
import {
  combineLatest,
  debounceTime,
  defer,
  distinctUntilChanged,
  firstValueFrom,
  map,
  Observable,
  of,
  startWith,
  switchMap, tap
} from 'rxjs';
import {
  observe,
  dispatchEvent,
  getMobileMatchMediaAndSubscribe,
  getMobileMatchMediaEmitter,
  mobileMediaCSS,
  subscribe
} from '@one-inch-community/lit';
import { Address } from 'viem';
import { isChainId, TokenController } from '@one-inch-community/sdk';
import { BrandColors, getThemeChange, getRainbowGradient } from '@one-inch-community/ui-components/theme';

@customElement(SwapButton.tagName)
export class SwapButton extends LitElement {
  static tagName = 'inch-swap-button' as const;

  static override styles = css`
      :host {
          height: 57px;
      }

      ${mobileMediaCSS(css`
          :host {
              height: 44px;
          }
      `)}
      .smart-hover {
          position: relative;
          overflow: hidden;
      }
      .on-hover,
      .off-hover {
          position: absolute;
          transition: transform .2s;
      }
      
      .on-hover {
          transform: translateY(-200%);
      }

      .rainbow {
          --button-text-color-ext: #ffffff;
          --button-text-color-ext-hover: #ffffff;
          position: relative;
      }

      .rainbow:after, .rainbow:before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: ${getRainbowGradient()};
          background-size: 1000%;
          animation: bg-rainbow 300s cubic-bezier(0.4, 0, 1, 1) infinite;
          z-index: -1;
      }

      @keyframes bg-rainbow {
          0% {
              border-radius: 24px;
              background-position: 0 0;
          }
          50% {
              border-radius: 24px;
              background-size: 800%;
              background-position: 400% 0;
          }
          100% {
              border-radius: 24px;
              background-position: 0 0;
          }
      }
      @media (hover: hover) {
          .smart-hover:hover .on-hover {
              transform: translateY(0);
          }

          .smart-hover:hover .off-hover {
              transform: translateY(200%);
          }
      }
      @media (hover: none) {
          .smart-hover .on-hover {
              transform: translateY(0);
          }

          .smart-hover .off-hover {
              transform: translateY(200%);
          }
      }

  `;

  @consume({ context: swapContext, subscribe: true })
  context?: ISwapContext;

  @state() private isRainbowTheme = false;

  private readonly mobileMedia = getMobileMatchMediaAndSubscribe(this);

  private readonly connectedWalletAddress$ = defer(() => this.getConnectedWalletAddress());
  private readonly sourceToken$ = defer(() => this.getSourceToken());
  private readonly destinationToken$ = defer(() => this.getDestinationToken());
  private readonly chainId$ = defer(() => this.getChainId());
  private readonly sourceTokenAmount$ = defer(() => this.getSourceTokenAmount());
  private readonly rate$ = defer(() => this.getRate());

  private readonly exceedingMaximumAmount$ = combineLatest([
    this.connectedWalletAddress$,
    this.sourceToken$,
    this.sourceTokenAmount$.pipe(startWith(0n))
  ]).pipe(
    switchMap(([wallet, sourceToken, amount]) => {
      if (!wallet || !sourceToken || amount === 0n) return of(false);
      return TokenController.getTokenBalance(sourceToken.chainId, sourceToken.address, wallet).then(balance => {
        if (!balance) return false;
        return !amount || amount > BigInt(balance.amount);
      });
    })
  );

  private readonly view$: Observable<TemplateResult> = combineLatest([
    this.connectedWalletAddress$,
    this.sourceToken$,
    this.destinationToken$,
    this.exceedingMaximumAmount$,
    this.sourceTokenAmount$.pipe(startWith(0n)),
    this.chainId$,
    this.rate$.pipe(startWith(null)),
    getMobileMatchMediaEmitter().pipe(startWith(null))
  ]).pipe(
    debounceTime(0),
    map(([
           walletAddress,
           srcToken,
           dstToken,
           exceedingMaximumAmount,
           amount,
           chainId,
           rate
         ]) => this.getSwapButtonView(
      chainId,
      walletAddress,
      srcToken,
      dstToken,
      exceedingMaximumAmount,
      amount,
      rate
    ))
  );

  override connectedCallback() {
    super.connectedCallback();
    subscribe(this, [
      getThemeChange().pipe(
        map(({ brandColor }) => brandColor),
        distinctUntilChanged(),
        tap(color => this.isRainbowTheme = color === BrandColors.rainbow)
      )
    ]);
  }

  protected override render() {
    return html`${observe(this.view$)}`;
  }

  private getSwapButtonView(
    chainId: ChainId | null,
    walletAddress: Address | null,
    srcToken: IToken | null,
    dstToken: IToken | null,
    exceedingMaximumAmount: boolean,
    amount: bigint | null,
    rate: Rate | null,
  ): TemplateResult {
    const size = this.mobileMedia.matches ? 'xl' : 'xxl';

    const classes = {
      // 'rainbow': this.isRainbowTheme
    };

    if (!isChainId(chainId)) {
      return html`
        <inch-button class="smart-hover" @click="${() => dispatchEvent(this, 'changeChain', null)}"
                     type="secondary" size="${size}" fullSize>
          <span class="off-hover">Chain ${chainId} not supported</span>
          <span class="on-hover">Change chain</span>
          <br>
        </inch-button>
      `
    }

    if (!walletAddress) {
      return html`
        <inch-button class="${classMap(classes)}" @click="${() => dispatchEvent(this, 'connectWallet', null)}"
                     type="secondary" size="${size}" fullSize>
          Connect wallet
        </inch-button>
      `;
    }

    if (!srcToken) {
      return html`
        <inch-button @click="${(event: MouseEvent) => dispatchEvent(this, 'openTokenSelector', 'source', event)}"
                     type="secondary" size="${size}" fullSize>
          Select source token
        </inch-button>
      `;
    }

    if (!dstToken) {
      return html`
        <inch-button @click="${(event: MouseEvent) => dispatchEvent(this, 'openTokenSelector', 'destination', event)}"
                     type="secondary" size="${size}" fullSize>
          Select destination token
        </inch-button>
      `;
    }

    if (!amount || amount === 0n) {
      return html`
        <inch-button type="secondary" size="${size}" fullSize disabled>
          Enter amount to swap
        </inch-button>
      `;
    }

    if (exceedingMaximumAmount) {
      return html`
        <inch-button class="smart-hover" @click="${() => this.onSetMax()}" type="secondary" size="${size}" fullSize>
          <span class="off-hover">Insufficient ${srcToken.symbol} balance</span>
          <span class="on-hover">Set max ${srcToken.symbol}</span>
          <br>
        </inch-button>
      `;
    }

    if (rate === null) {
      return html`
        <inch-button type="secondary" size="${size}" fullSize disabled>
          No liquidity for swap
        </inch-button>
      `;
    }

    return html`
      <inch-button @click="${() => this.onSwap()}" type="primary" size="${size}" fullSize>
        Swap
      </inch-button>
    `;
  }

  private async onSetMax() {
    const sourceToken = await firstValueFrom(this.sourceToken$);
    const connectedWalletAddress = await firstValueFrom(this.connectedWalletAddress$);
    if (!sourceToken || !connectedWalletAddress) return;
    const balance = await TokenController.getTokenBalance(sourceToken.chainId, sourceToken.address, connectedWalletAddress);
    this.context?.setTokenAmountByType('source', BigInt(balance?.amount ?? 0), true);
  }

  private async onClick() {
    const address = await firstValueFrom(this.connectedWalletAddress$);
    if (!address) {
      dispatchEvent(this, 'connectWallet', null);
      return;
    }
  }

  private onSwap() {
    //
  }

  private getConnectedWalletAddress() {
    if (!this.context) throw new Error('');
    return this.context.connectedWalletAddress$;
  }

  private getChainId() {
    if (!this.context) throw new Error('');
    return this.context.chainId$;
  }

  private getSourceToken() {
    if (!this.context) throw new Error('');
    return this.context.getTokenByType('source');
  }

  private getDestinationToken() {
    if (!this.context) throw new Error('');
    return this.context.getTokenByType('destination');
  }

  private getSourceTokenAmount() {
    if (!this.context) throw new Error('');
    return this.context.getTokenRawAmountByType('source');
  }

  private getRate() {
    if (!this.context) throw new Error('');
    return this.context.rate$;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-button': SwapButton;
  }
}
