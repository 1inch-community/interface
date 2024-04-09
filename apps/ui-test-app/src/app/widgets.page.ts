import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@one-inch-community/widgets/swap-form';
import '@one-inch-community/widgets/select-token';
import { ChainId, IToken } from '@one-inch-community/models';
import {
  BrandColors,
  MainColors,
  themeChangeBrandColor,
  themeChangeMainColor
} from '@one-inch-community/ui-components/theme';
import { SceneController } from '@one-inch-community/ui-components/scene';

@customElement('app-widgets')
export class WidgetsPage extends LitElement {

  static override styles = [
    css`
        :host {
            display: flex;
            padding-top: 48px;
            justify-content: center;
        }

        .card-inner-layer {
            display: grid;
            gap: 8px;
            grid-template-columns: 1fr 1fr 1fr;
            align-items: center;
            justify-items: center;
        }

        .theme-control-layer {
            grid-template-columns: 1fr 1fr 1fr 1fr;
        }
    `,
    SceneController.styles()
  ]

  private readonly scene = new SceneController('swapForm', {
    swapForm: { width: 556, height: 376.5 },
    selectToken: { width: 556, height: 680 }
  })

  srcToken: IToken = {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    symbol: 'USDT',
    decimals: 6,
    chainId: ChainId.eth,
    name: 'usdt token'
  }

  dstToken: IToken | null = null

  // dstToken = undefined

  protected render() {

    return html`
      
      <inch-card>
        ${this.scene.render({
          swapForm: () => html`
            <inch-swap-form
              chainId="1"
              connectedWalletAddress="0x568D3086f5377e59BF2Ef77bd1051486b581b214"
              withoutBackingCard
              .srcToken="${this.srcToken}"
              .dstToken="${this.dstToken ?? undefined}"
              @openTokenSelector="${() => this.onOpenSelectToken()}"
            ></inch-swap-form>
          `,
          selectToken: () => html`
            <inch-select-token
              chainId="1"
              connectedWalletAddress="0x568D3086f5377e59BF2Ef77bd1051486b581b214"
              @backCard="${() => this.scene.back()}"
            ></inch-select-token>
          `
        })}
      </inch-card>
    `
  }

  onOpenSelectToken() {
    this.scene.nextTo('selectToken')
  }

}