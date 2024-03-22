import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { swapContext } from '../../context';
import { ISwapContext } from '@one-inch-community/models';
import { bindEmitter, getBalance, InternalEventEmitter } from '@one-inch-community/utils';
import { formatUnits } from 'viem';

@customElement(BalanceElement.tagName)
export class BalanceElement extends LitElement {
  static tagName = 'inch-swap-balance'

  @property({ type: String, attribute: true, reflect: true }) tokenType?: 'source' | 'destination'

  @consume({ context: swapContext })
  context?: ISwapContext

  private readonly balanceEmitter = new InternalEventEmitter<string>(emitter => {
    if (!this.context) throw new Error('')
    if (!this.tokenType) throw new Error('')
    const tokenEmitter = this.context.getTokenByType(this.tokenType)
    const chainIdEmitter = this.context.chainId
    const walletAddressEmitter = this.context.connectedWalletAddress
    let token = tokenEmitter.getValue()
    let chainId = chainIdEmitter.getValue()
    let walletAddress = walletAddressEmitter.getValue()

    const update = async () => {
      if (!token || !chainId || !walletAddress) return
      console.log('update balance')
      const balance = await getBalance(chainId, walletAddress, token.address)
      const balanceView = formatUnits(balance, token.decimal)
      emitter.emit(balanceView)
    }

    const tokenEmitterIndex = tokenEmitter.on(async newToken => {
      token = newToken
      await update()
    })

    const chainEmitterIndex = chainIdEmitter.on(async newChainId => {
      chainId = newChainId
      await update()
    })

    const walletAddressEmitterIndex = walletAddressEmitter.on( async newAddress => {
      walletAddress = newAddress
      await update()
    })

    update().then()

    return () => {
      tokenEmitter.off(tokenEmitterIndex)
      chainIdEmitter.off(chainEmitterIndex)
      walletAddressEmitter.off(walletAddressEmitterIndex)
    }
  })

  private readonly balance = bindEmitter(this, () => this.balanceEmitter)

  protected override render() {
    return html`
      <span>${this.balance.value}</span>
    `
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-balance': BalanceElement
  }
}