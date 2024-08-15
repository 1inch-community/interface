import { customElement } from 'lit/decorators.js';
import { css, html, LitElement } from 'lit';
import { provide } from '@lit/context';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';
import { getContext } from './context';

@customElement(GlobalApplicationContextElement.tagName)
export class GlobalApplicationContextElement extends LitElement {
  static readonly tagName = 'global-application-context';

  static override readonly styles = css`
    :host {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
  `

  @provide({ context: ApplicationContextToken })
  context = getContext()

  protected render() {
    return html`<slot></slot>`;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'global-application-context': GlobalApplicationContextElement
  }
}
