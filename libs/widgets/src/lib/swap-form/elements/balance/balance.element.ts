import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { IApplicationContext, ISwapContext } from '@one-inch-community/models';
import { balanceStyles } from './balance.styles';
import { catchError, combineLatest, defer, filter, map, startWith, switchMap } from 'rxjs';
import { formatUnits } from 'viem';
import { observe, translate } from '@one-inch-community/core/lit';
import { getBlockEmitter } from '@one-inch-community/sdk/chain';
import { formatNumber } from '@one-inch-community/core/formatters';
import { SwapContextToken } from '@one-inch-community/sdk/swap';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';

@customElement(BalanceElement.tagName)
export class BalanceElement extends LitElement {
  static tagName = 'inch-swap-balance';

  static override styles = balanceStyles;

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
      this.context.chainId$.pipe(
        switchMap(chainId => chainId ? getBlockEmitter(chainId) : []),
        startWith(null),
      ),
    ]);
  }).pipe(
    filter(([address]) => !!address),
    switchMap(async ([ walletAddress, token, chainId ]) => {
      if (!walletAddress || !token || !chainId) return html`<br>`
      const balanceRecord = await this.applicationContext.tokenController.getTokenBalance(chainId, token.address, walletAddress)
      if (!balanceRecord) return html`<br>`
      const balance = formatNumber(formatUnits(BigInt(balanceRecord.amount), token.decimals), 6)
      return this.getBalanceView(balance)
    }),

  );

  protected override render() {
    return html`${observe(this.balance$, html`<br>`)}`
  }

  private getBalanceView(balance: string) {
    return html`
      <span>${translate('widgets.swap-form.input.balance.balance')}: ${balance}</span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-balance': BalanceElement;
  }
}
