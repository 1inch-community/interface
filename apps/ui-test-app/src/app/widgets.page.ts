import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@one-inch-community/widgets/swap-form';
import '@one-inch-community/widgets/select-token';
import '@one-inch-community/widgets/wallet-manage';
import '@one-inch-community/ui-components/card';
import '@one-inch-community/ui-components/button';
import { ChainId, IToken } from '@one-inch-community/models';
import {
  BrandColors,
  MainColors,
  themeChangeBrandColor,
  themeChangeMainColor
} from '@one-inch-community/core/theme';
import { SceneController } from '@one-inch-community/ui-components/scene';
import { connectWalletController } from './connect-wallet-controller';
import { observe } from '@one-inch-community/core/lit';

@customElement('app-widgets')
export class WidgetsPage extends LitElement {

  static override styles = [
    css`
        :host {
            display: flex;
            padding-top: 48px;
            flex-wrap: wrap;
            gap: 8px;
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

  dstToken: IToken = {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    symbol: 'DAI',
    decimals: 18,
    chainId: ChainId.eth,
    name: 'dai token'
  }

  // dstToken = undefined

  protected render() {

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
        <span>Chain id ${observe(connectWalletController.data.chainId$)}</span>
        <div class="card-inner-layer">
          <inch-button @click="${() => connectWalletController.changeChain(ChainId.eth)}"><span>ETH</span></inch-button>
          <inch-button @click="${() => connectWalletController.changeChain(ChainId.bnb)}"><span>BNB</span></inch-button>
          <inch-button @click="${() => connectWalletController.changeChain(ChainId.matic)}"><span>MATIC</span></inch-button>
        </div>
      </inch-card>
      
      
      <inch-card>
        ${this.scene.render({
          swapForm: () => html`
            <inch-swap-form
              chainId="1"
              connectedWalletAddress="0x568D3086f5377e59BF2Ef77bd1051486b581b214"
              .srcToken="${this.srcToken}"
              .dstToken="${this.dstToken}"
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
      
      <inch-connect-wallet-view .controller="${connectWalletController}"></inch-connect-wallet-view>
      <inch-wallet-manage .controller="${connectWalletController}"></inch-wallet-manage>
    `
  }

  onOpenSelectToken() {
    this.scene.nextTo('selectToken')
  }

}
