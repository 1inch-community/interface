import { ChainId, ISwapContext, IToken, Pair } from '@one-inch-community/models';
import { Address } from 'viem';
import { EventEmitter } from '@one-inch-community/utils';

export class SwapContext implements ISwapContext {

  readonly chainId = new EventEmitter<ChainId>()
  readonly sourceToken = new EventEmitter<IToken>()
  readonly destinationToken = new EventEmitter<IToken>()
  readonly connectedWalletAddress = new EventEmitter<Address>()

  async init() {
  }

  destroy() {
  }

  setChainId(chainId: ChainId): void {
    this.chainId.emit(chainId)
  }

  setPair(pair: Partial<Pair>): void {
    pair.srcToken && this.sourceToken.emit(pair.srcToken)
    pair.dstToken && this.destinationToken.emit(pair.dstToken)
  }

  switchPair() {
    const srcToken = this.destinationToken.getValue() ?? undefined
    const dstToken = this.sourceToken.getValue() ?? undefined
    this.setPair({ srcToken, dstToken })
  }

  setConnectedWalletAddress(address?: Address) {
    address && this.connectedWalletAddress.emit(address)
  }

  getTokenByType(type: 'source' | 'destination'): EventEmitter<IToken> {
    if (type === 'source') {
      return this.sourceToken
    }
    if (type === 'destination') {
      return this.destinationToken
    }
    throw new Error(`invalid token type ${type}`)
  }

}