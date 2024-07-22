import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { SwapContextToken } from '@one-inch-community/sdk/swap';
import { IApplicationContext, ISwapContext, TokenType } from '@one-inch-community/models';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';
import { swapFormStyle } from './swap-form.style';
import { SceneController } from '@one-inch-community/ui-components/scene';
import { ref, createRef } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';

import '@one-inch-community/ui-components/card';
import '@one-inch-community/widgets/swap-form';
import { OverlayMobileController } from '@one-inch-community/ui-components/overlay';
import { subscribe } from '@one-inch-community/core/lit';
import { BrandColors, getThemeChange } from '@one-inch-community/core/theme';
import { distinctUntilChanged, map, tap } from 'rxjs';
import { unicornTouchUpdate } from './unicorn-updater';

import('@one-inch-community/widgets/wallet-manage');
import('@one-inch-community/widgets/select-token');
import('@one-inch-community/ui-components/icon');

@customElement(SwapFormMobileElement.tagName)
export class SwapFormMobileElement extends LitElement {
  static readonly tagName = 'inch-swap-form-mobile';

  static styles = [
    swapFormStyle,
    SceneController.styles()
  ];

  @consume({ context: SwapContextToken })
  swapContext!: ISwapContext;

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext;

  @state() private isRainbowTheme = false;

  private targetSelectToken: TokenType | null = null;

  private readonly mobileOverlay = new OverlayMobileController('app-root');

  private readonly swapFormContainerRef = createRef<HTMLElement>();
  private readonly unicornLoaderRef = createRef<HTMLElement>();

  protected firstUpdated() {
    setTimeout(() => this.classList.add('padding-top-transition'), 100);
    subscribe(this, [
      getThemeChange().pipe(
        map(({ brandColor }) => brandColor),
        distinctUntilChanged(),
        tap(color => this.isRainbowTheme = color === BrandColors.rainbow)
      ),
      unicornTouchUpdate(this.swapFormContainerRef, this.unicornLoaderRef)
    ], { requestUpdate: false });
  }

  protected render() {
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

  private onChangeFusionInfoOpenState(event: CustomEvent) {
    if (event.detail.value && !this.classList.contains('is-enlarged-form')) {
      this.classList.add('is-enlarged-form');
    }
    if (!event.detail.value && this.classList.contains('is-enlarged-form')) {
      this.classList.remove('is-enlarged-form');
    }
  }

  private async onOpenMobileConfirmSwap(event: CustomEvent) {
    const swapSnapshot = event.detail.value;
    const id = await this.mobileOverlay.open(html`
      <inch-card forMobileView style="width: 100%; height: 100%; display: flex;">
        <inch-confirm-swap
          .swapContext="${this.swapContext}"
          .swapSnapshot="${swapSnapshot}"
          @backCard="${async () => {
            await this.mobileOverlay.close(id);
          }}"
        ></inch-confirm-swap>
      </inch-card>
    `);
  }

  private async onOpenMobileSelectToken(event: CustomEvent) {
    this.targetSelectToken = event.detail.value;
    const id = await this.mobileOverlay.open(html`
      <inch-card forMobileView style="width: 100%; height: 100%; display: flex;">
        <inch-select-token
          .swapContext="${this.swapContext}"
          tokenType="${this.targetSelectToken!}"
          @backCard="${() => this.mobileOverlay.close(id)}"
        ></inch-select-token>
      </inch-card>
    `);
  }

  private async onOpenChangeChainView() {
    const id = await this.mobileOverlay.open(html`
      <inch-chain-selector-list
        showShadow
        @closeCard="${() => this.mobileOverlay.close(id)}"
        .controller="${this.applicationContext.connectWalletController}"
      ></inch-chain-selector-list>
    `);
  }

  private async onOpenConnectWalletView() {
    const id = await this.mobileOverlay.open(html`
      <inch-wallet-manage
        showShadow
        @closeCard="${() => this.mobileOverlay.close(id)}"
        .controller="${this.applicationContext.connectWalletController}"
      ></inch-wallet-manage>
    `);
  }

}
