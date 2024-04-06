import { html, LitElement, PropertyValues } from 'lit';
import { customElement } from 'lit/decorators.js';
import { map as litMap } from 'lit/directives/map.js';
import { consume } from '@lit/context';
import { selectTokenContext } from '../../context';
import { ISelectTokenContext } from '@one-inch-community/models';
import '@one-inch-community/ui-components/button'
import '@one-inch-community/ui-components/token-icon'
import { favoriteTokensStyles } from './favorite-tokens.styles';
import { combineLatest, defer, map, switchMap } from 'rxjs';
import { observe } from '@one-inch-community/ui-components/lit';
import { TokenController } from '@one-inch-community/sdk';
import { scrollbarStyle } from '@one-inch-community/ui-components/theme';

@customElement(FavoriteTokensElement.tagName)
export class FavoriteTokensElement extends LitElement {
  static tagName = 'inch-favorite-tokens' as const

  static override styles = [
    favoriteTokensStyles,
    scrollbarStyle
  ]

  @consume({ context: selectTokenContext })
  context?: ISelectTokenContext

  private readonly favoriteTokensView$ = combineLatest([
    defer(() => this.getFavoriteTokens()),
    defer(() => this.getChainId())
  ]).pipe(
    switchMap(([tokens, chainId]) => TokenController.getTokenList(chainId, tokens)),
    map(tokens => tokens.sort((token1, token2) => token2.priority - token1.priority)),
    map(tokens => html`
      <div class="favorite-container-scroll ${!tokens.length ? 'empty' : ''}">
        <div class="favorite-container">
          ${html`${litMap(tokens, token => html`
            <inch-button size="m" type="secondary">
              <inch-token-icon symbol="${token.symbol}" address="${token.address}" chainId="${token.chainId}"></inch-token-icon>
              <span>${token.symbol}</span>
            </inch-button>`)}`}
        </div>
      </div>
      `
    )
  )

  protected override render() {
    return html`${observe(this.favoriteTokensView$)}`
  }

  private getFavoriteTokens() {
    if (!this.context) throw new Error('')
    return this.context.favoriteTokens$
  }

  private getChainId() {
    if (!this.context) throw new Error('')
    return this.context.chainId$
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-favorite-tokens': FavoriteTokensElement
  }
}