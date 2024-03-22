import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { inputStyle } from './input.style';
import { ISwapContext } from '@one-inch-community/models';
import { consume } from '@lit/context';
import { swapContext } from '../../context';
import { bindEmitter, dispatchEvent } from '@one-inch-community/utils';
import '../balance/balance.element'
import "@one-inch-community/ui-components/token-icon"
import "@one-inch-community/ui-components/icon"

@customElement(InputElement.tagName)
export class InputElement extends LitElement {
  static tagName = 'inch-swap-form-input'

  static override styles = inputStyle

  @property({ type: Boolean, attribute: true, reflect: true }) disabled = false

  @property({ type: String, attribute: true, reflect: true }) tokenType?: 'source' | 'destination'

  @consume({ context: swapContext })
  context?: ISwapContext

  readonly token = bindEmitter(this, () => this.getTokenEventEmitter())

  readonly chainId = bindEmitter(this, () => this.getChainEventEmitter())

  protected override render() {
    if (!this.token.value) return
    const { symbol, address, chainId, name } = this.token.value
    const classes = {
      disabled: this.disabled
    }
    return html`
      <div class="input-container ${classMap(classes)}">
        <div class="flex-container">
          <div class="input-title">${this.getInputTitle()}</div>
          <button @click="${(event: MouseEvent) => dispatchEvent(this, 'open-token-selector', this.tokenType, event)}" class="symbol-container">
            <inch-token-icon symbol="${symbol}" address="${address}" chainId="${chainId}"></inch-token-icon>
            <span class="symbol">${symbol}</span>
            <inch-icon icon="chevronDown16"></inch-icon>
          </button>
          <div class="token-name">${name}</div>
        </div>
        
        <div class="flex-container">
          <inch-swap-balance tokenType="${ifDefined(this.tokenType)}"></inch-swap-balance>
          <span></span>
          <span></span>
        </div>
      </div>
    `
  }

  private getTokenEventEmitter() {
    if (!this.context) throw new Error('')
    if (!this.tokenType) throw new Error('')
    return this.context.getTokenByType(this.tokenType)
  }

  private getChainEventEmitter() {
    if (!this.context) throw new Error('')
    return this.context.chainId
  }

  private getInputTitle() {
    if (this.tokenType === 'source') {
      return 'You pay'
    }
    if (this.tokenType === 'destination') {
      return 'You receive'
    }
    throw new Error(`invalid token type ${this.tokenType} in swap input`)
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-form-input': InputElement
  }
}