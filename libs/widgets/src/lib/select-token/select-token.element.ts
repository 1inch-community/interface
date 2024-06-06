import { html, LitElement, PropertyValues } from 'lit';
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
import { createMainViewportContext } from '@one-inch-community/ui-components/scroll';
import { Address } from 'viem';


@customElement(SelectTokenElement.tagName)
export class SelectTokenElement extends LitElement {
  static tagName = 'inch-select-token' as const

  static override styles = selectTokenStyle

  @property({ type: Number }) chainId?: ChainId

  @property({ type: String }) connectedWalletAddress?: Address

  readonly context = new ContextProvider(this, { context: selectTokenContext })

  override connectedCallback() {
    super.connectedCallback();
    createMainViewportContext(this)
  }

  protected override render() {
    this.initContext()
    return html`
      <inch-token-list
        .header="${() => html`
          <div style="margin-left: 1px; margin-right: 1px">
            <inch-card-header backButton headerText="Select token"></inch-card-header>
            <inch-search-token-input></inch-search-token-input>
            <inch-favorite-tokens></inch-favorite-tokens>
          </div>
        `}"
      ></inch-token-list>
    `
  }

  protected override updated(changedProperties: PropertyValues) {
    let isDirty = false
    const context = this.context.value
    if (changedProperties.has('chainId') && this.chainId) {
      context.setChainId(this.chainId)
      isDirty = true
    }
    if (changedProperties.has('connectedWalletAddress')) {
      context.setConnectedWalletAddress(this.connectedWalletAddress)
      isDirty = true
    }
    if (isDirty) {
      this.requestUpdate()
    }
  }

  private initContext() {
    if (this.context.value) return
    const { chainId, connectedWalletAddress } = this
    if (!chainId) throw new Error('')
    const context = new SelectTokenContext()
    context.setChainId(chainId)
    context.setConnectedWalletAddress(connectedWalletAddress)
    this.context.setValue(context)
  }
}


declare global {
  interface HTMLElementTagNameMap {
    'inch-select-token': SelectTokenElement
  }
}
