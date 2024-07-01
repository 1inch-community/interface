import { ChainId, IToken, ITokenRateSourceAdapter, ITokenRateProvider, Rate } from '@one-inch-community/models';
import { uniswapV2Adapter } from './adapters/uniswap-v2-adapter';
import { sushiswapV2Adapter } from './adapters/sushiswap-v2-adapter';
import { pancakeswapV2Adapter } from './adapters/pancakeswap-v2-adapter';
import { CacheActivePromise } from '../../utils';
import {
  getBlockEmitter,
  getWrapperNativeToken,
  isNativeToken,
} from '../../chain';
import { startWith, Observable, switchMap } from 'rxjs';
import { uniswapV3Adapter } from './adapters/uniswap-v3-adapter';
import { pancakeswapV3Adapter } from './adapters/pancakeswap-v3-adapter';
import { sushiswapV3Adapter } from './adapters/sushiswap-v3-adapter';
import { spookyswapV3Adapter } from './adapters/spookyswap-v3-adapter';
import { BlockTimeCache } from '../../cache';

export class TokenRateProvider implements ITokenRateProvider {

  private readonly rateCache = new BlockTimeCache<string, Rate[]>();

  constructor(private readonly onChainAdapters: ITokenRateSourceAdapter[]) {
  }

  @CacheActivePromise((_, chainId: ChainId, sourceToken: IToken, destinationToken: IToken) => [chainId, sourceToken.address, destinationToken.address].join(':'))
  async getOnChainRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken): Promise<Rate | null> {
    const rate = await this.getOnChainRawRate(chainId, sourceToken, destinationToken)
    if (rate.length === 0) return null
    const getRateVale = (rate: Rate) => rate.isReverted ? rate.revertedRate : rate.rate
    let maxRate: Rate = rate[0]
    for (const item of rate) {
      if (getRateVale(item) > getRateVale(maxRate)) {
        maxRate = item
      }
    }
    return maxRate
  }

  listenOnChainRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken): Observable<Rate | null> {
    return getBlockEmitter(chainId).pipe(
      startWith(null),
      switchMap(() => this.getOnChainRate(chainId, sourceToken, destinationToken))
    )
  }

  private async getOnChainRawRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken): Promise<Rate[]> {
    let _srcToken = sourceToken
    let _dstToken = destinationToken
    if (isNativeToken(sourceToken.address)) {
      const wToken: IToken = getWrapperNativeToken(chainId)
      if (!wToken) return []
      _srcToken = wToken
    }
    if (isNativeToken(destinationToken.address)) {
      const wToken = getWrapperNativeToken(chainId)
      if (!wToken) return []
      _dstToken = wToken
    }
    const id = [_srcToken.address, _dstToken.address].join(':')
    const cacheRateList = this.rateCache.get(chainId, id)
    if (cacheRateList !== null) {
      return cacheRateList
    }
    const sources = this.onChainAdapters.filter(source => source.isSupportedChain(chainId))
    const rateResultList: (Rate | null)[] = await Promise.all(sources.map(source => source.getRate(chainId, _srcToken, _dstToken)))
    const cleanRateList = rateResultList.filter(rate => rate !== null) as Rate[]
    this.rateCache.set(chainId, id, cleanRateList)
    return cleanRateList
  }

}

export function buildDefaultTokenRageProvider() {
  return new TokenRateProvider([
    // v3
    uniswapV3Adapter,
    pancakeswapV3Adapter,
    sushiswapV3Adapter,
    spookyswapV3Adapter,
    // v2
    uniswapV2Adapter,
    sushiswapV2Adapter,
    pancakeswapV2Adapter
  ])
}
