import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { tokenListItemStyle } from './token-list-item.style';
import { Address, formatUnits, isAddressEqual } from 'viem';
import { ChainId, IBalancesTokenRecord, ISelectTokenContext, ITokenRecord } from '@one-inch-community/models';
import { Task } from '@lit/task';
import { formatNumber, getBlockEmitter, TokenController } from '@one-inch-community/sdk';
import '@one-inch-community/ui-components/token-icon'
import '@one-inch-community/ui-components/icon'
import '../token-list-stub-item'
import { asyncTimeout } from '@one-inch-community/ui-components/async';
import { subscribe } from '@one-inch-community/ui-components/lit';
import { filter, merge, Observable, switchMap } from 'rxjs';
import { consume } from '@lit/context';
import { selectTokenContext } from '../../context';
import { emitSelectTokenEvent } from '../../events';


@customElement(TokenListItemElement.tagName)
export class TokenListItemElement extends LitElement {
  static tagName = 'inch-token-list-item' as const;

  static override styles = tokenListItemStyle;

  @property({ type: String, attribute: true }) tokenAddress?: Address;
  @property({ type: String, attribute: true }) walletAddress?: Address;
  @property({ type: Number, attribute: true }) chainId?: ChainId;

  @consume({ context: selectTokenContext })
  context?: ISelectTokenContext;

  private isDestroy = false

  private preRenderTemplate: TemplateResult | null = null

  private isFavorite = false

  private task = new Task(this,
    async ([chainId, tokenAddress, walletAddress]) => {
      if (!chainId || !tokenAddress) return []
      await asyncTimeout(200)
      if (this.isDestroy) throw new Error('')
      const token = await TokenController.getToken(chainId, tokenAddress);
      let balance = null
      let balanceUsd = null
      if (walletAddress) {
        balance = await TokenController.getTokenBalance(chainId, tokenAddress, walletAddress);
        const tokenPrice = await TokenController.getTokenUSDPrice(chainId, tokenAddress)
        const balanceFormatted = formatUnits(BigInt(balance.amount), token.decimals)
        balanceUsd = Number(balanceFormatted) * Number(tokenPrice)
      }
      return [token, balance, balanceUsd] as const
    },
    () => [this.chainId, this.tokenAddress, this.walletAddress] as const
  );

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.isDestroy = true
  }

  protected override firstUpdated() {
    if (!this.chainId) throw new Error('')
    subscribe(this, merge(
      getBlockEmitter(this.chainId),
      this.getTokenUpdateEmitter()
    ).pipe(
      switchMap(() => this.task.run([this.chainId, this.tokenAddress, this.walletAddress]))
    ), { requestUpdate: false })
  }

  protected override render() {
    return html`
      ${this.task.render({
        complete: ([token, balance, balanceUsd]) => this.getTokenView(token, balance, balanceUsd),
        pending: () => {
          if (this.preRenderTemplate) return this.preRenderTemplate
          return this.getStub()
        },
        error: () => {
          if (this.preRenderTemplate) return this.preRenderTemplate
          return this.getStub()
        }
      })}
    `;
  }

  private getTokenView(token: ITokenRecord, balance: IBalancesTokenRecord | null, balanceUsd: number | null) {
    this.isFavorite = token.isFavorite
    let balanceFormat = '0'
    if (balance) {
      balanceFormat = formatNumber(formatUnits(BigInt(balance.amount), token.decimals), 6)
    }
    let balanceUsdFormat = '$0'
    if (balanceUsd) {
      balanceUsdFormat = '$' + formatNumber(balanceUsd.toString(), 2)
    }
    let startColor = { border: 'var(--color-border-border-secondary)', body: 'none' }
    if (this.isFavorite) {
      startColor = { border: 'var(--color-core-orange-warning)', body: 'var(--color-core-orange-warning)' }
    }

    const classes = {
      'item-container': true,
      'is-favorite-token': token.isFavorite
    }

    this.preRenderTemplate = html`
      <div class="${classMap(classes)}" @click="${(event: UIEvent) => emitSelectTokenEvent(this, token, event)}">
        <inch-token-icon symbol="${token.symbol}" address="${token.address}" chainId="${token.chainId}"
                         size="40"></inch-token-icon>
        <div class="name-and-balance">
          <span class="name">${token.name}</span>
          <span class="balance">${balanceFormat} ${token.symbol}</span>
        </div>
        
        <div class="usd-balance-and-favorite-start">
          <span class="usd-balance">${balanceUsdFormat}</span>
          <inch-icon class="is-favorite-start" @click="${(event: UIEvent) => this.onMarkFavoriteToken(event, token)}" icon="startDefault16" .props="${startColor}"></inch-icon>
        </div>
      </div>
    `

    return this.preRenderTemplate
  }

  private async onMarkFavoriteToken(event: UIEvent, token: ITokenRecord) {
    event.preventDefault()
    event.stopPropagation()
    this.isFavorite = !token.isFavorite
    this.requestUpdate()
    await this.context?.setFavoriteTokenState(token.chainId, token.address, !token.isFavorite)
  }

  private getTokenUpdateEmitter() {
    if (!this.context) throw new Error('')
    return (this.context.changeFavoriteTokenState$ as Observable<[ChainId, Address]>).pipe(
      filter((([chainId, address]: [ChainId, Address]) => {
        const token = this.task?.value?.[0] ?? null
        return token && token.chainId === chainId && isAddressEqual(token.address, address)
      }) as any)
    )
  }

  private getStub() {
    return html`
      <inch-token-list-stub-item></inch-token-list-stub-item>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-token-list-item': TokenListItemElement;
  }
}