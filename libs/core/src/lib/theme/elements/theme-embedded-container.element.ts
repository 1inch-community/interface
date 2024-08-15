import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement(ThemeEmbeddedContainerElement.tagName)
export class ThemeEmbeddedContainerElement extends LitElement {
  static readonly tagName = 'inch-theme-embedded-container';

  protected render() {
    return html`<slot></slot>`
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-theme-embedded-container': ThemeEmbeddedContainerElement
  }
}
