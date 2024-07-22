import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Task } from '@lit/task';
import { ChainId, IApplicationContext } from '@one-inch-community/models';
import { Address, formatUnits } from 'viem';
import { walletViewAddressBalanceStyle } from './wallet-view-address-balance.style';
import { LongTimeCache } from '@one-inch-community/core/cache';
import { getChainById, nativeTokenAddress } from '@one-inch-community/sdk/chain';
import { formatNumber } from '@one-inch-community/core/formatters';
import { consume } from '@lit/context';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';

const storage = new LongTimeCache<string, string>('inch-wallet-view-address-balance', 7)

@customElement(WalletViewAddressBalanceElement.tagName)
export class WalletViewAddressBalanceElement extends LitElement {
  static tagName = 'inch-wallet-view-address-balance';

  static override styles = walletViewAddressBalanceStyle

  @property({ type: Number }) chainId?: ChainId;
  @property({ type: String }) address?: Address;

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext

  private readonly task = new Task(this,
    async ([chainId, address]) => {
      if (!chainId || !address) throw new Error('')
      const balanceRecord = await this.applicationContext.tokenController.getTokenBalance(chainId, nativeTokenAddress, address);
      const balance = formatNumber(formatUnits(BigInt(balanceRecord?.amount ?? 0), 18), 6)
      storage.set([this.chainId, this.address].join(':'), balance)
      return balance
    },
    () => [this.chainId, this.address] as const
  );

  protected override render() {
    return this.task.render({
      pending: () => this.getLoader(),
      error: () => this.getLoader(),
      complete: balance => {
        if (this.chainId === undefined) throw new Error('')
        const chain = getChainById(this.chainId)
        return html`<span>${balance} ${chain.nativeCurrency.symbol}</span>`
      }
    })
  }

  private getLoader() {
    const loader = () => html`<div class="loader"></div>`
    if (!this.chainId || !this.address) return loader()
    const balance = storage.get([this.chainId, this.address].join(':'))
    const chain = getChainById(this.chainId)
    if (balance) {
      return html`<span>${balance} ${chain.nativeCurrency.symbol}</span>`
    }
    return loader()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-wallet-view-address-balance': WalletViewAddressBalanceElement
  }
}
