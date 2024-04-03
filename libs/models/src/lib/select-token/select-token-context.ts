import { type Observable } from 'rxjs';
import { type Address } from 'viem';
import { ChainId } from '../chain/chain-id';

export interface ISelectTokenContext {
  readonly chainId$: Observable<ChainId>
  readonly connectedWalletAddress$: Observable<Address | null>
  readonly tokenAddressList$: Observable<Address[]>
  setChainId(chainId: ChainId): void
  setConnectedWalletAddress(address?: Address): void
}