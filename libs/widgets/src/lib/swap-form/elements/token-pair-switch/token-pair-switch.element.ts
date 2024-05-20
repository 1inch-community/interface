import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { combineLatest, defer, map } from 'rxjs';
import '@one-inch-community/ui-components/icon'
import { asyncTimeout } from '@one-inch-community/ui-components/async';
import { observe, dispatchEvent } from '@one-inch-community/lit';
import { ISwapContext } from '@one-inch-community/models';
import { tokenPairSwitchStyle } from './token-pair-switch.style';
import { swapContext } from '../../context';

@customElement(TokenPairSwitchElement.tagName)
export class TokenPairSwitchElement extends LitElement {
  static tagName = 'inch-token-pair-switch' as const

  static override styles = tokenPairSwitchStyle

  @consume({ context: swapContext, subscribe: true })
  context?: ISwapContext

  private readonly isDisabled$ = defer(() => {
    if (!this.context) throw new Error('')
    return combineLatest([
      this.context.getTokenByType('source'),
      this.context.getTokenByType('destination')
    ])
  }).pipe(
    map(([ sourceToken, destinationToken ]) => !sourceToken || !destinationToken),
  )

  protected override render() {
    return html`
      <button
        @mouseover="${this.up}"
        @mouseleave="${this.down}"
        @click="${this.onClick}"
        ?disabled="${observe(this.isDisabled$, false)}"
        class="switcher"
      >
        <inch-icon class="switcher-icon" icon="arrowDown24"></inch-icon>
      </button>
    `
  }

  protected up() {
    const icon = this.renderRoot.querySelector('inch-icon')
    if (!icon) return
    if (icon.classList.contains('switcher-icon-up')) return;
    icon.classList.remove('switcher-icon-off-transition', 'switcher-icon-down')
    icon.classList.add('switcher-icon-up')
  }

  protected async down() {
    const icon = this.renderRoot.querySelector('inch-icon')
    if (!icon) return
    if (!icon.classList.contains('switcher-icon-up')) return;
    icon.classList.add('switcher-icon-down')
    await asyncTimeout(300)
    icon.classList.add('switcher-icon-off-transition')
    icon.classList.remove('switcher-icon-up', 'switcher-icon-down')
    await asyncTimeout(50)
    icon.classList.remove('switcher-icon-off-transition')
  }

  protected onClick() {
    const icon = this.renderRoot.querySelector('inch-icon')
    if (!icon) return
    if (!icon.classList.contains('switcher-icon-up')) return;
    this.context?.switchPair()
    dispatchEvent(this, 'switchPair', null)
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-token-pair-switch': TokenPairSwitchElement
  }
}
