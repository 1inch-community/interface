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
import { getClient } from '@one-inch-community/sdk';

@customElement('app-widgets')
export class WidgetsPage extends LitElement {

  static override styles = [
    css`
        :host {
            display: flex;
            height: calc(100vh - 16px * 2);
            padding: 16px;
            gap: 8px;
            flex-direction: column;
            flex-wrap: wrap;
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
    selectToken: { width: 556, height: 400 }
  })

  srcToken: IToken = {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    symbol: 'USDT',
    decimals: 6,
    chainId: ChainId.eth,
    name: 'usdt token'
  }

  dstToken: IToken = {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    symbol: 'DAI',
    decimals: 18,
    chainId: ChainId.eth,
    name: 'dai token'
  }

  // dstToken = undefined

  protected render() {
    const client = getClient(ChainId.eth)
    client.estimateFeesPerGas().then(console.log)
    client.getGasPrice().then(console.log)

    return html`
      <inch-card>
        <div class="card-inner-layer theme-control-layer">
          <inch-button @click="${(event: MouseEvent) => themeChangeMainColor(MainColors.dark, event)}"><span>Dark</span></inch-button>
          <inch-button @click="${(event: MouseEvent) => themeChangeMainColor(MainColors.darkBlue, event)}"><span>Dark Blue</span></inch-button>
          <inch-button @click="${(event: MouseEvent) => themeChangeMainColor(MainColors.light, event)}"><span>Light</span></inch-button>
          <inch-button @click="${(event: MouseEvent) => themeChangeMainColor(MainColors.lightBlue, event)}"><span>Light Blue</span></inch-button>
        </div>
      </inch-card>

      <inch-card>
        <div class="card-inner-layer">
          <inch-button @click="${(event: MouseEvent) => themeChangeBrandColor(BrandColors.community, event)}"><span>Community</span></inch-button>
          <inch-button @click="${(event: MouseEvent) => themeChangeBrandColor(BrandColors.orange, event)}"><span>Orange</span></inch-button>
          <inch-button @click="${(event: MouseEvent) => themeChangeBrandColor(BrandColors.violet, event)}"><span>Violet</span></inch-button>
        </div>
      </inch-card>
      
      <inch-card>
        ${this.scene.render({
          swapForm: () => html`
            <inch-swap-form
              chainId="1"
              connectedWalletAddress="0x568D3086f5377e59BF2Ef77bd1051486b581b214"
              withoutBackingCard
              .srcToken="${this.srcToken}"
              .dstToken="${this.dstToken}"
              @open-token-selector="${() => this.onOpenSelectToken()}"
            ></inch-swap-form>
          `,
          selectToken: () => html`
            <inch-select-token @backCard="${() => this.scene.back()}"></inch-select-token>
          `
        })}
      </inch-card>
    `
  }

  onOpenSelectToken() {
    this.scene.nextTo('selectToken')
  }

}