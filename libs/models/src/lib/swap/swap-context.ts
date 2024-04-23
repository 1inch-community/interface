import { type Address } from 'viem';
import { type Observable } from 'rxjs';
import { ChainId } from '../chain/chain-id';
import { IToken } from '../token/token';

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
  getTokenRawAmountByType(type: 'source' | 'destination'): Observable<bigint>
  setTokenAmountByType(type: 'source' | 'destination', value: string, markDirty?: boolean): void
  setTokenAmountByType(type: 'source' | 'destination', value: bigint, markDirty?: boolean): void
  destroy(): void;
}

export type Pair = {
  srcToken: IToken
  dstToken: IToken
}