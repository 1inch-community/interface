import {
  ChainId,
  FusionQuoteReceiveDto,
  GasPriceDto,
  IApplicationContext,
  IOneInchDevPortalAdapter,
  ITokenDto,
  QuoteReceiveCustomPreset
} from '@one-inch-community/models';
import type { Address, Hash } from 'viem';
import { CacheActivePromise } from '@one-inch-community/core/decorators';
import { TimeCache } from '@one-inch-community/core/cache';
import { getEnvironmentValue } from '@one-inch-community/core/environment';
import { buildFusionSdk } from './fusion-sdk';
import { cancelFusionOrder } from '@one-inch-community/sdk/chain';

const tokenPriceCache = new TimeCache<ChainId, Record<Address, string>>(10000)
const fusionQuoteReceiveCache = new TimeCache<string, FusionQuoteReceiveDto | null>(5000)
const gasPriceCache = new TimeCache<ChainId, GasPriceDto>(5000)

export class OneInchDevPortalAdapter implements IOneInchDevPortalAdapter {

  private readonly host: string = getEnvironmentValue('oneInchDevPortalHost')
  private context!: IApplicationContext

  async init(context: IApplicationContext): Promise<void> {
    this.context = context
  }

  @CacheActivePromise()
  async getWhiteListedTokens(chainId: ChainId): Promise<ITokenDto[]> {
    const response = await fetch(`${this.host}/token/v1.2/${chainId}/token-list`);
    const data: { tokens: ITokenDto[] } = await response.json();
    return data.tokens ?? [];
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

  @CacheActivePromise()
  async getFusionOrderStatus(chainId: ChainId, orderHash: Hash) {
    const sdk = await buildFusionSdk(chainId, this.context.connectWalletController)
    return await sdk.getOrderStatus(orderHash)
  }

  @CacheActivePromise()
  async cancelFusionOrder(chainId: ChainId, orderHash: Hash) {
    const status = await this.getFusionOrderStatus(chainId, orderHash)
    const wallet = await this.context.connectWalletController.data.getActiveAddress()
    if (!wallet) throw new Error('')
    const result = await cancelFusionOrder(chainId, wallet, status.order.makerTraits, orderHash)
    return this.context.connectWalletController.writeContract(result.request)
  }
}
