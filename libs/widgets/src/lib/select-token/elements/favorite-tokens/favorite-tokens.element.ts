import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { consume } from '@lit/context';
import { selectTokenContext } from '../../context';
import { ISelectTokenContext, ITokenRecord } from '@one-inch-community/models';
import '@one-inch-community/ui-components/button';
import '@one-inch-community/widgets/token-icon';
import '@one-inch-community/ui-components/icon';
import { favoriteTokensStyles } from './favorite-tokens.styles';
import { BehaviorSubject, combineLatest, debounceTime, defer, map, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { observe, animationMap, subscribe } from '@one-inch-community/core/lit';
import { TokenController } from '@one-inch-community/sdk/tokens';
import { emitSelectTokenEvent } from '../../events';

@customElement(FavoriteTokensElement.tagName)
export class FavoriteTokensElement extends LitElement {
  static tagName = 'inch-favorite-tokens' as const;

  static override styles = [
    favoriteTokensStyles
  ];

  @consume({ context: selectTokenContext })
  context?: ISelectTokenContext;

  private readonly editAllMode$ = new BehaviorSubject(false);

  private readonly favoriteTokensView$ = combineLatest([
    defer(() => this.getFavoriteTokens()),
    defer(() => this.getChainId())
  ]).pipe(
    debounceTime(0),
    switchMap(([tokens, chainId]) => TokenController.getTokenList(chainId, tokens)),
    map(tokens => tokens.sort((token1, token2) => token2.priority - token1.priority)),
    startWith([]),
    tap(tokens => {
      if (tokens.length && this.classList.contains('empty')) {
        this.classList.remove('empty');
      }
      if (!tokens.length && !this.classList.contains('empty')) {
        this.classList.add('empty');
      }
    }),
    tap(() => {
      if (!this.classList.contains('transition-host')) {
        setTimeout(() => {
          this.classList.add('transition-host');
        }, 300);
      }
    }),
    map((tokens: (ITokenRecord | null)[]) => {
      if (tokens.length) {
        tokens.push(null);
      }
      return html`
        <div class="favorite-container-scroll">
          <div class="favorite-container">
            ${html`${animationMap(
              tokens,
              {
                ...itemAnimation,
                keyExtractor: (token: ITokenRecord | null) => token !== null ? 't' + token.address : 'edit',
                templateBuilder: (token: ITokenRecord | null) => when(
                  token,
                  (token) => html`
                    <div class="favorite-token-item-container">
                      <div class="remove-favorite-token"
                           @click="${(event: UIEvent) => this.onRemoveFavoriteToken(token, event)}">
                        <inch-icon icon="cross8"></inch-icon>
                      </div>
                      <inch-button size="m" type="secondary" class="favorite-token-item"
                                   @click="${(event: UIEvent) => emitSelectTokenEvent(this, token, event)}">
                        <inch-token-icon symbol="${token.symbol}" address="${token.address}"
                                         chainId="${token.chainId}"></inch-token-icon>
                        <span>${token.symbol}</span>
                      </inch-button>
                    </div>
                  `,
                  () => html`
                    <inch-button size="l" type="secondary" class="favorite-token-item edit-favorite-token-list"
                                 @click="${() => this.editAllMode$.next(!this.editAllMode$.value)}">
                      <inch-icon icon="edit24"></inch-icon>
                    </inch-button>
                  `
                )
              }
            )}`}
          </div>
        </div>
      `;
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  protected override firstUpdated() {
    subscribe(this, this.editAllMode$.pipe(
      tap(state => {
        state ? this.classList.add('remove-favorite-token-show') : this.classList.remove('remove-favorite-token-show');
      })
    ), { requestUpdate: false });
  }

  protected override render() {
    return html`${observe(this.favoriteTokensView$)}`;
  }

  private getFavoriteTokens() {
    if (!this.context) throw new Error('');
    return this.context.favoriteTokens$;
  }

  private getChainId() {
    if (!this.context) throw new Error('');
    return this.context.chainId$;
  }

  private async onRemoveFavoriteToken(token: ITokenRecord, event: UIEvent) {
    event.stopPropagation();
    event.preventDefault();
    await this.context?.setFavoriteTokenState(token.chainId, token.address, false);
  }
}

const itemAnimation = {
  direction: 'horizontal' as const,
  deleteElement: async (element: HTMLElement) => {
    element.style.overflow = 'hidden';
    await element.animate([
      { flexBasis: `${element.offsetWidth}px`, transform: 'scale(1) translateX(0)' },
      { flexBasis: '0', transform: 'scale(0) translateX(-20%)' }
    ], {
      duration: element.id === 'edit' ? 50 : 150
    }).finished;
    element.style.overflow = '';
  },
  addedElement: async (element: HTMLElement) => {
    element.style.overflow = 'hidden';
    element.style.transform = 'scale(0) translateX(-20%)';
    element.style.position = 'absolute';
    element.style.top = '-9999';
    element.style.left = '-9999';
    document.body.appendChild(element);
    await new Promise(resolve => requestAnimationFrame(resolve));
    const width = element.offsetWidth;
    element.remove();
    element.style.position = '';
    element.style.top = '';
    element.style.left = '';
    return async (element: HTMLElement) => {
      await element.animate([
        { flexBasis: '0', transform: 'scale(0) translateX(-20%)' },
        { flexBasis: `${width}px`, transform: 'scale(1) translateX(0)' }
      ], {
        duration: 150
      }).finished;
      element.style.transform = '';
      element.style.overflow = '';
    };
  }
};

declare global {
  interface HTMLElementTagNameMap {
    'inch-favorite-tokens': FavoriteTokensElement;
  }
}
