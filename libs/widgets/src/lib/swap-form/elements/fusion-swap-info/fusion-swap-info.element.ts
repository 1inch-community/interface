import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { fusionSwapInfoStyle } from './fusion-swap-info.style';
import '@one-inch-community/ui-components/icon';
import '@one-inch-community/ui-components/button';
import '../fusion-swap-info-slippage';
import '../fusion-swap-info-main';
import { SceneController } from '@one-inch-community/ui-components/scene';

@customElement(FusionSwapInfoElement.tagName)
export class FusionSwapInfoElement extends LitElement {
  static tagName = 'inch-fusion-swap-info' as const;

  static override styles = [
    fusionSwapInfoStyle,
    SceneController.styles()
  ];

  private readonly scene = new SceneController('main', {
    main: {},
    slippage: {}
  });

  protected override render() {
    return this.scene.render({
      main: () => html`
        <inch-fusion-swap-info-main
          
        ></inch-fusion-swap-info-main>
      `,
      slippage: () => html`
        <inch-fusion-swap-info-slippage></inch-fusion-swap-info-slippage>
      `
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-fusion-swap-info': FusionSwapInfoElement;
  }
}