import { html, LitElement } from 'lit';
import { distinctUntilChanged, filter, map, tap } from 'rxjs';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import '@one-inch-community/ui-components/card';
import '@one-inch-community/widgets/swap-form';
import "@one-inch-community/widgets/wallet-manage"
import { isTokensEqual, storage, TokenController, getChainById } from '@one-inch-community/sdk';
import { getMobileMatchMediaAndSubscribe, observe, subscribe } from '@one-inch-community/lit';
import { OverlayMobileController, OverlayController } from '@one-inch-community/ui-components/overlay';
import { SceneController, sceneLazyValue } from '@one-inch-community/ui-components/scene';
import { getThemeChange, BrandColors } from '@one-inch-community/ui-components/theme';
import { ChainId, IToken } from '@one-inch-community/models';
import { swapFormStyle } from './swap-form.style';
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

  @state() private isRainbowTheme = false

  private readonly chainId$ = connectWalletController.data.chainId$
  private readonly activeAddress$ = connectWalletController.data.activeAddress$

  private readonly swapFormRef = createRef<HTMLElement>()

  private readonly desktopScene = new SceneController('swapForm', {
    swapForm: { minWidth: 556, minHeight: 376.5, lazyRender: true },
    selectToken: { minWidth: 556, minHeight: 376.5, maxHeight: 680 }
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
      this.chainId$.pipe(
        filter(Boolean),
        tap((chainId) => this.syncTokens(chainId))
      )
    ], { requestUpdate: false })

    subscribe(this, [
      getThemeChange().pipe(
        map(({ brandColor }) => brandColor),
        distinctUntilChanged(),
        tap(color => this.isRainbowTheme = color === BrandColors.rainbow),
      )
    ])

    await import('@one-inch-community/widgets/select-token')
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
        this.setSrcToken(await TokenController.getNativeToken(chainId))
      } else {
        this.setSrcToken(tokenList[0])
      }

    }
    if (dstTokenSymbol) {
      const tokenList = await TokenController.getTokenBySymbol(chainId, dstTokenSymbol)
      this.setDstToken(tokenList[0])
    }
  }

  private async initTokens() {
    const chainId = await connectWalletController.data.getChainId()
    if (!chainId) return
    const chain = getChainById(chainId)
    const srcTokenSymbol: string | null = storage.get('src-token-symbol', JSON.parse) ?? chain.nativeCurrency.symbol
    const dstTokenSymbol: string | null = storage.get('dst-token-symbol', JSON.parse)
    if (!srcTokenSymbol && !dstTokenSymbol) return
    if (srcTokenSymbol) {
      const tokenList = await TokenController.getTokenBySymbol(chainId, srcTokenSymbol)
      this.setSrcToken(tokenList[0])
    }
    if (dstTokenSymbol) {
      const tokenList = await TokenController.getTokenBySymbol(chainId, dstTokenSymbol)
      this.setDstToken(tokenList[0])
    }
  }

  private getMobileSwapForm() {
    const classes = {
      'shadow-container': true,
      'shadow-container-rainbow': this.isRainbowTheme
    }
    return html`
      <div class="${classMap(classes)}">
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
      <div class="${classMap(classes)}">
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
    storage.set('src-token-symbol', token?.symbol)
  }

  private setDstToken(token: IToken| null): void {
    this.dstToken = token
    storage.set('dst-token-symbol', token?.symbol)
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
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-form-container': SwapFormElement
  }
}
