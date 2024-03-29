import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '@one-inch-community/ui-components/card';
import '@one-inch-community/widgets/swap-form';
import { swapFormStyle } from './swap-form.style';
import { fromEvent } from 'rxjs';
import { subscribe } from '@one-inch-community/ui-components/lit';

@customElement(SwapFormElement.tagName)
export class SwapFormElement extends LitElement {
  static tagName = 'inch-swap-form-container' as const

  static styles = swapFormStyle

  private mobileMedia = matchMedia('(max-width: 450px)')

  connectedCallback() {
    super.connectedCallback();
    subscribe(this, [
      fromEvent(this.mobileMedia, 'change')
    ])
  }

  protected render() {
    const classes = {
      'swap-form-container': true,
      'swap-form-container-mobile': this.mobileMedia.matches
    }
    return html`
      <div class="${classMap(classes)}">
        <inch-card>
          <inch-swap-form
            withoutBackingCard
            chainId="1"
          ></inch-swap-form>
        </inch-card>
      </div>
    `;
  }
}