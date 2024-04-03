import { Observable } from 'rxjs';
import { ChainId } from '../chain/chain-id';
import { IToken } from '../token/token';

export interface ITokenRateProvider {
  getRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken): Promise<bigint | null>
  listenRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken): Observable<bigint | null>
}

export interface ITokenRateAdapter {
  getRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken): Promise<bigint | null>
  isSupportedChain(chainId: ChainId): boolean
}