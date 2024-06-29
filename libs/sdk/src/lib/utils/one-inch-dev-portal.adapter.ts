import { ChainId, ITokenDto, FusionQuoteReceiveDto, GasPriceDto } from '@one-inch-community/models';
import type { Address } from 'viem';
import { getEnvironmentValue } from '../environment';
import { TimeCache } from '../cache';
import { CacheActivePromise } from './decorators';

const tokenPriceCache = new TimeCache<ChainId, Record<Address, string>>(10000)
const fusionQuoteReceiveCache = new TimeCache<string, FusionQuoteReceiveDto | null>(5000)
const gasPriceCache = new TimeCache<ChainId, GasPriceDto>(5000)

export type QuoteReceiveCustomPreset = {
  auctionDuration: number
  auctionStartAmount: string
  auctionEndAmount: string
  points: {toTokenAmount: string; delay: number}[]
}

export class OneInchDevPortalAdapter {

  private readonly host: string = getEnvironmentValue('oneInchDevPortalHost')

  @CacheActivePromise()
  async getWhiteListedTokens(chainId: ChainId): Promise<ITokenDto[]> {
    const response = await fetch(`${this.host}/token/v1.2/${chainId}/token-list`);
    const data: { tokens: ITokenDto[] } = await response.json();
    return data.tokens;
  }

  @CacheActivePromise()
  async getBalancesByWalletAddress(chainId: ChainId, walletAddress: Address): Promise<Record<Address, string>> {
    const response = await fetch(`${this.host}/balance/v1.2/${chainId}/balances/${walletAddress}`);
    return await response.json();
  }


  @CacheActivePromise()
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
  @CacheActivePromise()
  async getFusionQuoteReceive(
    chainId: ChainId,
    fromTokenAddress: Address,
    toTokenAddress: Address,
    amount: bigint,
    walletAddress: Address,
    customPreset?: QuoteReceiveCustomPreset,
    enableEstimate = false,
  ): Promise<FusionQuoteReceiveDto | null> {
    const { auctionDuration, auctionEndAmount, auctionStartAmount, points } = customPreset ?? {}
    const id = [
      chainId, fromTokenAddress, toTokenAddress, amount, walletAddress, enableEstimate,
      auctionDuration, auctionEndAmount, auctionStartAmount, points?.join(',')
    ].filter(Boolean).join(':')

    const cacheData = fusionQuoteReceiveCache.get(id)
    if (cacheData) {
      return cacheData
    }

    const queryParams = new URLSearchParams({
      fromTokenAddress,
      toTokenAddress,
      walletAddress,
      amount: amount.toString(),
      enableEstimate: enableEstimate.toString(),
      isLedgerLive: 'false',
    });

    const response = await fetch(`${this.host}/fusion/quoter/v2.0/${chainId}/quote/receive?${queryParams}`, {
      method: !customPreset ? 'GET' : 'POST',
      body: customPreset && JSON.stringify(customPreset)
    });
    if (!response.ok) {
      fusionQuoteReceiveCache.set(id, null)
      return null
    }
    const result = await response.json();
    fusionQuoteReceiveCache.set(id, result)
    return { ...result, chainId }
  }

  /**
   * doc link https://portal.1inch.dev/documentation/gas-price/swagger?method=get&path=%2Fv1.5%2F1
   * */
  @CacheActivePromise()
  async getGasPrice(chainId: ChainId): Promise<GasPriceDto | null> {
    const cacheValue = gasPriceCache.get(chainId)
    if (cacheValue) {
      return cacheValue
    }
    const response = await fetch(`${this.host}/gas-price/v1.5/${chainId}`);
    if (!response.ok) {
      return null
    }
    const result = await response.json();
    gasPriceCache.set(chainId, result)
    return result
  }
}
