import { html, LitElement } from 'lit';
import { ContextProvider } from '@lit/context';
import { customElement, property } from 'lit/decorators.js';
import { type Address, isAddressEqual } from 'viem';
import '@one-inch-community/ui-components/card'
import { ChainId, IToken } from '@one-inch-community/models';
import { SwapContext } from '@one-inch-community/sdk/swap-context';
import { swapFromStyle } from './swap-from.style';
import './elements'
import { swapContext } from './context';

function hasChangedToken(value: IToken, oldValue: IToken): boolean {
  return value.symbol !== oldValue.symbol
    || value.chainId !== oldValue.chainId
    || !isAddressEqual(value.address, oldValue.address)
    || value.decimal !== oldValue.decimal
}

function hasChangedAddress(value: Address, oldValue: Address): boolean {
  return !isAddressEqual(value, oldValue)
}

@customElement(SwapFromElement.tagName)
export class SwapFromElement extends LitElement {
  static tagName = 'inch-swap-form'

  static override styles = swapFromStyle

  @property({ type: Number }) chainId?: ChainId

  @property({ type: Object, hasChanged: hasChangedToken }) srcToken?: IToken

  @property({ type: Object, hasChanged: hasChangedToken }) dstToken?: IToken

  @property({ type: String, hasChanged: hasChangedAddress }) connectedWalletAddress?: Address

  readonly context = new ContextProvider(this, { context: swapContext })

  protected override render() {
    if (!this.context.value) return
    return html`
      <inch-card>
        <div class="input-container">
          <inch-swap-form-input tokenType="source"></inch-swap-form-input>
          <inch-token-pair-switch></inch-token-pair-switch>
          <inch-swap-form-input disabled tokenType="destination"></inch-swap-form-input>
        </div>

        <inch-swap-button></inch-swap-button>
      </inch-card>
    `
  }

  protected override firstUpdated() {
    const { srcToken, dstToken, connectedWalletAddress, chainId } = this
    if (!chainId) throw new Error('swap form required chain id')
    const context = new SwapContext()
    context.setChainId(chainId)
    context.setPair({ srcToken, dstToken })
    context.setConnectedWalletAddress(connectedWalletAddress)
    this.context.setValue(context)
    this.requestUpdate()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-form': SwapFromElement
  }
}