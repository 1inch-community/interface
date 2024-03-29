import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { cardStyle } from './card.style';

@customElement(CardElement.tagName)
export class CardElement extends LitElement {
  static tagName = 'inch-card' as const

  static override styles = cardStyle

  protected override render() {
    return html`
      <slot name="header"></slot>
      <div class="card-content">
        <slot></slot>
      </div>
    `
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-card': CardElement
  }
}