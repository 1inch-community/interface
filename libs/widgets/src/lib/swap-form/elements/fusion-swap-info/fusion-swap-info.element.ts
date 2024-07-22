import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ISwapContext } from '@one-inch-community/models';
import { fusionSwapInfoStyle } from './fusion-swap-info.style';
import '@one-inch-community/ui-components/icon';
import '@one-inch-community/ui-components/button';
import '../fusion-swap-info-slippage';
import '../fusion-swap-info-auction-time';
import '../fusion-swap-info-main';
import { SceneController, shiftAnimation } from '@one-inch-community/ui-components/scene';
import { consume } from '@lit/context';
import { SwapContextToken } from '@one-inch-community/sdk/swap';

@customElement(FusionSwapInfoElement.tagName)
export class FusionSwapInfoElement extends LitElement {
  static tagName = 'inch-fusion-swap-info' as const;

  static override styles = [
    fusionSwapInfoStyle,
    SceneController.styles()
  ];

  @consume({ context: SwapContextToken })
  context?: ISwapContext;

  private isOpenFusionInfo = false;

  private readonly scene = new SceneController('main', {
    main: { lazyRender: true, minHeight: 178 },
    slippage: { minHeight: 79.5 },
    auctionTime: { minHeight: 79.5 }
  }, shiftAnimation());

  protected override render() {
    return this.scene.render({
      main: () => html`
        <inch-fusion-swap-info-main
          .isOpen="${this.isOpenFusionInfo}"
          @openSlippageSettings="${() => this.scene.nextTo('slippage')}"
          @openAuctionTimeSettings="${() => this.scene.nextTo('auctionTime')}"
        ></inch-fusion-swap-info-main>
      `,
      slippage: () => html`
        <inch-fusion-swap-info-slippage
          .settings="${this.context?.getSettingsController('slippage')}"
          @back="${() => {
            this.isOpenFusionInfo = true;
            this.scene.back();
          }}"
        ></inch-fusion-swap-info-slippage>
      `,
      auctionTime: () => html`
        <inch-fusion-swap-info-auction-time
          .settings="${this.context?.getSettingsController('auctionTime')}"
          @back="${() => {
            this.isOpenFusionInfo = true;
            this.scene.back();
          }}"
        ></inch-fusion-swap-info-auction-time>
      `
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-fusion-swap-info': FusionSwapInfoElement;
  }
}
