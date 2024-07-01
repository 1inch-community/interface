import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { segmentedControlContainerStyle, segmentedControlItemStyle } from './segmented-control.style';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { buildEvent, isRTLCurrentLocale, localeChange$, subscribe } from '@one-inch-community/lit';
import { tap } from 'rxjs';

type SegmentedControlSize = 'm' | 'l'

export interface SegmentedControlItem {
  label: string | number
  value?: string | number
  template?: (item: SegmentedControlItem, isSelect: boolean, caretRef: HTMLElement | null) => TemplateResult
}

@customElement(SegmentedControlElement.tagName)
export class SegmentedControlElement extends LitElement {
  static tagName = 'inch-segmented-control' as const

  static override styles = [
    segmentedControlContainerStyle,
    segmentedControlItemStyle
  ]

  @property({ type: String }) size: SegmentedControlSize = 'm'

  @property({ type: Array, attribute: false }) items: SegmentedControlItem[] = []

  @property({ type: Object, attribute: false }) select?: SegmentedControlItem

  private itemRefList: HTMLElement[] = []
  private caretRef: HTMLElement | null = null

  protected override render() {
    const classes = {
      [`container-${this.size}`]: true,
    }
    return html`
      <div class="container ${classMap(classes)}">
        ${map(this.items || [], (item) => this.getItemView(item))}
        <div class="caret"></div>
      </div>
    `
  }

  protected override async firstUpdated() {
    this.itemRefList = Array.from(this.renderRoot.querySelectorAll<HTMLElement>('div.item'))
    this.caretRef = this.renderRoot.querySelector<HTMLElement>('.caret')
    await this.updateComplete
    this.requestUpdate()
    await new Promise(resolve => setTimeout(resolve, 60))
    this.caretRef?.classList.add('caret-transition')
    this.requestUpdate()
    subscribe(this, [
      localeChange$.pipe(tap(() => this.updated()))
    ])
  }

  protected override updated() {
    if (!this.caretRef) return

    let offset = 0
    let width = 0
    for (const el of this.itemRefList) {
      if (el.classList.contains('select')) {
        width = el.offsetWidth
        break
      }
      offset += el.offsetWidth;
    }
    this.caretRef.style.width = `${width}px`;
    this.caretRef.style.transform = `translateX(${offset * (isRTLCurrentLocale() ? -1 : 1)}px)`;
  }

  protected getItemView(item: SegmentedControlItem) {
    const classes = {
      [`item-${this.size}`]: true,
      select: item.value === this.select?.value,
    }
    let templateRef: TemplateResult = html`${item.label}`
    if (item.template) {
      templateRef = item.template(
        item,
        item.value === this.select?.value,
        this.caretRef
      )
    }
    return html`
      <div @click="${(event: MouseEvent) => this.onSelect(item, event)}" class="item ${classMap(classes)}">
        ${templateRef}
      </div>
    `
  }

  protected onSelect(item: SegmentedControlItem, event: MouseEvent) {
    this.select = item
    this.requestUpdate()
    this.dispatchEvent(buildEvent('change', item.value, event));
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-segmented-control': SegmentedControlElement
  }
}
