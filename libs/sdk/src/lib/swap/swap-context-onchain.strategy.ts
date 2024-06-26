import { IConnectWalletController } from '@one-inch-community/models';
import { ISwapContextStrategy, ISwapContextStrategyDataSnapshot } from './models/swap-context-strategy.interface';
import { PairHolder } from './pair-holder';
import { buildDefaultTokenRageProvider } from '../tokens';
import { BigMath } from '../utils';

export class SwapContextOnChainStrategy implements ISwapContextStrategy {

  constructor(
    private readonly pairHolder: PairHolder,
    private readonly walletController: IConnectWalletController,
    private readonly rateProvider = buildDefaultTokenRageProvider()
  ) {
  }

  async getDataSnapshot(): Promise<ISwapContextStrategyDataSnapshot> {
    const sourceTokenSnapshot = this.pairHolder.getSnapshot('source')
    const destinationTokenSnapshot = this.pairHolder.getSnapshot('destination')
    const { token: sourceToken, amount: sourceTokenAmount } = sourceTokenSnapshot
    const { token: destinationToken } = destinationTokenSnapshot
    const chainId = await this.walletController.data.getChainId()
    const activeAddress = await this.walletController.data.getActiveAddress()

    if (
      chainId === null
      || sourceToken === null
      || destinationToken === null
      || sourceTokenAmount === null
      || activeAddress === null
    ) {
      throw new Error('')
    }

    const rate = await this.rateProvider.getOnChainRate(
      chainId,
      sourceToken,
      destinationToken
    )

    if (rate === null) {
      throw new Error('')
    }

    let destinationTokenAmount: bigint
    if (rate.revertedRate) {
      destinationTokenAmount = BigMath.div(
        sourceTokenAmount,
        rate.revertedRate,
        sourceToken.decimals,
        destinationToken.decimals,
        destinationToken.decimals
      )
    } else {
      destinationTokenAmount = BigMath.mul(
        sourceTokenAmount,
        rate.rate,
        sourceToken.decimals,
        sourceToken.decimals,
        destinationToken.decimals
      )
    }

    return {
      chainId,
      sourceToken,
      destinationToken,
      sourceTokenAmount,
      destinationTokenAmount,
      rate,
      minReceive: destinationTokenAmount,
      autoAuctionTime: null,
      autoSlippage: null,
    }
  }


}
