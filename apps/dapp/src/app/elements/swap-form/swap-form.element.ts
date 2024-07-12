import { html, LitElement } from 'lit';
import {
  animationFrameScheduler,
  defer,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  fromEvent,
  map,
  subscribeOn,
  switchMap,
  takeUntil,
  tap
} from 'rxjs';
import { consume, provide } from '@lit/context';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import '@one-inch-community/ui-components/card';
import '@one-inch-community/widgets/swap-form';
import { appendStyle, getMobileMatchMediaAndSubscribe, subscribe, vibrate } from '@one-inch-community/core/lit';
import { OverlayController, OverlayMobileController } from '@one-inch-community/ui-components/overlay';
import { SceneController } from '@one-inch-community/ui-components/scene';
import { BrandColors, getThemeChange } from '@one-inch-community/core/theme';
import { SwapSnapshot, ISwapContext, IApplicationContext, TokenType } from '@one-inch-community/models';
import { swapFormStyle } from './swap-form.style';
import { SwapContextToken } from '@one-inch-community/sdk/swap';
import { CacheActivePromise } from '@one-inch-community/core/decorators';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';

import('@one-inch-community/widgets/wallet-manage');
import('@one-inch-community/widgets/select-token');
import('@one-inch-community/ui-components/icon');

@customElement(SwapFormElement.tagName)
export class SwapFormElement extends LitElement {
  static tagName = 'inch-swap-form-container' as const;

  static styles = [
    swapFormStyle,
    SceneController.styles()
  ];

  @provide({ context: SwapContextToken })
  swapContext!: ISwapContext

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext

  private mobileMedia = getMobileMatchMediaAndSubscribe(this);

  private targetSelectToken: TokenType | null = null;

  @state() private isRainbowTheme = false;

  private swapSnapshot: SwapSnapshot | null = null;

  private readonly swapFormRef = createRef<HTMLElement>();
  private readonly swapFormContainerRef = createRef<HTMLElement>();
  private readonly unicornLoaderRef = createRef<HTMLElement>();

  private readonly desktopScene = new SceneController('swapForm', {
    swapForm: { minWidth: 556, maxWidth: 556, maxHeight: 625, lazyRender: true },
    selectToken: { minWidth: 556, maxWidth: 556, maxHeight: 680 },
    confirmSwap: { minWidth: 556, maxWidth: 556, maxHeight: 680 }
  });

  private readonly mobileOverlay = new OverlayMobileController('app-root');

  private readonly overlay = new OverlayController('app-root', 'center');

  async connectedCallback() {
    super.connectedCallback();
    this.swapContext = await this.applicationContext.makeSwapContext()
    subscribe(this, [
      getThemeChange().pipe(
        map(({ brandColor }) => brandColor),
        distinctUntilChanged(),
        tap(color => this.isRainbowTheme = color === BrandColors.rainbow)
      ),
      this.mobileUpdate()
    ], { requestUpdate: false });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.swapContext.destroy()
  }

  protected firstUpdated() {
    setTimeout(() => this.classList.add('padding-top-transition'), 100);
  }

  protected render() {
    if (this.mobileMedia.matches) {
      return this.getMobileSwapForm();
    }
    return this.getDesktopSwapForm();
  }

