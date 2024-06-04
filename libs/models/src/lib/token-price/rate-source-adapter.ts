import { ChainId } from '../chain';
import { IToken } from '../token/token';
import { Rate } from './rate';

export interface ITokenRateSourceAdapter {
  getRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken): Promise<Rate | null>
  isSupportedChain(chainId: ChainId): boolean
}
