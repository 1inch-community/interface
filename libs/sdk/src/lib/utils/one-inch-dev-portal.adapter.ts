import { ChainId, ITokenDto, FusionQuoteReceiveDto } from '@one-inch-community/models';
import type { Address } from 'viem';
import { getEnvironmentValue } from '../environment';
import { TimeCache } from '../cache';
import { CacheActivePromise } from './decorators';

const tokenPriceCache = new TimeCache<ChainId, Record<Address, string>>(10000)
const fusionQuoteReceiveCache = new TimeCache<string, FusionQuoteReceiveDto | null>(5000)

export class OneInchDevPortalAdapter {

  private readonly host: string = getEnvironmentValue('oneInchDevPortalHost')

  async getWhiteListedTokens(chainId: ChainId): Promise<ITokenDto[]> {
    const response = await fetch(`${this.host}/token/v1.2/${chainId}/token-list`);
    const data: { tokens: ITokenDto[] } = await response.json();
    return data.tokens;
  }

  async getBalancesByWalletAddress(chainId: ChainId, walletAddress: Address): Promise<Record<Address, string>> {
    const response = await fetch(`${this.host}/balance/v1.2/${chainId}/balances/${walletAddress}`);
    return await response.json();
  }


  @CacheActivePromise((_, chainId: ChainId) => chainId.toString())
  async getTokenPrices(chainId: ChainId): Promise<Record<Address, string>> {
    const cacheValue = tokenPriceCache.get(chainId)
    if (cacheValue) {
      return cacheValue
    }
    const queryParams = new URLSearchParams({ currency: 'USD' });
    const response = await fetch(`${this.host}/price/v1.1/${chainId}?${queryParams}`);
    const result = await response.json();
    tokenPriceCache.set(chainId, result)
    return result
  }

  /**
   * doc link https://portal.1inch.dev/documentation/fusion/swagger/quoter?method=get&path=%2Fv1.0%2F1%2Fquote%2Freceive
   * */
  @CacheActivePromise((...args: unknown[]) => args.slice(1).join(':'))
  async getFusionQuoteReceive(
    chainId: ChainId,
    fromTokenAddress: Address,
    toTokenAddress: Address,
    amount: bigint,
    walletAddress: Address,
    enableEstimate = false,
    isLedgerLive = false
  ): Promise<FusionQuoteReceiveDto | null> {
    const id = [
      chainId, fromTokenAddress, toTokenAddress, amount, walletAddress, enableEstimate, isLedgerLive
    ].join(':')

    if (fusionQuoteReceiveCache.has(id)) {
      return fusionQuoteReceiveCache.get(id)
    }

    const queryParams = new URLSearchParams({
      fromTokenAddress,
      toTokenAddress,
      walletAddress,
      amount: amount.toString(),
      enableEstimate: enableEstimate.toString(),
      isLedgerLive: isLedgerLive.toString(),
    });
    const response = await fetch(`${this.host}/fusion/quoter/v1.0/${chainId}/quote/receive?${queryParams}`);
    if (!response.ok) {
      fusionQuoteReceiveCache.set(id, null)
      return null
    }
    const result = await response.json();
    fusionQuoteReceiveCache.set(id, result)
    return result
  }
}
