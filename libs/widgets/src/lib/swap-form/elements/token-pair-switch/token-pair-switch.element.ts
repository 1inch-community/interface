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

  private isUp = false

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
      const options = {
        duration: 200,
        easing: 'cubic-bezier(.1, .3, .6, 1)'
      }
      subscribe(this, [
        fromEvent(this.buttonRef.value, 'mouseenter').pipe(
          switchMap(async () => {
            if (!this.iconRef.value || this.isUp) return
            await this.iconRef.value.animate([
              { transform: 'rotate(0deg)' },
              { transform: 'rotate(180deg)' },
            ], options).finished
            appendStyle(this.iconRef.value, {
              transform: 'rotate(180deg)'
            })
            this.isUp = true
          })
        ),
        fromEvent(this.buttonRef.value, 'mouseleave').pipe(
          switchMap(async () => {
            if (!this.iconRef.value || !this.isUp) return
            await this.iconRef.value.animate([
              { transform: 'rotate(180deg)' },
              { transform: 'rotate(360deg)' },
            ], options).finished
            appendStyle(this.iconRef.value, {
              transform: ''
            })
            this.isUp = false
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

  protected async onClick() {
    if (!this.iconRef.value || (!this.isUp && !this.mobileMedia.matches)) return
    this.context?.switchPair()
    dispatchEvent(this, 'switchPair', null)
    const options = {
      duration: 200,
      easing: 'cubic-bezier(.1, .3, .6, 1)'
    }
    if (!this.mobileMedia.matches) {
      await this.iconRef.value.animate([
        { transform: 'rotate(180deg)' },
        { transform: 'rotate(360deg)' },
      ], options).finished
      appendStyle(this.iconRef.value, {
        transform: ''
      })
      this.isUp = false
    }

  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-token-pair-switch': TokenPairSwitchElement
  }
}
