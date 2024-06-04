import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { ScrollContext, scrollContext } from './scroll-context';
import { subscribe, resizeObserver } from '@one-inch-community/lit';
import { merge, tap } from 'rxjs';
import { createRef, ref } from 'lit/directives/ref.js';
import { scrollbarStyle } from '@one-inch-community/ui-components/theme';

@customElement(ScrollViewConsumerElement.tagName)
export class ScrollViewConsumerElement extends LitElement {
  static tagName = 'inch-scroll-view-consumer' as const;

  static override styles = [
    scrollbarStyle,
    css`
        .scroll-container {
            display: block;
            flex-direction: column;
            transition: height .1s;
        }
        .overflow {
            overflow: auto;
            display: block;
            position: relative;
            contain: size layout;
        }
    `
  ]

  @consume({ context: scrollContext, subscribe: true })
  private context!: ScrollContext

  private contentRef = createRef<HTMLElement>()
  private scrollContainerRef = createRef<HTMLElement>()

  get contentHeight() {
    return this.contentRef.value?.clientHeight ?? 0
  }

  get scrollContainer() {
    if (!this.scrollContainerRef.value) throw new Error('')
    return this.scrollContainerRef.value
  }

  private globalOffsetY = 0

  protected override firstUpdated() {
    if (!this.context) throw new Error('inch-scroll-view-consumer must be used inside inch-scroll-view-provider')
    this.globalOffsetY = this.context.clientHeight - this.clientHeight
    subscribe(this, [
      merge(
        resizeObserver(this.context),
        resizeObserver(this.contentRef.value!)
      ).pipe(
        tap(() => this.updateView())
      )
    ])
  }

  protected override render() {
    return html`
      <div class="scroll-container" ${ref(this.scrollContainerRef)}>
        <div ${ref(this.contentRef)}>
          <slot></slot>
        </div>
      </div>
    `
  }

  private updateView() {
    if (this.contentHeight > (this.context.maxHeight ?? 0)) {
      this.scrollContainer.style.height = `${(this.context.maxHeight ?? 0) - this.globalOffsetY}px`;
      !this.scrollContainer.classList.contains('overflow') && this.scrollContainer.classList.add('overflow')
    } else {
      this.scrollContainer.style.height = `${this.contentHeight}px`;
      this.scrollContainer.classList.contains('overflow') && this.scrollContainer.classList.remove('overflow')
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-scroll-view-consumer': ScrollViewConsumerElement
  }
}
