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
    uniswapV2Adapter,
    // TODO viem tell invalid contract factory address
    sushiswapV2Adapter,
    pancakeswapV2Adapter
  ])
}