import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { searchTokenInputStyle } from './search-token-input.style';
import '@one-inch-community/ui-components/icon';

@customElement(SearchTokenInputElement.tagName)
export class SearchTokenInputElement extends LitElement {
  static tagName = 'inch-search-token-input' as const

  static override styles = searchTokenInputStyle

  @state() private isFocused = false

  protected override render() {
    const classes = {
      'search-token-input-container': true,
      'search-token-input-container__focused': this.isFocused,
    }
    return html`
      <div class="${classMap(classes)}">
        <inch-icon icon="search24"></inch-icon>
        <input
          @focus="${() => this.isFocused = true}"
          @blur="${() => this.isFocused = false}"
          placeholder="Search token by name or address"
          class="search-token-input"
        >
      </div>
    `
  }

}