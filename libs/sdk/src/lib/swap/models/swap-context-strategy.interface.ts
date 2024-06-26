import { ChainId, IToken, Rate } from "@one-inch-community/models"

export interface ISwapContextStrategy {
  getDataSnapshot(): Promise<ISwapContextStrategyDataSnapshot>
}

export interface ISwapContextStrategyDataSnapshot {
  chainId: ChainId
  sourceToken: IToken
  destinationToken: IToken
  sourceTokenAmount: bigint
  destinationTokenAmount: bigint
  minReceive: bigint
  autoSlippage: number | null
  autoAuctionTime: number | null
  rate: Rate
}
