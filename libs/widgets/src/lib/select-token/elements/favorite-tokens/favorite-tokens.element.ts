import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { consume } from '@lit/context';
import { selectTokenContext } from '../../context';
import { ISelectTokenContext, ITokenRecord } from '@one-inch-community/models';
import '@one-inch-community/ui-components/button';
import '@one-inch-community/widgets/token-icon';
import '@one-inch-community/ui-components/icon';
import { favoriteTokensStyles } from './favorite-tokens.styles';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  defer,
  fromEvent,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap
} from 'rxjs';
import {
  observe,
  animationMap,
  subscribe,
  AnimationMapController,
  AnimationMapDirection,
  appendStyle,
  dispatchEvent
} from '@one-inch-community/core/lit';
import { TokenController } from '@one-inch-community/sdk/tokens';
import { asyncFrame } from '@one-inch-community/ui-components/async';
import { createRef, ref } from 'lit/directives/ref.js';

const animationOptions = {
  duration: 200,
  easing: 'cubic-bezier(.2, .8, .2, 1)'
}

@customElement(FavoriteTokensElement.tagName)
export class FavoriteTokensElement extends LitElement {
  static tagName = 'inch-favorite-tokens' as const;

  static override styles = [
    favoriteTokensStyles
  ];

  @consume({ context: selectTokenContext })
  context?: ISelectTokenContext;

  readonly editAllMode$ = new BehaviorSubject(false);

  readonly scrollContainerRef = createRef<HTMLElement>()

  private readonly favoriteTokensAnimationMapController = new FavoriteTokensAnimationMapController(this)