  private getMobileSwapForm() {
    const classes = {
      'shadow-container': true,
      'shadow-container-rainbow': this.isRainbowTheme
    };
    return html`
      <inch-icon ${ref(this.unicornLoaderRef)} class="unicorn-loader" icon="unicornRun"></inch-icon>
      <div ${ref(this.swapFormContainerRef)} class="${classMap(classes)}">
        <inch-card style="max-width: 100vw">
          <inch-swap-form
            @confirmSwap="${(event: CustomEvent) => this.onOpenMobileConfirmSwap(event)}"
            @changeFusionInfoOpenState="${(event: CustomEvent) => this.onChangeFusionInfoOpenState(event)}"
            @openTokenSelector="${(event: CustomEvent) => this.onOpenMobileSelectToken(event)}"
            @changeChain="${() => this.onOpenChangeChainView()}"
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
    };
    return html`
      <inch-icon ${ref(this.unicornLoaderRef)} class="unicorn-loader" icon="unicornRun"></inch-icon>
      <div ${ref(this.swapFormContainerRef)} class="${classMap(classes)}">
        <inch-card>
          ${this.desktopScene.render({
            swapForm: () => html`
              <inch-swap-form
                ${ref(this.swapFormRef)}
                @confirmSwap="${(event: CustomEvent) => this.onOpenConfirmSwap(event)}"
                @changeChain="${() => this.onOpenChangeChainView()}"
                @openTokenSelector="${(event: CustomEvent) => this.onOpenSelectToken(event)}"
                @connectWallet="${() => this.onOpenConnectWalletView()}"
              ></inch-swap-form>
            `,
            selectToken: () => html`
              <inch-select-token
                tokenType="${this.targetSelectToken!}"
                @backCard="${() => this.desktopScene.back()}"
              ></inch-select-token>
            `,
            confirmSwap: () => when(this.swapSnapshot, (swapSnapshot) => html`
              <inch-confirm-swap
                .swapSnapshot="${swapSnapshot as any}"
                @backCard="${async () => {
                  await this.desktopScene.back();
                  this.swapSnapshot = null;
                }}"
              ></inch-confirm-swap>
            `)
          })}
        </inch-card>
      </div>
    `;
  }

  private async onOpenSelectToken(event: CustomEvent) {
    this.targetSelectToken = event.detail.value;
    await this.desktopScene.nextTo('selectToken');
  }

  private async onOpenConfirmSwap(event: CustomEvent) {
    this.swapSnapshot = event.detail.value;
    await this.desktopScene.nextTo('confirmSwap');
  }

  private onChangeFusionInfoOpenState(event: CustomEvent) {
    if (event.detail.value && !this.classList.contains('is-enlarged-form')) {
      this.classList.add('is-enlarged-form');
    }
    if (!event.detail.value && this.classList.contains('is-enlarged-form')) {
      this.classList.remove('is-enlarged-form');
    }
  }

  private async onOpenConnectWalletView() {
    const id = await this.overlay.open(html`
      <inch-wallet-manage
        showShadow
        @closeCard="${() => this.overlay.close(id)}"
        .controller="${this.applicationContext.connectWalletController}"
      ></inch-wallet-manage>
    `);
  }

  private async onOpenChangeChainView() {
    const id = await this.overlay.open(html`
      <inch-chain-selector-list
        showShadow
        @closeCard="${() => this.overlay.close(id)}"
        .controller="${this.applicationContext.connectWalletController}"
      ></inch-chain-selector-list>
    `);
  }

  private async onOpenMobileSelectToken(event: CustomEvent) {
    this.targetSelectToken = event.detail.value;
    const id = await this.mobileOverlay.open(html`
      <inch-card forMobileView style="width: 100%; height: 100%; display: flex;">
        <inch-select-token
          tokenType="${this.targetSelectToken!}"
          @backCard="${() => this.mobileOverlay.close(id)}"
        ></inch-select-token>
      </inch-card>
    `);
  }

  private async onOpenMobileConfirmSwap(event: CustomEvent) {
    const swapSnapshot = event.detail.value
    const id = await this.mobileOverlay.open(html`
      <inch-card forMobileView style="width: 100%; height: 100%; display: flex;">
        <inch-confirm-swap
          .swapSnapshot="${swapSnapshot}"
          @backCard="${async () => {
            await this.mobileOverlay.close(id);
            this.swapSnapshot = null;
          }}"
        ></inch-confirm-swap>
      </inch-card>
    `);
  }

  private mobileUpdate() {
    let lastPosition = 0;
    let full = false;
    let resetInProgress = false;
    const audio = new AudionController();
    const max = 60;
    const initialResistance = 500000;
    const resistanceThreshold = 3;
    const resistance = 4;
    const root = (): HTMLElement | null => document.querySelector('#app-root');
    const target = (): HTMLElement => this.swapFormContainerRef.value!;
    const loader = (): HTMLElement => this.unicornLoaderRef.value!;
    const set = (position: number) => {
      if (position < 0) return;
      let adjustedPosition: number;

      if (position > max) {
        if (!full) {
          vibrate(50);
          audio.play().then();
        }
        full = true;
        if (position <= max + resistanceThreshold) {
          adjustedPosition = max + (position - max) / initialResistance;
        } else {
          adjustedPosition = max + (resistanceThreshold / initialResistance) + ((position - max - resistanceThreshold) / resistance);
        }
      } else {
        full = false;
        adjustedPosition = position;
      }
      const loaderPosition = (position > max ? max : position) / max;
      appendStyle(loader(), { transform: `scale(${loaderPosition})` });
      appendStyle(target(), { transform: `translate3d(0, ${adjustedPosition}px, 0)` });
      lastPosition = adjustedPosition;
    };
    const reset = async () => {
      resetInProgress = true;
      let _lastPosition = lastPosition;
      if (_lastPosition > max && audio.isPlaying) {
        await target().animate([
          { transform: `translate3d(0, ${_lastPosition}px, 0)` },
          { transform: `translate3d(0, ${max}px, 0)` }
        ], {
          duration: 200,
          easing: 'cubic-bezier(.2, .8, .2, 1)'
        }).finished;
        _lastPosition = max;
        appendStyle(target(), { transform: `translate3d(0, ${_lastPosition}px, 0)` });
        await audio.onEnded();
      }
      await target().animate([
        { transform: `translate3d(0, ${_lastPosition}px, 0)` },
        { transform: `translate3d(0, 0, 0)` }
      ], {
        duration: 800,
        easing: 'cubic-bezier(.2, .8, .2, 1)'
      }).finished;
      set(0);
      appendStyle(target(), { transform: '' });
      full = false;
      resetInProgress = false;
    };
    return defer(() => {
      const targetEl = target();
      return fromEvent<TouchEvent>(targetEl, 'touchstart').pipe(
        filter(() => {
          return !resetInProgress && (root()?.scrollTop ?? 0) === 0;
        }),
        switchMap((startEvent: TouchEvent) => {
          audio.load();
          const startPoint = startEvent.touches[0].clientY;
          return fromEvent<TouchEvent>(targetEl, 'touchmove').pipe(
            map(event => event.touches[0].clientY - startPoint),
            tap(position => set(position)),
            takeUntil(fromEvent<TouchEvent>(targetEl, 'touchend').pipe(
              tap(() => reset())
            ))
          );
        })
      );
    }).pipe(subscribeOn(animationFrameScheduler));
  }
}

class AudionController {

  get isPlaying(): boolean {
    return !this.audio.paused;
  }

  private readonly audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio('audio/unicorn-run.mp3');
    this.audio.preload = 'none';
    this.audio.volume = 0.4;
  }

  load() {
    this.audio.load();
  }

  @CacheActivePromise()
  async play() {
    try {
      await this.audio.play();
    } catch (e) {
      console.error('AudionController Error', e);
    }
  }

  onEnded() {
    return firstValueFrom(fromEvent(this.audio, 'ended'));
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-form-container': SwapFormElement;
  }
}
