import { ChainId } from '../chain/chain-id';
import { IToken } from '../token/token';
import { Address } from 'viem';
import { Observable } from 'rxjs';

export interface ISwapContext {
  readonly chainId$: Observable<ChainId>
  readonly connectedWalletAddress$: Observable<Address | null>
  init(): void
  setChainId(chainId: ChainId): void
  setPair(pair: Partial<Pair>): void
  switchPair(): void
  setConnectedWalletAddress(address?: Address): void
  getTokenByType(type: 'source' | 'destination'): Observable<IToken | null>
  getTokenAmountByType(type: 'source' | 'destination'): Observable<bigint>
  setTokenAmountByType(type: 'source' | 'destination', value: string): void
  setTokenAmountByType(type: 'source' | 'destination', value: bigint): void
  destroy(): void;
}

export type Pair = {
  srcToken: IToken
  dstToken: IToken
}