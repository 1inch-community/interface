import { IEventEmitter } from '../event-emittor/event-emitter';
import { ChainId } from '../chain/chain-id';
import { IToken } from '../token/token';
import { Address } from 'viem';

export interface ISwapContext {
  readonly chainId: IEventEmitter<ChainId>
  readonly sourceToken: IEventEmitter<IToken>
  readonly destinationToken: IEventEmitter<IToken>
  readonly connectedWalletAddress: IEventEmitter<Address>
  init(): Promise<void>
  setChainId(chainId: ChainId): void
  setPair(pair: Partial<Pair>): void
  switchPair(): void
  setConnectedWalletAddress(address?: Address): void
  getTokenByType(type: 'source' | 'destination'): IEventEmitter<IToken>
  destroy(): void;
}

export type Pair = {
  srcToken: IToken
  dstToken: IToken
}