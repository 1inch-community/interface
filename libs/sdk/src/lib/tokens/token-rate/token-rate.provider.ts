import { ChainId, IToken, ITokenRateAdapter, ITokenRateProvider } from '@one-inch-community/models';
import { uniswapV2Adapter } from './adapters/uniswap-v2-adapter';
import { sushiswapV2Adapter } from './adapters/sushiswap-v2-adapter';
import { pancakeswapV2Adapter } from './adapters/pancakeswap-v2-adapter';
import { BigMath } from '../../utils';
import {
  getBlockEmitter,
  getWrapperNativeToken,
  isNativeToken,
} from '../../chain';
import { startWith, switchMap } from 'rxjs';
import { uniswapV3Adapter } from './adapters/uniswap-v3-adapter';
import { pancakeswapV3Adapter } from './adapters/pancakeswap-v3-adapter';
import { sushiswapV3Adapter } from './adapters/sushiswap-v3-adapter';
import { spookyswapV3Adapter } from './adapters/spookyswap-v3-adapter';

export class TokenRateProvider implements ITokenRateProvider {

  constructor(private readonly adapters: ITokenRateAdapter[]) {
  }

  async getRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken): Promise<bigint | null> {
    let _srcToken = sourceToken
    let _dstToken = destinationToken
    if (isNativeToken(sourceToken.address)) {
      const wToken: IToken = getWrapperNativeToken(chainId)
      if (!wToken) return null
      _srcToken = wToken
    }
    if (isNativeToken(destinationToken.address)) {
      const wToken = getWrapperNativeToken(chainId)
      if (!wToken) return null
      _dstToken = wToken
    }
    const sources = this.adapters.filter(source => source.isSupportedChain(chainId))
    const rateList: bigint[] = await Promise.all(sources.map(source => source.getRate(chainId, _srcToken, _dstToken)))
      .then(results => results.filter(v => v !== null) as bigint[])
    if (rateList.length === 0) return null
    return BigMath.avr(rateList, destinationToken.decimals)
  }

  listenRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken) {
    return getBlockEmitter(chainId).pipe(
      startWith(null),
      switchMap(() => this.getRate(chainId, sourceToken, destinationToken))
    )
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
