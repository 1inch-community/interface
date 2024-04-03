import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { tokenListItemStyle } from './token-list-item.style';
import { Address } from 'viem';
import { ChainId, IBalancesTokenRecord, ITokenRecord } from '@one-inch-community/models';
import { Task } from '@lit/task';
import { TokenController } from '@one-inch-community/sdk';
import '@one-inch-community/ui-components/token-icon'
import { asyncTimeout } from '@one-inch-community/ui-components/async';

@customElement(TokenListItemElement.tagName)
export class TokenListItemElement extends LitElement {
  static tagName = 'inch-token-list-item' as const;

  static override styles = tokenListItemStyle;

  @property({ type: String, attribute: true }) tokenAddress?: Address;
  @property({ type: String, attribute: true }) walletAddress?: Address;
  @property({ type: Number, attribute: true }) chainId?: ChainId;

  private isDestroy = false

  private task = new Task(this,
    async ([chainId, tokenAddress, walletAddress]) => {
      if (!chainId || !tokenAddress) return []
      await asyncTimeout(200)
      if (this.isDestroy) throw new Error('')
      console.log(this.isDestroy)
      const token = await TokenController.getToken(chainId, tokenAddress);
      let balance = null
      if (walletAddress) {
        balance = await TokenController.getTokenBalance(chainId, tokenAddress, walletAddress);
      }
      return [token, balance] as const
    },
    () => [this.chainId, this.tokenAddress, this.walletAddress] as const
  );

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.isDestroy = true
  }

  protected override render() {
    return html`
      ${this.task.render({
        complete: ([token, balance]) => this.getTokenView(token, balance),
        pending: () => this.getStub(),
        error: () => this.getStub()
      })}
    `;
  }

  private getTokenView(token: ITokenRecord, balance: IBalancesTokenRecord | null) {
    return html`
      <div class="item-container">
        <inch-token-icon symbol="${token.symbol}" address="${token.address}" chainId="${token.chainId}"
                         size="40"></inch-token-icon>
        <div class="name-and-balance">
          <span class="name">${token.name}</span>
          <span class="balance">${balance?.amount ?? 0} ${token.symbol}</span>
        </div>
      </div>
    `
  }

  private getStub() {
    return html`
      <div class="item-container stub-loader">
        <div class="stub-token-icon"></div>
        <div class="name-and-balance">
          <span class="name-stub"></span>
          <span class="balance-stub"></span>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-token-list-item': TokenListItemElement;
  }
}