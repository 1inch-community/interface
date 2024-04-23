import { html, LitElement } from 'lit';
import { filter, fromEvent, tap } from 'rxjs';
import { customElement, state } from 'lit/decorators.js';
import '@one-inch-community/ui-components/card';
import '@one-inch-community/widgets/swap-form';
import '@one-inch-community/widgets/select-token';
import "@one-inch-community/widgets/wallet-manage"
import { isTokensEqual, storage, TokenController } from '@one-inch-community/sdk';
import { getMobileMatchMediaAndSubscribe, observe, subscribe } from '@one-inch-community/ui-components/lit';
import { OverlayMobileController, OverlayController } from '@one-inch-community/ui-components/overlay';
import { SceneController } from '@one-inch-community/ui-components/scene';
import { ChainId, IToken } from '@one-inch-community/models';
import { swapFormStyle } from './swap-form.style';
import { getFooterHeight, getHeaderHeight } from '../../platform/sizes';
import { connectWalletController } from '../../controllers/connect-wallet-controller';

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

  private readonly chainId$ = connectWalletController.data.chainId$
  private readonly activeAddress$ = connectWalletController.data.activeAddress$

  private readonly desktopScene = new SceneController('swapForm', {
    swapForm: { width: 556, height: 376.5 },
    selectToken: { width: 556, height: this.calculateSelectTokenHeight() }
  })

  private readonly selectTokenMobileOverlay = new OverlayMobileController('app-root')

  private readonly connectWalletOverlay = new OverlayController('app-root', 'center')

  constructor() {
    super();
    this.initTokens().catch()
  }

  async connectedCallback() {
    super.connectedCallback();

    subscribe(this, [
      fromEvent(window, 'resize').pipe(
        tap(() => this.updateViewSize())
      ),
      this.chainId$.pipe(
        filter(Boolean),
        tap((chainId) => this.syncTokens(chainId))
      )
    ], { requestUpdate: false })
  }

  protected render() {
    if (this.mobileMedia.matches) {
      return this.getMobileSwapForm()
    }
    return this.getDesktopSwapForm()
  }

  private async syncTokens(chainId: ChainId) {
    const srcTokenSymbol = this.srcToken?.symbol
    const dstTokenSymbol = this.dstToken?.symbol
    if (srcTokenSymbol) {
      const tokenList = await TokenController.getTokenBySymbol(chainId, srcTokenSymbol)
      if (!tokenList.length) {
        this.srcToken = await TokenController.getNativeToken(chainId)
      } else {
        this.srcToken = tokenList[0]
      }

    }
    if (dstTokenSymbol) {
      const tokenList = await TokenController.getTokenBySymbol(chainId, dstTokenSymbol)
      this.dstToken = tokenList[0]
    }
  }

  private async initTokens() {
    const srcTokenSymbol: string | null = storage.get('src-token-symbol', JSON.parse)
    const dstTokenSymbol: string | null = storage.get('dst-token-symbol', JSON.parse)
    if (!srcTokenSymbol && !dstTokenSymbol) return
    const chainId = await connectWalletController.data.getChainId()
    if (!chainId) return
    if (srcTokenSymbol) {
      const tokenList = await TokenController.getTokenBySymbol(chainId, srcTokenSymbol)
      this.srcToken = tokenList[0]
    }
    if (dstTokenSymbol) {
      const tokenList = await TokenController.getTokenBySymbol(chainId, dstTokenSymbol)
      this.dstToken = tokenList[0]
    }
  }

  private getMobileSwapForm() {
    return html`
      <inch-card>
        <inch-swap-form
          withoutBackingCard
          connectedWalletAddress="0x568D3086f5377e59BF2Ef77bd1051486b581b214"
          chainId="${observe(this.chainId$)}"
          .srcToken="${this.srcToken}"
          .dstToken="${this.dstToken}"
          @openTokenSelector="${(event: CustomEvent) => this.onOpenMobileSelectToken(event)}"
          @connectWallet="${() => this.onOpenConnectWalletView()}"
        ></inch-swap-form>
      </inch-card>
    `;
  }

  private getDesktopSwapForm() {
    return html`
      <inch-card>
        ${this.desktopScene.render({
          swapForm: () => html`
            <inch-swap-form
              chainId="${observe(this.chainId$)}"
              connectedWalletAddress="${observe(this.activeAddress$)}"
              withoutBackingCard
              .srcToken="${this.srcToken}"
              .dstToken="${this.dstToken}"
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
    `;
  }

  private async onOpenSelectToken(event: CustomEvent) {
    await this.desktopScene.nextTo('selectToken')
    this.targetSelectToken = event.detail.value
  }

  private onSelectToken(event: CustomEvent) {
    const token: IToken = event.detail.value
    if (this.targetSelectToken === 'source') {
      if (this.dstToken && isTokensEqual(token, this.dstToken)) {
        this.dstToken = this.srcToken
        storage.set('dst-token-symbol', this.dstToken?.symbol)
      }
      this.srcToken = token
      storage.set('src-token-symbol', this.srcToken?.symbol)
    }
    if (this.targetSelectToken === 'destination') {
      if (!this.dstToken && this.srcToken && isTokensEqual(token, this.srcToken)) {
        return
      }
      if (this.srcToken && isTokensEqual(token, this.srcToken)) {
        this.srcToken = this.dstToken
        storage.set('src-token-symbol', this.srcToken?.symbol)
      }
      this.dstToken = token
      storage.set('dst-token-symbol', this.dstToken?.symbol)
    }
  }

  private async onOpenConnectWalletView() {
    const id = await this.connectWalletOverlay.open(html`
      <inch-wallet-manage
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

  private updateViewSize() {
    if (this.desktopScene.getCurrentSceneName() === 'swapForm') return
    this.desktopScene.updateSceneConfig({ width: 556, height: this.calculateSelectTokenHeight() })
  }

  private calculateSelectTokenHeight() {
    if (window.innerHeight > 897) {
      return 680
    }
    let padding = 48
    if (this.mobileMedia.matches) {
      padding = 24
    }
    const result = window.innerHeight
      - getHeaderHeight()
      - getFooterHeight()
      - padding // top padding
      - 32 // card border 16px top + 16px bottom

    if (result < 376.5) {
      return 376.5
    }

    return result
  }
}