import { ChainId } from '../chain';
import { IToken } from '../token';
import { Rate } from '../token-price';
import { SwapSnapshot } from './swap-snapshot';
import { Hash } from 'viem';

export interface ISwapContextStrategy<SwapData> {
  getDataSnapshot(): Promise<ISwapContextStrategyDataSnapshot>
  swap(swapSnapshot: SwapSnapshot<SwapData>): Promise<Hash>
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
