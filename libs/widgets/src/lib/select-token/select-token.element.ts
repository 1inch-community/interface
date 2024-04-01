import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ContextProvider } from '@lit/context';
import '@one-inch-community/ui-components/card';
import { selectTokenStyle } from './select-token.style';
import { selectTokenContext } from './context';
import { SelectTokenContext } from './select-token.context';
import './elements/search-token-input'

@customElement(SelectTokenElement.tagName)
export class SelectTokenElement extends LitElement {
  static tagName = 'inch-select-token' as const

  static override styles = selectTokenStyle

  readonly context = new ContextProvider(this, { context: selectTokenContext })

  protected override render() {
    return html`
      <inch-card-header backButton headerText="Select token"></inch-card-header>
      <inch-search-token-input></inch-search-token-input>
    `
  }

  override connectedCallback() {
    super.connectedCallback()
    const context = new SelectTokenContext()
    this.context.setValue(context)
  }
}