import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { classMap } from 'lit/directives/class-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { combineLatest, defer, filter, firstValueFrom, map, shareReplay, tap } from 'rxjs';
import { Maskito } from '@maskito/core';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import "@one-inch-community/widgets/token-icon"
import "@one-inch-community/ui-components/icon"
import "@one-inch-community/ui-components/button"
import { ISwapContext, IToken } from '@one-inch-community/models';
import { formatNumber } from '@one-inch-community/sdk';
import '../balance'
import '../fiat-balance'
import { inputStyle } from './input.style';
import { swapContext } from '../../context';
import { observe, subscribe, dispatchEvent } from '@one-inch-community/lit';
import { Address, formatUnits, parseUnits } from 'viem';
import { when } from 'lit/directives/when.js';

@customElement(InputElement.tagName)
export class InputElement extends LitElement {
  static tagName = 'inch-swap-form-input'

  static override styles = inputStyle

  @property({ type: Boolean, attribute: true, reflect: true }) disabled = false

  @property({ type: String, attribute: true, reflect: true }) tokenType?: 'source' | 'destination'

  @state() isFocus = false
  @state() connectedAddress: Address | null = null
  @state() setMaxInProgress = true

  @consume({ context: swapContext, subscribe: true })
  context?: ISwapContext

  private token: IToken | null = null

  private readonly token$ = defer(() => this.getTokenEventEmitter()).pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  )
  private readonly chainId$ = defer(() => this.getChainEventEmitter())
  private readonly connectedAddress$ = defer(() => this.getConnectedWalletAddress())
  private readonly amount$ = defer(() => this.getTokenAmountStream())

  private readonly input = document.createElement('input')
  private maskedInput = this.buildMask(6);

  private tokenView$ = this.token$.pipe(
    map(token => {
      if (!token) return this.selectTokenView()
      return this.tokenView(token)
    })
  )

  override connectedCallback() {
    super.connectedCallback();

    this.input.classList.add('amount-input')
    this.input.inputMode = 'decimal'
    this.input.autocomplete = 'off'
    this.input.placeholder = this.tokenType === 'source' ? '0' : ''
    this.input.onfocus = () => this.onFocus()
    this.input.onblur = () => this.onBlur()
    this.input.oninput = ((event: InputEvent) => this.onInput(event)) as any

    const updateMask$ = this.token$.pipe(
      tap(token => {
        if (!token) return
        this.maskedInput.destroy()
        this.maskedInput = this.buildMask(token.decimals)
      })
    )

    const updateInputValue$ = combineLatest([
      this.amount$,
      this.token$
    ]).pipe(
      map(([amount, token]) => {
        if (!amount || !token) return '0'
        return formatUnits(amount, token.decimals)
      }),
      filter((amount, index) => {
        if (index === 0 && amount === '0') return false
        return (amount !== this.input.value);
      }),
      tap(amount => this.input.value = formatNumber(amount, 6))
    )

    subscribe(this, [
      updateMask$,
      updateInputValue$,
      this.token$.pipe(tap(token => this.token = token)),
      this.connectedAddress$.pipe(tap(address => this.connectedAddress = address))
    ], { requestUpdate: false })
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.maskedInput.destroy()
  }

  protected override render() {
    const classes = {
      disabled: this.disabled,
      focus: this.isFocus
    }
    const maxButtonClasses = {
      'set-max-in-progress': this.setMaxInProgress
    }
    this.input.disabled = this.tokenType === 'destination'
    return html`
      <div class="input-container ${classMap(classes)}">
        <div class="flex-container symbol-title-name">
          <div class="input-title">${this.getInputTitle()}</div>
          ${observe(this.tokenView$)}
        </div>
        
        <div class="flex-container balance-amount-fiat">
          <div class="balance-and-max">
            <inch-swap-balance tokenType="${ifDefined(this.tokenType)}"></inch-swap-balance>
            ${when(this.connectedAddress && this.token && this.tokenType === 'source', () => html`
              <inch-button class="${classMap(maxButtonClasses)}" @click="${async () => {
                this.setMaxInProgress = true
                await this.context?.setMaxAmount()
                this.setMaxInProgress = false
              }}" type="secondary" size="xs">MAX</inch-button>
            `)}
          </div>
          ${this.input}
          <inch-fiat-balance tokenType="${ifDefined(this.tokenType)}"></inch-fiat-balance>
        </div>
      </div>
    `
  }

  private selectTokenView() {
    return html`
      <inch-button disabledSlotPointerEvent type="secondary" size="l" @click="${(event: MouseEvent) => dispatchEvent(this, 'openTokenSelector', this.tokenType, event)}">
        <span class="select-token-text">Select token</span>
        <inch-icon icon="chevronDown16"></inch-icon>
      </inch-button>
      <br>
    `
  }

  private onFocus() {
    this.isFocus = true
    dispatchEvent(this, 'focusTokenInput', this.tokenType)
  }

  private onBlur() {
    this.isFocus = false
    dispatchEvent(this, 'blurTokenInput', this.tokenType)
  }

  private tokenView(token: IToken) {
    const { name, symbol, address } = token
    return html`
      <button @click="${(event: MouseEvent) => dispatchEvent(this, 'openTokenSelector', this.tokenType, event)}"
              class="symbol-container">
        <inch-token-icon symbol="${symbol}" address="${address}"
                         chainId="${observe(this.chainId$)}"></inch-token-icon>
        <span class="symbol">${symbol}</span>
        <inch-icon icon="chevronDown16"></inch-icon>
      </button>
      <span class="token-name">${name}</span>
    `
  }

  private getTokenEventEmitter() {
    if (!this.context) throw new Error('')
    if (!this.tokenType) throw new Error('')
    return this.context.getTokenByType(this.tokenType)
  }

  private getTokenAmountStream() {
    if (!this.context) throw new Error('')
    if (!this.tokenType) throw new Error('')
    return this.context.getTokenAmountByType(this.tokenType)
  }

  private getChainEventEmitter() {
    if (!this.context) throw new Error('')
    return this.context.chainId$
  }

  private getConnectedWalletAddress() {
    if (!this.context) throw new Error('')
    return this.context.connectedWalletAddress$
  }

  private getInputTitle() {
    if (this.tokenType === 'source') {
      return 'You pay'
    }
    if (this.tokenType === 'destination') {
      return 'You receive'
    }
    throw new Error(`invalid token type ${this.tokenType} in swap input`)
  }

  private onInput(event: InputEvent) {
    if (!this.tokenType) return
    const target = event.target as HTMLInputElement | null
    const valueString: string = target?.value ?? '';
    const token = this.token
    if (!token) return
    const amount = parseUnits(valueString.replaceAll(' ', ''), token.decimals)
    this.context?.setTokenAmountByType(this.tokenType, amount)
  }

  private buildMask(decimals: number) {
    return new Maskito(this.input, maskitoNumberOptionsGenerator({
      precision: decimals,
      max: 9 * 10 ** 15,
      min: 0,
    }));
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-form-input': InputElement
  }
}
