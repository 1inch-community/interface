import { TokenSnapshot } from '../token';
import { ChainId } from '../chain';

export interface SwapSnapshot {
  chainId: ChainId
  sourceToken: TokenSnapshot
  destinationToken: TokenSnapshot
}
