import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { buttonSizeStyle, buttonStyle, buttonTypeStyle } from './button.style';
import { vibrate } from '../lit/dom.utils';

type ButtonSize = 'm' | 'l' | 'xl' | 'xxl'
type ButtonType =
  | 'primary'
  | 'primary-critical'
  | 'primary-warning'
  | 'secondary'
  | 'secondary-critical'
  | 'secondary-warning'
  | 'secondary-gray'
  | 'tertiary'
  | 'tertiary-gray'

@customElement(ButtonElement.tagName)
export class ButtonElement extends LitElement {
  static tagName = 'inch-button' as const

  static override styles = [
    buttonStyle,
    buttonSizeStyle,
    buttonTypeStyle
  ]

  @property({ type: String, attribute: true }) size: ButtonSize = 'xl'

  @property({ type: String, attribute: true }) type: ButtonType = 'primary'

  @property({ type: Boolean, attribute: true }) fullSize = false

  @property({ type: Boolean, attribute: true }) disabled = false

  @property({ type: Boolean, attribute: true }) disabledSlotPointerEvent = false

  @state() isIconButton = false

  protected override render() {
    const classes = {
      [this.size]: true,
      [this.type]: true,
      'only-icon': this.isIconButton,
      'full-size': this.fullSize,
      'active-box-shadow-inset': this.type.includes('secondary')
        && !this.type.includes('gray'),
    }

    return html`
      <button
        class="${classMap(classes)}"
        @click="${() => vibrate()}"
        ?disabled="${this.disabled}"
      ><slot style="${this.disabledSlotPointerEvent ? 'pointer-events: none;' : ''}" @slotchange="${this.handleSlotChange}"></slot></button>
    `
  }

  protected handleSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement | null
    if (!slot) return
    const nodes = slot
      .assignedNodes({flatten: true})
      .filter(node => node.nodeName !== '#text');
    this.isIconButton = nodes.length === 1 && nodes[0].nodeName.toLowerCase() === 'inch-icon'
    this.requestUpdate()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-button': ButtonElement
  }
}