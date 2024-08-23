import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { tokenListStubItemStyle } from './token-list-stub-item.style';
import { skeletonStyle } from '@one-inch-community/core/theme';

@customElement(TokenListStubTemElement.tagName)
export class TokenListStubTemElement extends LitElement {
  static tagName = 'inch-token-list-stub-item' as const;

  static override styles = [
    tokenListStubItemStyle,
    skeletonStyle({ prefixName: 'token-icon' }),
    skeletonStyle({ prefixName: 'name-and-balance', animationDelay: '.7s' })
  ];

  protected override render() {
    return html`
      <div class="item-container">
        <div class="stub-token-icon skeleton-token-icon"></div>
        <div class="name-and-balance">
          <span class="name-stub skeleton-name-and-balance"></span>
          <span class="balance-stub skeleton-name-and-balance"></span>
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
