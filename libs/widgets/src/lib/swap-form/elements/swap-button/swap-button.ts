import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@one-inch-community/ui-components/button'
import { consume } from '@lit/context';
import { swapContext } from '../../context';
import { ISwapContext, IToken } from '@one-inch-community/models';
import { combineLatest, defer, firstValueFrom, map, Observable, startWith, tap } from 'rxjs';
import { observe, dispatchEvent, getMobileMatchMediaAndSubscribe, getMobileMatchMediaEmitter } from '@one-inch-community/ui-components/lit';
import { Address } from 'viem';

@customElement(SwapButton.tagName)
export class SwapButton extends LitElement {
  static tagName = 'inch-swap-button' as const

  @consume({ context: swapContext, subscribe: true })
  context?: ISwapContext

  private readonly mobileMedia = getMobileMatchMediaAndSubscribe(this)

  private readonly connectedWalletAddress$ = defer(() => this.getConnectedWalletAddress())
  private readonly sourceToken$ = defer(() => this.getSourceToken())
  private readonly destinationToken$ = defer(() => this.getDestinationToken())
  private readonly chainId$ = defer(() => this.getChainId())

  private readonly buttonType$ = this.connectedWalletAddress$.pipe(
    map(address => address ? 'primary' : 'secondary'),
  )

  private readonly buttonText$ = this.connectedWalletAddress$.pipe(
    map(address => address ? 'Swap' : 'Connect wallet'),
  )

  private readonly view$: Observable<TemplateResult> = combineLatest([
    this.connectedWalletAddress$,
    this.sourceToken$,
    this.destinationToken$,
    this.chainId$,
    getMobileMatchMediaEmitter().pipe(startWith(null))
  ]).pipe(
    map(([walletAddress, srcToken, dstToken]) => this.getSwapButtonView(
      walletAddress,
      srcToken,
      dstToken
    ))
  )

  protected override render() {
    return html`${observe(this.view$)}`
  }

  private getSwapButtonView(
    walletAddress: Address | null,
    srcToken: IToken | null,
    dstToken: IToken | null,
  ): TemplateResult {
    const size = this.mobileMedia.matches ? 'xl' : 'xxl'

    if (!walletAddress) {
      return html`
        <inch-button @click="${() => dispatchEvent(this, 'connectWallet', null)}" type="secondary" size="${size}" fullSize>
          Connect wallet
        </inch-button>
      `
    }

    if (!srcToken) {
      return html`
        <inch-button @click="${(event: MouseEvent) => dispatchEvent(this, 'openTokenSelector', 'source', event)}" type="secondary" size="${size}" fullSize>
          Select source token
        </inch-button>
      `
    }

    if (!dstToken) {
      return html`
        <inch-button @click="${(event: MouseEvent) => dispatchEvent(this, 'openTokenSelector', 'destination', event)}" type="secondary" size="${size}" fullSize>
          Select destination token
        </inch-button>
      `
    }

    return html`
      <inch-button @click="${() => this.onSwap()}" type="primary" size="${size}" fullSize>
        Swap
      </inch-button>
    `
  }

  private async onClick() {
    const address = await firstValueFrom(this.connectedWalletAddress$)
    if (!address) {
      dispatchEvent(this, 'connectWallet', null)
      return
    }
  }

  private onSwap() {

  }

  private getConnectedWalletAddress() {
    if (!this.context) throw new Error('')
    return this.context.connectedWalletAddress$
  }

  private getChainId() {
    if (!this.context) throw new Error('')
    return this.context.chainId$
  }

  private getSourceToken() {
    if (!this.context) throw new Error('')
    return this.context.getTokenByType('source')
  }

  private getDestinationToken() {
    if (!this.context) throw new Error('')
    return this.context.getTokenByType('destination')
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-button': SwapButton
  }
}