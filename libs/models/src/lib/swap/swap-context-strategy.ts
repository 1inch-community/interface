import { ChainId } from '../chain';
import { IToken } from '../token';
import { Rate } from '../token-price';

export interface ISwapContextStrategy {
  getDataSnapshot(): Promise<ISwapContextStrategyDataSnapshot>
}

export interface ISwapContextStrategyDataSnapshot<T = unknown> {
  chainId: ChainId
  sourceToken: IToken
  destinationToken: IToken
  sourceTokenAmount: bigint
  destinationTokenAmount: bigint
  minReceive: bigint
  autoSlippage: number | null
  autoAuctionTime: number | null
  rate: Rate
  rawResponseData: T
}
