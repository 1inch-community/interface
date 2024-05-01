import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { fusionSwapInfoStyle } from './fusion-swap-info.style';
import { dispatchEvent } from '@one-inch-community/ui-components/lit'
import '@one-inch-community/ui-components/icon'
import '@one-inch-community/ui-components/button'

@customElement(FusionSwapInfoElement.tagName)
export class FusionSwapInfoElement extends LitElement {
  static tagName = 'inch-fusion-swap-info' as const;

  static override styles = fusionSwapInfoStyle

  @state() isOpen: boolean = false

  protected override render() {
    const classes = {
      container: true,
      open: this.isOpen
    }
    return html`
      <div class="${classMap(classes)}">
        <div>
          
        </div>
        <div>
          <inch-button @click="${() => this.onChangeOpen()}" size="l" type="tertiary">
            <inch-icon icon="chevronDown16"></inch-icon>
          </inch-button>
        </div>
      </div>
    `
  }

  private onChangeOpen() {
    this.isOpen = !this.isOpen
    dispatchEvent(this, 'updateSwapFormViewSize', null)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-fusion-swap-info': FusionSwapInfoElement;
  }
}