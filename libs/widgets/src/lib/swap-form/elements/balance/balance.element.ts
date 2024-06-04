import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { ISwapContext } from '@one-inch-community/models';
import { swapContext } from '../../context';
import { balanceStyles } from './balance.styles';
import { catchError, combineLatest, defer, filter, map, switchMap } from 'rxjs';
import { formatUnits } from 'viem';
import { formatNumber, TokenController } from '@one-inch-community/sdk';
import { observe } from '@one-inch-community/lit';

@customElement(BalanceElement.tagName)
export class BalanceElement extends LitElement {
  static tagName = 'inch-swap-balance';

  static override styles = balanceStyles;

  @property({ type: String, attribute: true }) tokenType?: 'source' | 'destination';

  @consume({ context: swapContext })
  context?: ISwapContext;

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
      return defer(() => TokenController.liveQuery(() => TokenController.getTokenBalance(chainId, token.address, walletAddress))).pipe(
        filter(Boolean),
        map(balanceRecord => {
          return formatNumber(formatUnits(BigInt(balanceRecord.amount), token.decimals), 6)
        }),
        map(balance => this.getBalanceView(balance)),
        catchError(() => [html`<br>`])
      )
    }),

  );

  protected override render() {
    return html`${observe(this.balance$, html`<br>`)}`
  }

  private getBalanceView(balance: string) {
    return html`
      <span>Balance: ${balance}</span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-balance': BalanceElement;
  }
}
