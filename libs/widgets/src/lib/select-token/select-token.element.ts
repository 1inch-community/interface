import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ContextProvider } from '@lit/context';
import '@one-inch-community/ui-components/card';
import { selectTokenStyle } from './select-token.style';
import { selectTokenContext } from './context';
import { SelectTokenContext } from './select-token.context';
import './elements/search-token-input'
import './elements/token-list'
import './elements/favorite-tokens'
import { ChainId } from '@one-inch-community/models';
import { Address, isAddressEqual } from 'viem';

function hasChangedAddress(value: Address, oldValue?: Address): boolean {
  if (!oldValue) return true
  return !isAddressEqual(value, oldValue)
}

@customElement(SelectTokenElement.tagName)
export class SelectTokenElement extends LitElement {
  static tagName = 'inch-select-token' as const

  static override styles = selectTokenStyle

  @property({ type: Number }) chainId?: ChainId

  @property({ type: String, hasChanged: hasChangedAddress }) connectedWalletAddress?: Address

  readonly context = new ContextProvider(this, { context: selectTokenContext })

  protected override render() {
    return html`
      <inch-card-header backButton headerText="Select token"></inch-card-header>
      <inch-search-token-input></inch-search-token-input>
      <inch-favorite-tokens></inch-favorite-tokens>
      <inch-token-list></inch-token-list>
    `
  }

  override connectedCallback() {
    super.connectedCallback()
    const { chainId, connectedWalletAddress } = this
    if (!chainId || !connectedWalletAddress) throw new Error('')
    const context = new SelectTokenContext()
    context.setChainId(chainId)
    context.setConnectedWalletAddress(connectedWalletAddress)
    this.context.setValue(context)
  }
}