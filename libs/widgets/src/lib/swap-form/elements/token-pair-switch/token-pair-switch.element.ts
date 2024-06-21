import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
import { consume } from '@lit/context';
import { combineLatest, defer, fromEvent, map, switchMap, tap } from 'rxjs';
import '@one-inch-community/ui-components/icon'
import { observe, dispatchEvent, subscribe, appendStyle, getMobileMatchMedia } from '@one-inch-community/lit';
import { ISwapContext } from '@one-inch-community/models';
import { tokenPairSwitchStyle } from './token-pair-switch.style';
import { swapContext } from '../../context';

@customElement(TokenPairSwitchElement.tagName)
export class TokenPairSwitchElement extends LitElement {
  static tagName = 'inch-token-pair-switch' as const

  static override styles = tokenPairSwitchStyle

  @consume({ context: swapContext, subscribe: true })
  context?: ISwapContext

  private readonly iconRef = createRef<HTMLElement>()
  private readonly buttonRef = createRef()
  private readonly mobileMedia = getMobileMatchMedia()

  private readonly isDisabled$ = defer(() => {
    if (!this.context) throw new Error('')
    return combineLatest([
      this.context.getTokenByType('source'),
      this.context.getTokenByType('destination')
    ])
  }).pipe(
    map(([ sourceToken, destinationToken ]) => !sourceToken || !destinationToken),
  )

  protected override firstUpdated() {
    if (!this.buttonRef.value) return
    if (!this.mobileMedia.matches) {
      subscribe(this, [
        fromEvent(this.buttonRef.value, 'mouseenter').pipe(
          switchMap(async () => {
            if (!this.iconRef.value) return
            await this.iconRef.value.animate([
              { transform: 'rotate(0deg)' },
              { transform: 'rotate(180deg)' },
            ], { duration: 200 }).finished
            appendStyle(this.iconRef.value, {
              transform: 'rotate(180deg)'
            })
          })
        ),
        fromEvent(this.buttonRef.value, 'mouseleave').pipe(
          switchMap(async () => {
            if (!this.iconRef.value) return
            await this.iconRef.value.animate([
              { transform: 'rotate(180deg)' },
              { transform: 'rotate(360deg)' },
            ], { duration: 200 }).finished
            appendStyle(this.iconRef.value, {
              transform: ''
            })
          })
        ),
      ])
    }
  }

  protected override render() {
    return html`
      <button
        ${ref(this.buttonRef)}
        @click="${() => this.onClick()}"
        ?disabled="${observe(this.isDisabled$, false)}"
        class="switcher"
      >
        <inch-icon ${ref(this.iconRef)} class="switcher-icon" icon="arrowDown24"></inch-icon>
      </button>
    `
  }

  protected onClick() {
    this.context?.switchPair()
    dispatchEvent(this, 'switchPair', null)
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-token-pair-switch': TokenPairSwitchElement
  }
}
