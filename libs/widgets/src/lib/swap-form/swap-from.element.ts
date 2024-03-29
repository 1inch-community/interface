import { html, LitElement } from 'lit';
import { ContextProvider } from '@lit/context';
import { customElement, property } from 'lit/decorators.js';
import { type Address, isAddressEqual } from 'viem';
import '@one-inch-community/ui-components/card'
import "@one-inch-community/ui-components/icon"
import "@one-inch-community/ui-components/button"
import { ChainId, IToken } from '@one-inch-community/models';
import { swapFromStyle } from './swap-from.style';
import './elements'
import { swapContext } from './context';
import { SwapContext } from '@one-inch-community/sdk';

function hasChangedToken(value: IToken, oldValue: IToken): boolean {
  if (!oldValue) return true
  return value.symbol !== oldValue.symbol
    || value.chainId !== oldValue.chainId
    || !isAddressEqual(value.address, oldValue.address)
    || value.decimals !== oldValue.decimals
}

function hasChangedAddress(value: Address, oldValue?: Address): boolean {
  if (!oldValue) return true
  return !isAddressEqual(value, oldValue)
}

@customElement(SwapFromElement.tagName)
export class SwapFromElement extends LitElement {
  static tagName = 'inch-swap-form'

  static override styles = swapFromStyle

  @property({ type: Boolean }) withoutBackingCard = false

  @property({ type: Number }) chainId?: ChainId

  @property({ type: Object, hasChanged: hasChangedToken }) srcToken?: IToken

  @property({ type: Object, hasChanged: hasChangedToken }) dstToken?: IToken

  @property({ type: String, hasChanged: hasChangedAddress }) connectedWalletAddress?: Address

  readonly context = new ContextProvider(this, { context: swapContext })

  override connectedCallback() {
    super.connectedCallback();
    const { srcToken, dstToken, connectedWalletAddress, chainId } = this
    if (!chainId) throw new Error('swap form required chain id')
    const context = new SwapContext()
    context.setChainId(chainId)
    context.setPair({ srcToken, dstToken })
    context.setConnectedWalletAddress(connectedWalletAddress)
    context.init()
    this.context.setValue(context)
    this.requestUpdate()
  }

  protected override render() {
    if (!this.context.value) return
    const form = html`
      <div class="input-container">
        <div class="input-header">
          <span>Swap tokens</span>
          <inch-button type="tertiary-gray" size="m">
            <inch-icon icon="authRefresh36"></inch-icon>
          </inch-button>
        </div>
        <inch-swap-form-input tokenType="source"></inch-swap-form-input>
        <inch-token-pair-switch></inch-token-pair-switch>
        <inch-swap-form-input disabled tokenType="destination"></inch-swap-form-input>
      </div>

      <inch-swap-button></inch-swap-button>
    `

    if (this.withoutBackingCard) {
      return html`
        <div class="swap-form-container">
          ${form}
        </div>
      `
    }

    return html`
      <inch-card>
        ${form}
      </inch-card>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-form': SwapFromElement
  }
}