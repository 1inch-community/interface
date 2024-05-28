import { ChainId } from '../chain';
import { IToken } from '../token/token';
import { Observable } from 'rxjs';

export interface ITokenRateProvider {
  getOnChainRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken): Promise<bigint | null>
  getOnChainRevertedRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken): Promise<bigint | null>
  listenOnChainRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken): Observable<bigint | null>
  listenOnChainRevertedRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken): Observable<bigint | null>
}
