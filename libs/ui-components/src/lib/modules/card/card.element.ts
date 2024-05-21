import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { cardStyle } from './card.style';

@customElement(CardElement.tagName)
export class CardElement extends LitElement {
  static tagName = 'inch-card' as const

  static override styles = cardStyle

  @property({ type: Boolean }) forMobileView = false

  @property({ type: Boolean }) showShadow = false

  protected override render() {
    return html`
      <slot name="header"></slot>
      <div class="card-content">
        <slot></slot>
      </div>
    `
  }

  protected override firstUpdated() {
    if (this.forMobileView && !this.classList.contains('mobile')) {
      this.classList.add('mobile')
    }
    if (this.showShadow && !this.classList.contains('shadow')) {
      this.classList.add('shadow')
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-card': CardElement
  }
}
