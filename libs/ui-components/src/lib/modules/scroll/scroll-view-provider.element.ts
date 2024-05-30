import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ContextProvider } from '@lit/context';
import { ScrollContext, scrollContext } from './scroll-context';
import { appendStyle } from '@one-inch-community/lit';


@customElement(ScrollViewProviderElement.tagName)
export class ScrollViewProviderElement extends LitElement implements ScrollContext {
  static tagName = 'inch-scroll-view-provider' as const;

  @property({ type: Number, attribute: false }) maxHeight?: number;

  private readonly context = new ContextProvider(this, { context: scrollContext })

  protected override firstUpdated() {
    this.context.setValue(this)
  }

  protected override updated() {
    appendStyle(this, {
      maxHeight: this.maxHeight ? `${this.maxHeight}px` : '',
    })
  }

  protected override render() {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-scroll-view-provider': ScrollViewProviderElement
  }
}
