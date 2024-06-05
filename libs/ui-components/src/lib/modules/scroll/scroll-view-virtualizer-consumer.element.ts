import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { scrollbarStyle } from '@one-inch-community/ui-components/theme';
import { createRef, ref } from 'lit/directives/ref.js';
import { consume } from '@lit/context';
import { ScrollContext, scrollContext } from './scroll-context';
import '@lit-labs/virtualizer'
import type { LitVirtualizer } from '@lit-labs/virtualizer'
import { appendStyle, mobileMediaCSS, resizeObserver, subscribe } from '@one-inch-community/lit';
import { tap, merge, of, fromEvent } from 'rxjs';
import { mainViewportContext } from './main-viewport-context';

@customElement(ScrollViewVirtualizerConsumerElement.tagName)
export class ScrollViewVirtualizerConsumerElement extends LitElement {
  static tagName = 'inch-scroll-view-virtualizer-consumer';

  static override styles = [
    scrollbarStyle,
    css`
        .scroll-header {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: fit-content;
            z-index: 9;
            overflow: hidden;
            box-sizing: border-box;
            padding-left: 1px;
            padding-right: 1px;
            background-color: var(--color-background-bg-primary);
        }
        
        ${mobileMediaCSS(css`
            .scroll-header {
                background-color: transparent;
                -webkit-backdrop-filter: blur(20px);
                backdrop-filter: blur(20px);
                border-top-left-radius: 24px;
                border-top-right-radius: 24px;
                padding: 0 8px 0 8px;
                transition: background-color .2s;
            }
            
            .scroll-header-background-color-blur {
                background-color: var(--primary-12);
            }
        `)}

    `
  ]

  @property({ type: Array }) items: unknown[] = []
  @property({ type: Object }) keyFunction?: ((item: unknown, index: number) => unknown)
  @property({ type: Object }) renderItem?: ((item: unknown, index: number) => TemplateResult<1>)
  @property({ type: Object }) header?: (() => TemplateResult)

  @consume({ context: scrollContext, subscribe: true })
  private context!: ScrollContext

  @consume({ context: mainViewportContext, subscribe: false })
  private mainViewportContext?: HTMLElement

  private globalOffsetY: number | null = null

  private readonly virtualizerRef = createRef<LitVirtualizer>()
  private readonly headerRef = createRef<HTMLElement>()

  private readonly headerStub = document.createElement('div')

  get virtualizer() {
    if (!this.virtualizerRef.value) throw new Error('')
    return this.virtualizerRef.value
  }

  protected override firstUpdated() {
    if (!this.context || !this.virtualizerRef.value) return
    this.updateView()
    this.updateHeaderSize()
    subscribe(this, [
      merge(
        resizeObserver(this.context),
        resizeObserver(this.virtualizer),
        this.mainViewportContext ? resizeObserver(this.mainViewportContext) : of()
      ).pipe(
        tap(() => this.updateView())
      )
    ], { requestUpdate: false })
    if (this.headerRef.value) {
      subscribe(this, [
        resizeObserver(this.headerRef.value).pipe(
          tap(() => this.updateHeaderSize()),
        ),
        fromEvent(this.virtualizerRef.value, 'scroll').pipe(
          tap(() => this.updateHeaderBackground())
        )
      ], { requestUpdate: false })
    }
  }

  protected override render() {
    this.updateView()
    this.updateHeaderSize()
    return html`
      ${when(this.header, (headerFactory) => html`
        <div ${ref(this.headerRef)} class="scroll-header">
          ${headerFactory()}
        </div>
      `)}
      <lit-virtualizer
        ${ref(this.virtualizerRef)}
        scroller
        .items=${this.getItems()}
        .keyFunction="${this.keyFunction ?? ((_: unknown, index: number) => index)}"
        .renderItem=${(item: unknown, index: number) => this.renderItemInternal(item, index)}
      ></lit-virtualizer>
    `
  }

  private updateView() {
    if (!this.context || !this.virtualizerRef.value) return
    const contextRect = this.getViewPortBoundingClientRect()
    const virtualizerRect = this.virtualizer.getBoundingClientRect()
    this.globalOffsetY = virtualizerRect.top - contextRect.top + 8 * 2
    this.virtualizer.style.minHeight = `${(this.context.maxHeight ?? 0) - this.globalOffsetY}px`
  }

  private getViewPortBoundingClientRect() {
    if (this.mainViewportContext) {
      return this.mainViewportContext.getBoundingClientRect()
    }
    return this.context.getBoundingClientRect()
  }

  private getItems() {
    if (this.header) return [ null, ...this.items ]
    return this.items
  }

  private renderItemInternal(item: unknown, index: number): TemplateResult {
    if (this.header && index === 0) return html`${this.headerStub}`
    return this.renderItem?.(item, index) ?? html``
  }

  private updateHeaderSize() {
    if (this.headerRef.value) {
      const rect = this.headerRef.value.getBoundingClientRect()
      appendStyle(this.headerStub, {
        height: `${rect.height}px`
      })
    }
  }

  private updateHeaderBackground() {
    const top = this.virtualizerRef.value?.scrollTop ?? 0
    if (top > 10 && this.headerRef.value && !this.headerRef.value.classList.contains('scroll-header-background-color-blur')) {
      this.headerRef.value.classList.add('scroll-header-background-color-blur')
    }
    if (top < 10 && this.headerRef.value && this.headerRef.value.classList.contains('scroll-header-background-color-blur')) {
      this.headerRef.value.classList.remove('scroll-header-background-color-blur')
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-scroll-view-virtualizer-consumer': ScrollViewVirtualizerConsumerElement
  }
}
