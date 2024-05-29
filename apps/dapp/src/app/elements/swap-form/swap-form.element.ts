import { html, LitElement } from 'lit';
import {
  animationFrameScheduler,
  defer,
  distinctUntilChanged,
  filter,
  fromEvent,
  map, of,
  skip,
  subscribeOn,
  switchMap,
  takeUntil,
  tap, timer
} from 'rxjs';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import '@one-inch-community/ui-components/card';
import '@one-inch-community/widgets/swap-form';
import { isTokensEqual, storage, TokenController } from '@one-inch-community/sdk';
import { appendStyle, getMobileMatchMediaAndSubscribe, observe, subscribe } from '@one-inch-community/lit';
import { OverlayMobileController, OverlayController } from '@one-inch-community/ui-components/overlay';
import { SceneController, sceneLazyValue } from '@one-inch-community/ui-components/scene';
import { getThemeChange, BrandColors } from '@one-inch-community/ui-components/theme';
import { ChainId, IToken } from '@one-inch-community/models';
import { swapFormStyle } from './swap-form.style';
import { connectWalletController } from '../../controllers/connect-wallet-controller';

import('@one-inch-community/widgets/wallet-manage')
import('@one-inch-community/widgets/select-token')
import('@one-inch-community/ui-components/icon')

@customElement(SwapFormElement.tagName)
export class SwapFormElement extends LitElement {
  static tagName = 'inch-swap-form-container' as const

  static styles = [
    swapFormStyle,
    SceneController.styles()
  ]

  private mobileMedia = getMobileMatchMediaAndSubscribe(this)

  private targetSelectToken: 'source' | 'destination' | null = null

  @state() private srcToken: IToken | null = null

  @state() private dstToken: IToken | null = null

  @state() private isRainbowTheme = false



  private readonly chainId$ = connectWalletController.data.chainId$
  private readonly activeAddress$ = connectWalletController.data.activeAddress$

  private readonly swapFormRef = createRef<HTMLElement>()
  private readonly swapFormContainerRef  = createRef<HTMLElement>()
  private readonly unicornLoaderRef  = createRef<HTMLElement>()

  private readonly desktopScene = new SceneController('swapForm', {
    swapForm: { minWidth: 556, minHeight: 376.5, lazyRender: true },
    selectToken: { minWidth: 556, minHeight: 376.5, maxHeight: 680 }
  })

  private readonly selectTokenMobileOverlay = new OverlayMobileController('app-root')

  private readonly connectWalletOverlay = new OverlayController('app-root', 'center')

  async connectedCallback() {
    await this.initTokens()
    super.connectedCallback();
    subscribe(this, [
      this.chainId$.pipe(
        filter(Boolean),
        distinctUntilChanged(),
        skip(1),
        tap((chainId) => this.syncTokens(chainId))
      ),
      getThemeChange().pipe(
        map(({ brandColor }) => brandColor),
        distinctUntilChanged(),
        tap(color => this.isRainbowTheme = color === BrandColors.rainbow),
      ),
      this.mobileUpdate()
    ], { requestUpdate: false })
  }

  protected render() {
    if (this.mobileMedia.matches) {
      return this.getMobileSwapForm()
    }
    return this.getDesktopSwapForm()
  }

  private async syncTokens(chainId: ChainId) {
    const token = await TokenController.getNativeToken(chainId)
    this.setSrcToken(token)
    this.setDstToken(null)
    this.requestUpdate()
  }

  private async initTokens() {
    const chainId = await connectWalletController.data.getChainId()
    if (!chainId) return
    const srcToken: IToken | null = storage.get('src-token-symbol', JSON.parse)
    const dstToken: IToken | null = storage.get('dst-token-symbol', JSON.parse)
    if (srcToken) {
      this.setSrcToken(srcToken)
    }
    if (dstToken) {
      this.setDstToken(dstToken)
    }
  }

  private getMobileSwapForm() {
    const classes = {
      'shadow-container': true,
      'shadow-container-rainbow': this.isRainbowTheme
    }
    return html`
      <inch-icon ${ref(this.unicornLoaderRef)} class="unicorn-loader" icon="unicornRun"></inch-icon>
      <div ${ref(this.swapFormContainerRef)} class="${classMap(classes)}">
        <inch-card>
          <inch-swap-form
            .srcToken="${this.srcToken}"
            .dstToken="${this.dstToken}"
            .walletController="${connectWalletController}"
            @openTokenSelector="${(event: CustomEvent) => this.onOpenMobileSelectToken(event)}"
            @connectWallet="${() => this.onOpenConnectWalletView()}"
          ></inch-swap-form>
        </inch-card>
      </div>
    `;
  }

