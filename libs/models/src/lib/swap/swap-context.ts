import { type Address } from 'viem';
import { type Observable } from 'rxjs';
import { ChainId } from '../chain';
import { IToken } from '../token';
import { NullableValue } from '../base';
import { Rate } from '../token-price';
import { SwapSnapshot } from './swap-snapshot';
import { SwapSettings } from './swap-settings';

export type SettingsValue = {
  type: 'auto' | 'custom' | 'preset'
  value: number | null
}

export interface ISwapContext {
  readonly rate$: Observable<Rate | null>
  readonly minReceive$: Observable<bigint>
  readonly chainId$: Observable<ChainId | null>
  readonly connectedWalletAddress$: Observable<Address | null>
  readonly slippage$: Observable<SettingsValue>
  readonly auctionTime$: Observable<SettingsValue>
  readonly loading$: Observable<boolean>
  destroy(): void
  setPair(pair: NullableValue<Pair>): void
  switchPair(): void
  getTokenByType(type: 'source' | 'destination'): Observable<IToken | null>
  getTokenAmountByType(type: 'source' | 'destination'): Observable<bigint | null>
  getTokenRawAmountByType(type: 'source' | 'destination'): Observable<bigint | null>
  setTokenAmountByType(type: 'source' | 'destination', value: bigint, markDirty?: boolean): void
  getSettingsController<V extends keyof SwapSettings>(name: V): SwapSettings[V]
  wrapNativeToken(amount: bigint): Promise<void>
  getSnapshot(): Promise<SwapSnapshot>
  getMaxAmount(): Promise<bigint>
  setMaxAmount(): Promise<void>
  getApprove(): Promise<void>
  getPermit(): Promise<void>
}

export type Pair = {
  srcToken: IToken
  dstToken: IToken
}

