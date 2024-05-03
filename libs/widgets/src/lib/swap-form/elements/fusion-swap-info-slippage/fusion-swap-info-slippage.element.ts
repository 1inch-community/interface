import { LitElement, html } from 'lit';
import { fusionSwapInfoSlippageStyle } from './fusion-swap-info-slippage.style';
import { customElement } from 'lit/decorators.js';

@customElement(FusionSwapInfoSlippageElement.tagName)
export class FusionSwapInfoSlippageElement extends LitElement {
  static tagName = 'inch-fusion-swap-info-slippage' as const;

  static override styles = fusionSwapInfoSlippageStyle

  protected override render() {
    return html`
      
    `
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-fusion-swap-info-slippage': FusionSwapInfoSlippageElement
  }
}