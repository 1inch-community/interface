import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { SwapContextToken } from '@one-inch-community/sdk/swap';
import { IApplicationContext, ISwapContext, SwapSnapshot, TokenType } from '@one-inch-community/models';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';
import { SceneController } from '@one-inch-community/ui-components/scene';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { OverlayController } from '@one-inch-community/ui-components/overlay';
import { swapFormStyle } from './swap-form.style';

import '@one-inch-community/ui-components/card';
import '@one-inch-community/widgets/swap-form';
import { subscribe } from '@one-inch-community/core/lit';
import { BrandColors, getThemeChange } from '@one-inch-community/core/theme';
import { distinctUntilChanged, map, tap } from 'rxjs';

import('@one-inch-community/widgets/wallet-manage');
import('@one-inch-community/widgets/select-token');
import('@one-inch-community/ui-components/icon');

@customElement(SwapFormDesktopElement.tagName)
export class SwapFormDesktopElement extends LitElement {
  static readonly tagName = 'inch-swap-form-desktop' as const;

  static styles = [
    swapFormStyle,
    SceneController.styles()
  ];

  @consume({ context: SwapContextToken })
  swapContext!: ISwapContext

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext

  @state() private isRainbowTheme = false;

  private targetSelectToken: TokenType | null = null;

  private swapSnapshot: SwapSnapshot | null = null;

  private readonly overlay = new OverlayController('app-root', 'center');

  private readonly desktopScene = new SceneController('swapForm', {
    swapForm: { minWidth: 556, maxWidth: 556, maxHeight: 625, lazyRender: true },
    selectToken: { minWidth: 556, maxWidth: 556, maxHeight: 680 },
    confirmSwap: { minWidth: 556, maxWidth: 556, maxHeight: 680 }
  });

  protected firstUpdated() {
    subscribe(this, [
      getThemeChange().pipe(
        map(({ brandColor }) => brandColor),
        distinctUntilChanged(),
        tap(color => this.isRainbowTheme = color === BrandColors.rainbow)
      ),
    ], { requestUpdate: false });
  }

  protected render() {
    const classes = {
      'shadow-container': true,
      'shadow-container-rainbow': this.isRainbowTheme
    };
    return html`
      <div class="${classMap(classes)}">
        <inch-card>
          ${this.desktopScene.render({
            swapForm: () => html`
              <inch-swap-form
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
    `
  }

  private async onOpenSelectToken(event: CustomEvent) {
    this.targetSelectToken = event.detail.value;
    await this.desktopScene.nextTo('selectToken');
  }

  private async onOpenConfirmSwap(event: CustomEvent) {
    this.swapSnapshot = event.detail.value;
    await this.desktopScene.nextTo('confirmSwap');
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

  private async onOpenConnectWalletView() {
    const id = await this.overlay.open(html`
      <inch-wallet-manage
        showShadow
        @closeCard="${() => this.overlay.close(id)}"
        .controller="${this.applicationContext.connectWalletController}"
      ></inch-wallet-manage>
    `);
  }

}
