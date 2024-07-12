import { ChainId } from '../chain';
import { IToken } from '../token';
import { Observable } from 'rxjs';
import { Rate } from './rate';

export interface ITokenRateProvider {
  getOnChainRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken): Promise<Rate | null>
  listenOnChainRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken): Observable<Rate | null>
}
