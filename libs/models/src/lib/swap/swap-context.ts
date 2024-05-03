import { type Address } from 'viem';
import { type Observable } from 'rxjs';
import { ChainId } from '../chain';
import { IToken } from '../token/token';

export interface ISwapContext {
  readonly rate$: Observable<bigint>
  readonly chainId$: Observable<ChainId | null>
  readonly connectedWalletAddress$: Observable<Address | null>
  destroy(): void
  setPair(pair: Partial<Pair>): void
  switchPair(): void
  getTokenByType(type: 'source' | 'destination'): Observable<IToken | null>
  getTokenAmountByType(type: 'source' | 'destination'): Observable<bigint>
  getTokenRawAmountByType(type: 'source' | 'destination'): Observable<bigint>
  setTokenAmountByType(type: 'source' | 'destination', value: bigint, markDirty?: boolean): void
}

export type Pair = {
  srcToken: IToken
  dstToken: IToken
}