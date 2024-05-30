import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { scrollbarStyle } from '@one-inch-community/ui-components/theme';
import { createRef, ref } from 'lit/directives/ref.js';
import { consume } from '@lit/context';
import { ScrollContext, scrollContext } from './scroll-context';
import '@lit-labs/virtualizer'
import type { LitVirtualizer } from '@lit-labs/virtualizer'
import { resizeObserver, subscribe } from '@one-inch-community/lit';
import { tap, merge } from 'rxjs';

@customElement(ScrollViewVirtualizerConsumerElement.tagName)
export class ScrollViewVirtualizerConsumerElement extends LitElement {
  static tagName = 'inch-scroll-view-virtualizer-consumer';

  static override styles = scrollbarStyle

  @property({ type: Array }) items: unknown[] = []
  @property({ type: Object }) keyFunction?: ((item: unknown, index: number) => unknown)
  @property({ type: Object }) renderItem?: ((item: unknown, index: number) => TemplateResult<1>)

  @consume({ context: scrollContext, subscribe: true })
  private context!: ScrollContext

  private globalOffsetY: number | null = null

  private readonly virtualizerRef = createRef<LitVirtualizer>()

  get virtualizer() {
    if (!this.virtualizerRef.value) throw new Error('')
    return this.virtualizerRef.value
  }

  override async connectedCallback() {
    super.connectedCallback();
  }

  protected override firstUpdated() {
    if (!this.context || !this.virtualizerRef.value) return
    this.updateView()
    subscribe(this, [
      merge(
        resizeObserver(this.context),
        resizeObserver(this.virtualizer)
      ).pipe(
        tap(() => this.updateView())
      )
    ], { requestUpdate: false })
  }

  protected override render() {
    this.updateView()
    return html`
      <lit-virtualizer
        ${ref(this.virtualizerRef)}
        scroller
        .items=${this.items}
        .keyFunction="${this.keyFunction ?? ((_: unknown, index: number) => index)}"
        .renderItem=${this.renderItem as any}
      ></lit-virtualizer>
    `
  }

  private updateView() {
    if (!this.context || !this.virtualizerRef.value) return
    const contextRect = this.context.getBoundingClientRect()
    const virtualizerRect = this.virtualizer.getBoundingClientRect()
    this.globalOffsetY = virtualizerRect.top - contextRect.top + 8
    this.virtualizer.style.minHeight = `${(this.context.maxHeight ?? 0) - this.globalOffsetY}px`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-scroll-view-virtualizer-consumer': ScrollViewVirtualizerConsumerElement
  }
}
