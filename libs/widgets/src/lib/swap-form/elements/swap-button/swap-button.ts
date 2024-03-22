import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@one-inch-community/ui-components/button'
import { consume } from '@lit/context';
import { swapContext } from '../../context';
import { ISwapContext } from '@one-inch-community/models';

@customElement(SwapButton.tagName)
export class SwapButton extends LitElement {
  static tagName = 'inch-swap-button' as const

  @consume({ context: swapContext })
  context?: ISwapContext

  protected override render() {
    return html`
      <inch-button type="secondary" size="xxl" fullSize>
        Connect wallet
      </inch-button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-button': SwapButton
  }
}