import { Address } from 'viem';
import { IToken } from './token';
import { ChainId } from '../chain';
import { IBalancesTokenRecord } from '../database';
import { Observable } from 'rxjs';

export interface ITokenController {
  getSortedByPriorityAndBalanceTokenAddresses(chainId: ChainId, filterPattern: string, walletAddress?: Address): Promise<Address[]>
  getToken(chainId: ChainId, address: Address): Promise<IToken | null>
  getTokenLogoURL(chainId: ChainId, address: Address): Promise<string | null>
  getNativeToken(chainId: ChainId): Promise<IToken | null>
  getTokenBySymbol(chainId: ChainId, symbol: string): Promise<IToken[]>
  getTokenList(chainId: ChainId, addresses: Address[]): Promise<IToken[]>
  getTokenListSortedByPriority(chainId: ChainId, addresses: Address[]): Promise<IToken[]>
  getTokenMap(chainId: ChainId, addresses: Address[]): Promise<Record<Address, IToken>>
  getTokenBalanceMap(chainId: ChainId, walletAddress: Address, addresses: Address[]): Promise<Record<Address, bigint>>
  getTokenBalance(chainId: ChainId, tokenAddress: Address, walletAddress: Address): Promise<IBalancesTokenRecord | null>
  getTokenUSDPrice(chainId: ChainId, tokenAddress: Address): Promise<string>
  getTokenUSDPrices(chainId: ChainId, tokenAddressList: Address[]): Promise<Record<Address, string>>
  getPriorityToken(chainId: ChainId, addresses: Address[]): Promise<IToken>
  setFavoriteState(chainId: ChainId, tokenAddress: Address, state: boolean): Promise<void>
  getAllFavoriteTokenAddresses(chainId: ChainId): Promise<Address[]>
  isSupportedTokenPermit(chainId: ChainId, tokenAddress: Address): Promise<boolean>
  isFavoriteToken(chainId: ChainId, tokenAddress: Address): Promise<boolean>
  updateTokenDatabase(chainId: ChainId): Promise<void>
  updateBalanceDatabase(chainId: ChainId, walletAddress: Address, tokenAddress?: Address): Promise<void>
  liveQuery<T>(querier: () => (T | Promise<T>)): Observable<T>
}
