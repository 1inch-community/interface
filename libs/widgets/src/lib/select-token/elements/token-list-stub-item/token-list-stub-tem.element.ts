import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { tokenListStubItemStyle } from './token-list-stub-item.style';

@customElement(TokenListStubTemElement.tagName)
export class TokenListStubTemElement extends LitElement {
  static tagName = 'inch-token-list-stub-item' as const;

  static override styles = tokenListStubItemStyle;

  @property({ type: Boolean, attribute: true }) notShowLoader = false

  protected override render() {
    const classes = {
      'item-container': true,
      'stub-loader': !this.notShowLoader
    }
    return html`
      <div class="${classMap(classes)}">
        <div class="stub-token-icon"></div>
        <div class="name-and-balance">
          <span class="name-stub"></span>
          <span class="balance-stub"></span>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-token-list-stub-item': TokenListStubTemElement;
  }
}