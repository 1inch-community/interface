import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { buttonSizeStyle, buttonStyle, buttonTypeStyle } from './button.style';
import { iconTagName } from '../icon/icon-tag-name';

type ButtonSize = 'sm' | 'xl' | 'xxl'
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
  static tagName = 'inch-button'

  static override styles = [
    buttonStyle,
    buttonSizeStyle,
    buttonTypeStyle
  ]

  @property({ type: String }) size: ButtonSize = 'xl'

  @property({ type: String }) type: ButtonType = 'primary'

  @property({ type: Boolean, attribute: true }) disabled = false

  @state() isIconButton = false

  protected override render() {
    const classes = {
      [this.size]: true,
      [this.type]: true,
      'only-icon': this.isIconButton,
      'active-box-shadow-inset': this.type.includes('secondary')
        && !this.type.includes('gray'),
    }
    return html`
      <button
        class="${classMap(classes)}"
        ?disabled="${this.disabled}"
      ><slot @slotchange="${this.handleSlotChange}"></slot></button>
    `
  }

  protected handleSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement | null
    if (!slot) return
    const nodes = slot
      .assignedNodes({flatten: true})
      .filter(node => node.nodeName !== '#text');
    this.isIconButton = nodes.length === 1 && nodes[0].nodeName.toLowerCase() === iconTagName
    this.requestUpdate()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-button': ButtonElement
  }
}