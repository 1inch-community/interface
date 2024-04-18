import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Task } from '@lit/task';
import { formatNumber, getChainById, TokenController } from '@one-inch-community/sdk';
import { ChainId } from '@one-inch-community/models';
import { Address, formatUnits } from 'viem';
import { walletViewAddressBalanceStyle } from './wallet-view-address-balance.style';

@customElement(WalletViewAddressBalanceElement.tagName)
export class WalletViewAddressBalanceElement extends LitElement {
  static tagName = 'inch-wallet-view-address-balance';

  static override styles = walletViewAddressBalanceStyle

  @property({ type: Number }) chainId?: ChainId;
  @property({ type: String }) address?: Address;

  private readonly task = new Task(this,
    async ([chainId, address]) => {
      if (!chainId || !address) throw new Error('')
      const balanceRecord = await TokenController.getTokenBalance(chainId, '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', address);
      return formatNumber(formatUnits(BigInt(balanceRecord.amount), 18), 6)
    },
    () => [this.chainId, this.address] as const
  );

  protected override render() {
    return this.task.render({
      pending: () => html`<div class="loader"></div>`,
      error: () => html`<div class="loader"></div>`,
      complete: balance => {
        if (this.chainId === undefined) throw new Error('')
        const chain = getChainById(this.chainId)
        return html`<span>${balance} ${chain.nativeCurrency.symbol}</span>`
      }
    })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-wallet-view-address-balance': WalletViewAddressBalanceElement
  }
}