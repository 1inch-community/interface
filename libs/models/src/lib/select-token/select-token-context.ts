import { type Observable } from 'rxjs';
import { type Address } from 'viem';
import { ChainId } from '../chain';
import { IToken } from '../token';

export interface ISelectTokenContext {
  readonly chainId$: Observable<ChainId | null>
  readonly connectedWalletAddress$: Observable<Address | null>
  readonly favoriteTokens$: Observable<Address[]>
  readonly tokenAddressList$: Observable<Address[]>
  readonly changeFavoriteTokenState$: Observable<[ChainId, Address]> // token info
  readonly searchInProgress$: Observable<boolean>
  setFavoriteTokenState(chainId: ChainId, address: Address, state: boolean): Promise<void>
  setSearchToken(state: string): void
  getSearchTokenValue(): string
  onSelectToken(token: IToken): void
}
