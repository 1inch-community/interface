import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { fusionSwapInfoStyle } from './fusion-swap-info.style';
import { dispatchEvent } from '@one-inch-community/ui-components/lit'
import '@one-inch-community/ui-components/icon'
import '@one-inch-community/ui-components/button'
import { consume } from '@lit/context';
import { swapContext } from '../../context';
import { ISwapContext } from '@one-inch-community/models';

@customElement(FusionSwapInfoElement.tagName)
export class FusionSwapInfoElement extends LitElement {
  static tagName = 'inch-fusion-swap-info' as const;

  static override styles = fusionSwapInfoStyle

  @state() isOpen: boolean = false

  @consume({ context: swapContext, subscribe: true })
  context?: ISwapContext

  protected override render() {
    const classes = {
      container: true,
      open: this.isOpen
    }
    const iconClasses = {
      icon: true,
      'open-icon': this.isOpen
    }
    const fusionIconClass = {
      'fusion-icon': true,
      'fusion-icon-open': this.isOpen
    }
    return html`
      <div class="${classMap(classes)}" @click="${() => this.isOpen = true}">
        <div>
          
        </div>
        <div class="fusion-info">
          <div class="${classMap(fusionIconClass)}">
            <inch-icon icon="fusion16"></inch-icon>
            <span>Free</span>
          </div>
          <inch-button @click="${(event: MouseEvent) => this.onChangeOpen(event)}" size="l" type="tertiary">
            <inch-icon class="${classMap(iconClasses)}" icon="chevronDown16"></inch-icon>
          </inch-button>
        </div>
      </div>
    `
  }

  private onChangeOpen(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isOpen = !this.isOpen
  }

  private getContext() {
    if (!this.context) throw new Error('')
    return this.context
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-fusion-swap-info': FusionSwapInfoElement;
  }
}