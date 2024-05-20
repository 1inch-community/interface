import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@one-inch-community/ui-components/button'
import { consume } from '@lit/context';
import { swapContext } from '../../context';
import { ISwapContext, IToken } from '@one-inch-community/models';
import { combineLatest, defer, firstValueFrom, map, Observable, of, startWith, switchMap } from 'rxjs';
import { observe, dispatchEvent, getMobileMatchMediaAndSubscribe, getMobileMatchMediaEmitter } from '@one-inch-community/lit';
import { Address } from 'viem';
import { TokenController } from '@one-inch-community/sdk';

@customElement(SwapButton.tagName)
export class SwapButton extends LitElement {
  static tagName = 'inch-swap-button' as const

  static override styles = css`
      .on-hover {
          display: none;
      }
      
      @media (hover: hover) {
          .smart-hover:hover .on-hover {
              display: block;
          }
          .smart-hover:hover .off-hover {
              display: none;
          }
      }

  `

  @consume({ context: swapContext, subscribe: true })
  context?: ISwapContext

  private readonly mobileMedia = getMobileMatchMediaAndSubscribe(this)

  private readonly connectedWalletAddress$ = defer(() => this.getConnectedWalletAddress())
  private readonly sourceToken$ = defer(() => this.getSourceToken())
  private readonly destinationToken$ = defer(() => this.getDestinationToken())
  private readonly chainId$ = defer(() => this.getChainId())
  private readonly sourceTokenAmount$ = defer(() => this.getSourceTokenAmount())

  private readonly exceedingMaximumAmount$ = combineLatest([
    this.connectedWalletAddress$,
    this.sourceToken$,
    this.sourceTokenAmount$.pipe(startWith(0n)),
  ]).pipe(
    switchMap(([wallet, sourceToken, amount]) => {
      if (!wallet || !sourceToken || amount === 0n) return of(false)
      return TokenController.getTokenBalance(sourceToken.chainId, sourceToken.address, wallet).then(balance => {
        if (!balance) return false
        return !amount || amount > BigInt(balance.amount)
      })
    })
  )

  private readonly view$: Observable<TemplateResult> = combineLatest([
    this.connectedWalletAddress$,
    this.sourceToken$,
    this.destinationToken$,
    this.exceedingMaximumAmount$,
    this.sourceTokenAmount$.pipe(startWith(0n)),
    this.chainId$,
    getMobileMatchMediaEmitter().pipe(startWith(null))
  ]).pipe(
    map(([walletAddress, srcToken, dstToken, exceedingMaximumAmount, amount]) => this.getSwapButtonView(
      walletAddress,
      srcToken,
      dstToken,
      exceedingMaximumAmount,
      amount
    ))
  )

  protected override render() {
    return html`${observe(this.view$)}`
  }

  private getSwapButtonView(
    walletAddress: Address | null,
    srcToken: IToken | null,
    dstToken: IToken | null,
    exceedingMaximumAmount: boolean,
    amount: bigint | null
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

    if (!amount || amount === 0n) {
      return html`
        <inch-button type="secondary" size="${size}" fullSize disabled>
          Enter amount to swap
        </inch-button>
      `
    }

    if (exceedingMaximumAmount) {
      return html`
        <inch-button class="smart-hover" @click="${() => this.onSetMax()}" type="secondary" size="${size}" fullSize>
          <span class="off-hover">Insufficient ${srcToken.symbol} balance</span>
          <span class="on-hover">Set max ${srcToken.symbol}</span>
        </inch-button>
      `
    }

    return html`
      <inch-button @click="${() => this.onSwap()}" type="primary" size="${size}" fullSize>
        Swap
      </inch-button>
    `
  }

  private async onSetMax() {
    const sourceToken = await firstValueFrom(this.sourceToken$)
    const connectedWalletAddress = await firstValueFrom(this.connectedWalletAddress$)
    if (!sourceToken || !connectedWalletAddress) return
    const balance = await TokenController.getTokenBalance(sourceToken.chainId, sourceToken.address, connectedWalletAddress)
    this.context?.setTokenAmountByType('source', BigInt(balance?.amount ?? 0), true)
  }

  private async onClick() {
    const address = await firstValueFrom(this.connectedWalletAddress$)
    if (!address) {
      dispatchEvent(this, 'connectWallet', null)
      return
    }
  }

  private onSwap() {
    //
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

  private getSourceTokenAmount() {
    if (!this.context) throw new Error('')
    return this.context.getTokenRawAmountByType('source')
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-button': SwapButton
  }
}
