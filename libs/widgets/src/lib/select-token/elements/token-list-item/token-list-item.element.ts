import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { tokenListItemStyle } from './token-list-item.style';
import { Address, formatUnits, isAddressEqual } from 'viem';
import {
  ChainId,
  IApplicationContext,
  IBalancesTokenRecord,
  ISelectTokenContext, IToken,
} from '@one-inch-community/models';
import { Task } from '@lit/task';
import { formatNumber } from '@one-inch-community/core/formatters';
import '@one-inch-community/widgets/token-icon';
import '@one-inch-community/ui-components/icon';
import '../token-list-stub-item';
import { subscribe, dispatchEvent } from '@one-inch-community/core/lit';
import { filter, merge, Observable, switchMap, timer } from 'rxjs';
import { consume } from '@lit/context';
import { selectTokenContext } from '../../context';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';


@customElement(TokenListItemElement.tagName)
export class TokenListItemElement extends LitElement {
  static tagName = 'inch-token-list-item' as const;

  static override styles = tokenListItemStyle;

  @property({ type: String, attribute: true }) tokenAddress?: Address;
  @property({ type: String, attribute: true }) walletAddress?: Address;
  @property({ type: Number, attribute: true }) chainId?: ChainId;

  @consume({ context: selectTokenContext })
  context?: ISelectTokenContext;

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext

  private isDestroy = false;

  private preRenderTemplate: TemplateResult | null = null;

  private isFavorite = false;

  private task = new Task(this,
    async ([chainId, tokenAddress, walletAddress, fastUpdate]) => {
      if (fastUpdate) {
        const result = this.task.value as unknown;
        if (result) return result as [IToken, IBalancesTokenRecord | null, number | null, boolean];
      }
      if (!chainId || !tokenAddress) return [];
      if (this.isDestroy) throw new Error('');
      const token = await this.applicationContext.tokenController.getToken(chainId, tokenAddress);
      let balance = null;
      let balanceUsd = null;
      if (walletAddress && token) {
        balance = await this.applicationContext.tokenController.getTokenBalance(chainId, tokenAddress, walletAddress);
        const tokenPrice = await this.applicationContext.tokenController.getTokenUSDPrice(chainId, tokenAddress);
        const balanceFormatted = formatUnits(BigInt(balance?.amount ?? 0), token.decimals);
        balanceUsd = Number(balanceFormatted) * Number(tokenPrice);
      }
      const isFavoriteToken = token ? (await this.applicationContext.tokenController.isFavoriteToken(chainId, token.address)) : false
      return [token, balance, balanceUsd, isFavoriteToken] as const;
    },
    () => [this.chainId, this.tokenAddress, this.walletAddress, false as boolean] as const
  );

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.isDestroy = true;
  }

  protected override firstUpdated() {
    subscribe(this, merge(
      timer(12_000),
      this.getTokenUpdateEmitter()
    ).pipe(
      switchMap(() => this.task.run([this.chainId, this.tokenAddress, this.walletAddress, false]))
    ), { requestUpdate: false });
  }

  protected override render() {
    return html`
      ${this.task.render({
        complete: ([token, balance, balanceUsd, isFavoriteToken]) => this.getTokenView(token, balance, balanceUsd, isFavoriteToken),
        pending: () => {
          if (this.preRenderTemplate) return this.preRenderTemplate;
          return this.getStub();
        },
        error: () => {
          if (this.preRenderTemplate) return this.preRenderTemplate;
          return this.getStub();
        }
      })}
    `;
  }

  private getTokenView(token: IToken | null, balance: IBalancesTokenRecord | null, balanceUsd: number | null, isFavoriteToken: boolean) {
    if (!token) {
      return this.getStub();
    }
    this.isFavorite = isFavoriteToken;
    let balanceFormat = '0';
    if (balance) {
      balanceFormat = formatNumber(formatUnits(BigInt(balance.amount), token.decimals), 6);
    }
    let balanceUsdFormat = '$0';
    if (balanceUsd) {
      balanceUsdFormat = '$' + formatNumber(balanceUsd.toString(), 2);
    }
    let startColor = { border: 'var(--color-border-border-secondary)', body: 'none' };
    if (this.isFavorite) {
      startColor = { border: 'var(--color-core-orange-warning)', body: 'var(--color-core-orange-warning)' };
    }

    const classes = {
      'item-container': true,
      'is-favorite-token': this.isFavorite
    };

    this.preRenderTemplate = html`
      <div class="${classMap(classes)}" @click="${(event: UIEvent) => {
        this.context?.onSelectToken(token)
        dispatchEvent(this, 'backCard', null)
      }}">
        <inch-token-icon symbol="${token.symbol}" address="${token.address}" chainId="${token.chainId}"
                         size="40"></inch-token-icon>
        <div class="name-and-balance">
          <span class="name">${token.name}</span>
          <span class="balance">${balanceFormat} ${token.symbol}</span>
        </div>

        <div class="usd-balance-and-favorite-start">
          <span class="usd-balance">${balanceUsdFormat}</span>
          <inch-icon class="is-favorite-start" @click="${(event: UIEvent) => this.onMarkFavoriteToken(event, token)}"
                     icon="startDefault16" .props="${startColor}"></inch-icon>
        </div>
      </div>
    `;

    return this.preRenderTemplate;
  }

  private async onMarkFavoriteToken(event: UIEvent, token: IToken) {
    event.preventDefault();
    event.stopPropagation();
    this.isFavorite = !this.isFavorite;
    await Promise.all([
      this.task.run([this.chainId, this.tokenAddress, this.walletAddress, true]),
      this.context?.setFavoriteTokenState(token.chainId, token.address, this.isFavorite)
    ])
  }

  private getTokenUpdateEmitter() {
    if (!this.context) throw new Error('');
    return (this.context.changeFavoriteTokenState$ as Observable<[ChainId, Address]>).pipe(
      filter((([chainId, address]: [ChainId, Address]) => {
        const token = this.task?.value?.[0] ?? null;
        return token && token.chainId === chainId && isAddressEqual(token.address, address);
      }) as any)
    );
  }

  private getStub() {
    return html`
      <inch-token-list-stub-item></inch-token-list-stub-item>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-token-list-item': TokenListItemElement;
  }
}