  private readonly favoriteTokensView$ = combineLatest([
    defer(() => this.getFavoriteTokens()),
    defer(() => this.getChainId())
  ]).pipe(
    debounceTime(0),
    switchMap(([tokens, chainId]) => {
      if (!chainId) return []
      return TokenController.getTokenList(chainId, tokens)
    }),
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
        <div ${ref(this.scrollContainerRef)} class="favorite-container-scroll">
          <div class="favorite-container">
            ${animationMap(tokens, this.favoriteTokensAnimationMapController as any)}
          </div>
        </div>
      `;
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  protected override firstUpdated() {
    subscribe(this, [
      this.editAllMode$.pipe(
        tap(state => {
          state ? this.classList.add('remove-favorite-token-show') : this.classList.remove('remove-favorite-token-show');
        })
      ),
      fromEvent<WheelEvent>(this, 'wheel').pipe(
        tap(event => {
          if (!this.scrollContainerRef.value) return
          const element = this.scrollContainerRef.value
          element.scrollLeft += event.deltaY
        })
      )
    ], { requestUpdate: false });
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

  async onRemoveFavoriteToken(token: ITokenRecord, event: UIEvent) {
    event.stopPropagation();
    event.preventDefault();
    await this.context?.setFavoriteTokenState(token.chainId, token.address, false);
  }
}

class FavoriteTokensAnimationMapController implements AnimationMapController<ITokenRecord | null, void, void, (HTMLElement | number | null)> {
  direction: AnimationMapDirection = 'horizontal';

  private renderElements: Map<number, HTMLElement> = new Map();
  private deleteElementsWidth: Map<number, number> = new Map();
  private moveElementsWidth: Map<string, number> = new Map();

  private readonly gap = 8

  constructor(private readonly element: FavoriteTokensElement) {
  }

  onKeyExtractor(token: ITokenRecord | null): string {
    return token !== null ? 't' + token.address : 'edit';
  }

  onTemplateBuilder(token: ITokenRecord | null): TemplateResult {
    return when(
      token,
      (token) => html`
        <div class="favorite-token-item-container">
          <div class="remove-favorite-token"
               @click="${(event: UIEvent) => this.element.onRemoveFavoriteToken(token, event)}">
            <inch-icon icon="cross8"></inch-icon>
          </div>
          <inch-button size="m" type="secondary" class="favorite-token-item"
                       @click="${() => {
                         this.element.context?.onSelectToken(token);
                         dispatchEvent(this.element, 'backCard', null)
                       }}">
            <inch-token-icon symbol="${token.symbol}" address="${token.address}"
                             chainId="${token.chainId}"></inch-token-icon>
            <span>${token.symbol}</span>
          </inch-button>
        </div>
      `,
      () => html`
        <inch-button size="l" type="secondary" class="favorite-token-item edit-favorite-token-list"
                     @click="${() => this.element.editAllMode$.next(!this.element.editAllMode$.value)}">
          <inch-icon icon="edit24"></inch-icon>
        </inch-button>
      `
    );
  }

  async onBeforeRemoveAnimateItem(element: HTMLElement): Promise<void> {
    await element.animate([
      { transform: '' },
      { transform: 'translateX(-50%) scale(.3)', opacity: 0 }
    ], animationOptions).finished
  }

  async onBeforeRenderAnimateItem(element: HTMLElement): Promise<void> {
    appendStyle(element, {
      transform: 'translateX(-100%)',
      opacity: '0'
    })
  }

  async onAfterRenderAnimateItem?(element: HTMLElement): Promise<void> {
    await element.animate([
      { transform: 'translateX(-100%) scale(.3)', opacity: 0 },
      { transform: 'translateX(0) scale(1)', opacity: 1 },
    ], animationOptions).finished
    appendStyle(element, {
      transform: '',
      opacity: ''
    })
  }

  async onBeforeMoveAnimationItem(element: HTMLElement, oldPosition: number, newPosition: number): Promise<HTMLElement | number | null> {
    if (this.renderElements.has(oldPosition)) {
      return this.renderElements.get(oldPosition)!
    }
    const offset = this.getOffsetMoveByMoveElements(oldPosition, newPosition)

    if (oldPosition < newPosition) {
      appendStyle(element, {
        transform: `translateX(${offset}px)`
      })
      return offset
    }


    await element.animate([
      { transform: `translateX(0)` },
      { transform: `translateX(${offset}px)` },
    ], animationOptions).finished
    return null
  }

  async onAfterMoveAnimationItem(element: HTMLElement, renderElementOfOffset: HTMLElement | number | null): Promise<void> {
    if (renderElementOfOffset === null) return
    let offset
    if (typeof renderElementOfOffset === 'number') {
      offset = renderElementOfOffset
    } else {
      await asyncFrame()
      offset = (renderElementOfOffset.clientWidth * -1) - this.gap
    }
    await element.animate([
      { transform: `translateX(${offset}px)` },
      { transform: `translateX(0)` },
    ], animationOptions).finished
    appendStyle(element, {
      transform: ''
    })
  }

  async onBeforeAnimation(container: HTMLElement, renderElements: Map<number, HTMLElement>, deleteElements: Map<number, HTMLElement>, moveElements: Map<[number, number], HTMLElement>) {
    this.deleteElementsWidth.clear()
    this.renderElements.clear()
    this.moveElementsWidth.clear()
    deleteElements.forEach((element, index) => {
      this.deleteElementsWidth.set(index, element.clientWidth);
    })
    moveElements.forEach((element, index) => {
      this.moveElementsWidth.set(index.join(':'), element.clientWidth);
    })
    renderElements.forEach((element, index) => {
      this.renderElements.set(index, element);
    })
  }

  private getOffsetMoveByMoveElements(oldPosition: number, newPosition: number) {
    let offset = 0
    if (this.deleteElementsWidth.has(newPosition)) {
      offset = this.deleteElementsWidth.get(newPosition)!
    } else if (oldPosition > newPosition) {
      this.deleteElementsWidth.forEach((width, index) => {
        if (index > oldPosition) return
        offset = width
      })
    } else {
      offset = (this.moveElementsWidth.get([ oldPosition - 1, newPosition - 1 ].join(':')) ?? 0)
    }
    return (offset + this.gap) * -1
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-favorite-tokens': FavoriteTokensElement;
  }
}