  private getDesktopSwapForm() {
    const classes = {
      'shadow-container': true,
      'shadow-container-rainbow': this.isRainbowTheme
    }
    return html`
      <inch-icon ${ref(this.unicornLoaderRef)} class="unicorn-loader" icon="unicornRun"></inch-icon>
      <div ${ref(this.swapFormContainerRef)} class="${classMap(classes)}">
        <inch-card>
          ${this.desktopScene.render({
            swapForm: () => html`
              <inch-swap-form
                ${ref(this.swapFormRef)}
                .srcToken="${sceneLazyValue(this, () => this.srcToken)}"
                .dstToken="${sceneLazyValue(this, () => this.dstToken)}"
                .walletController="${connectWalletController}"
                @switchPair="${() => this.onSwitchPair()}"
                @openTokenSelector="${(event: CustomEvent) => this.onOpenSelectToken(event)}"
                @connectWallet="${() => this.onOpenConnectWalletView()}"
              ></inch-swap-form>
            `,
            selectToken: () => html`
            <inch-select-token
              chainId="${observe(this.chainId$)}"
              connectedWalletAddress="${observe(this.activeAddress$)}"
              @backCard="${() => this.desktopScene.back()}"
              @selectToken="${async (event: CustomEvent) => {
              this.onSelectToken(event);
              await this.desktopScene.back()
            }}"
            ></inch-select-token>
          `
          })}
        </inch-card>
      </div>
    `;
  }

  private async onOpenSelectToken(event: CustomEvent) {
    await this.desktopScene.nextTo('selectToken')
    this.targetSelectToken = event.detail.value
  }

  private onSwitchPair() {
    const srcToken = this.srcToken
    this.setSrcToken(this.dstToken)
    this.setDstToken(srcToken)
  }

  private onSelectToken(event: CustomEvent) {
    const token: IToken = event.detail.value
    if (this.targetSelectToken === 'source') {
      if (this.dstToken && isTokensEqual(token, this.dstToken)) {
        this.setDstToken(this.srcToken)
      }
      this.setSrcToken(token)
    }
    if (this.targetSelectToken === 'destination') {
      if (!this.dstToken && this.srcToken && isTokensEqual(token, this.srcToken)) {
        return
      }
      if (this.srcToken && isTokensEqual(token, this.srcToken)) {
        this.setSrcToken(this.dstToken)
      }
      this.setDstToken(token)
    }
  }

  private setSrcToken(token: IToken | null): void {
    this.srcToken = token
    storage.set('src-token-symbol', token)
  }

  private setDstToken(token: IToken| null): void {
    this.dstToken = token
    storage.set('dst-token-symbol', token)
  }

  private async onOpenConnectWalletView() {
    const id = await this.connectWalletOverlay.open(html`
      <inch-wallet-manage
        showShadow
        @closeCard="${() => this.connectWalletOverlay.close(id)}"
        .controller="${connectWalletController}"
      ></inch-wallet-manage>
    `)
  }

  private async onOpenMobileSelectToken(event: CustomEvent) {
    const id = await this.selectTokenMobileOverlay.open(html`
      <inch-card forMobileView style="width: 100%; height: 100%; display: flex;">
        <inch-select-token
          chainId="${observe(this.chainId$)}"
          connectedWalletAddress="${observe(this.activeAddress$)}"
          @backCard="${() => this.selectTokenMobileOverlay.close(id)}"
          @selectToken="${async (event: CustomEvent) => {
            this.onSelectToken(event)
            await this.selectTokenMobileOverlay.close(id)
          }}"
        ></inch-select-token>
      </inch-card>
    `)
    this.targetSelectToken = event.detail.value
  }

  private mobileUpdate() {
    let lastPosition = 0
    let full = false
    let resetInProgress = false
    const max = 60
    const root = (): HTMLElement | null => document.querySelector('#app-root')
    const target = (): HTMLElement => this.swapFormContainerRef.value!
    const loader = (): HTMLElement => this.unicornLoaderRef.value!
    const set = (position: number) => {
      if (position < 0) return
      if (position > max) {
        full = true
      }
      const adjustedPosition = position > max ? max + (position - max) / 4 : position;
      const loaderPosition = (position > max ? max : position) / max;
      appendStyle(loader(), { transform: `scale(${loaderPosition})` })
      appendStyle(target(), { transform: `translate3d(0, ${adjustedPosition}px, 0)` })
      lastPosition = adjustedPosition
    }
    const reset = async () => {
      resetInProgress = true
      await target().animate([
        { transform: `translate3d(0, ${lastPosition}px, 0)` },
        { transform: `translate3d(0, 0, 0)` }
      ], {
        duration: 800,
        easing: 'cubic-bezier(.2, .8, .2, 1)'
      }).finished
      set(0)
      full = false
      resetInProgress = false
    }
    return defer(() => {
      const targetEl = target()
      return fromEvent<TouchEvent>(targetEl, 'touchstart').pipe(
        filter(() => {
          return !resetInProgress && (root()?.scrollTop ?? 0) === 0
        }),
        switchMap((startEvent: TouchEvent) => {
          const startPoint = startEvent.touches[0].clientY
          return fromEvent<TouchEvent>(targetEl, 'touchmove').pipe(
            map(event => event.touches[0].clientY - startPoint),
            tap(position => set(position)),
            takeUntil(fromEvent<TouchEvent>(targetEl, 'touchend').pipe(
              switchMap(() => full ? timer(300) : of(null)),
              tap(() => reset())
            ))
          )
        })
      )
    }).pipe(subscribeOn(animationFrameScheduler))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-form-container': SwapFormElement
  }
}
