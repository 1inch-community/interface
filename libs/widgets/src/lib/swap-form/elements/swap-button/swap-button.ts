import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@one-inch-community/ui-components/button'
import { consume } from '@lit/context';
import { swapContext } from '../../context';
import { ISwapContext } from '@one-inch-community/models';
import { defer, map } from 'rxjs';
import { observe } from '@one-inch-community/ui-components/lit';

@customElement(SwapButton.tagName)
export class SwapButton extends LitElement {
  static tagName = 'inch-swap-button' as const

  @consume({ context: swapContext })
  context?: ISwapContext

  private readonly connectedWalletAddress$ = defer(() => this.getConnectedWalletAddress())

  private readonly buttonType$ = this.connectedWalletAddress$.pipe(
    map(address => address ? 'primary' : 'secondary'),
  )

  private readonly buttonText$ = this.connectedWalletAddress$.pipe(
    map(address => address ? 'Swap' : 'Connect wallet'),
  )

  protected override render() {
    return html`
      <inch-button type="${observe(this.buttonType$, 'secondary')}" size="xxl" fullSize>
        ${observe(this.buttonText$)}
      </inch-button>
    `
  }

  private getConnectedWalletAddress() {
    if (!this.context) throw new Error('')
    return this.context.connectedWalletAddress$
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-button': SwapButton
  }
}