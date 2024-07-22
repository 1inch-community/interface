import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { IApplicationContext, ISwapContext } from '@one-inch-community/models';
import { observe } from '@one-inch-community/core/lit';
import { catchError, combineLatest, defer, filter, map, switchMap } from 'rxjs';
import { formatUnits } from 'viem';
import { smartFormatNumber } from '@one-inch-community/core/formatters';
import { fiatBalanceStyles } from './fiat-balance.styles';
import { SwapContextToken } from '@one-inch-community/sdk/swap';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';

@customElement(FiatBalanceElement.tagName)
export class FiatBalanceElement extends LitElement {
  static tagName = 'inch-fiat-balance';

  static override styles = fiatBalanceStyles

  @property({ type: String, attribute: true }) tokenType?: 'source' | 'destination';

  @consume({ context: SwapContextToken })
  context?: ISwapContext;

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext

  readonly balance$ = defer(() => {
    if (!this.context) throw new Error('');
    if (!this.tokenType) throw new Error('');
    return combineLatest([
      this.context.connectedWalletAddress$,
      this.context.getTokenByType(this.tokenType),
      this.context.chainId$,
    ]);
  }).pipe(
    filter(([address]) => !!address),
    switchMap(([ walletAddress, token, chainId ]) => {
      if (!walletAddress || !token || !chainId) return [html`<br>`]
      return combineLatest([
        this.applicationContext.tokenController.liveQuery(() =>
          this.applicationContext.tokenController.getTokenUSDPrice(chainId, token.address)),
        this.context!.getTokenRawAmountByType(this.tokenType!)
      ]).pipe(
        map(([ tokenPrice, amount ]) => {
          if (!amount) return html`<br>`
          const balanceFormatted = formatUnits(BigInt(amount), token.decimals);
          const balanceUsd = Number(balanceFormatted) * Number(tokenPrice);
          return this.getBalanceView(smartFormatNumber(balanceUsd.toString(), 1))
        }),
        catchError(() => [html`<br>`])
      )
    }),

  );

  protected override render() {
    return html`${observe(this.balance$, html`<br>`)}`
  }

  private getBalanceView(balance: string) {
    return html`
      <span>~$${balance}</span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-fiat-balance': FiatBalanceElement
  }
}
