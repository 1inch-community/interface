import { IConnectWalletController, Rate, SwapSettings } from '@one-inch-community/models';
import { ISwapContextStrategy, ISwapContextStrategyDataSnapshot } from './models/swap-context-strategy.interface';
import { PairHolder } from './pair-holder';
import { BigMath, type OneInchDevPortalAdapter } from '../utils';
import { TokenController } from '../tokens';


export class SwapContextFusionStrategy implements ISwapContextStrategy {

  constructor(
    private readonly pairHolder: PairHolder,
    private readonly walletController: IConnectWalletController,
    private readonly settings: SwapSettings,
    private readonly devPortalAdapter: OneInchDevPortalAdapter,
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
      || sourceTokenAmount === 0n
    ) {
      throw new Error('')
    }

    const balance = await TokenController.getTokenBalance(chainId, sourceToken.address, activeAddress)

    if (balance === null) {
      throw new Error('')
    }

    if (BigInt(balance.amount) < sourceTokenAmount) {
      throw new Error('')
    }

    const fusionQuoteReceive = await this.devPortalAdapter.getFusionQuoteReceive(
      chainId,
      sourceToken.address,
      destinationToken.address,
      sourceTokenAmount,
      activeAddress
    )

    if (fusionQuoteReceive === null) {
      throw new Error('')
    }

    const { toTokenAmount, recommended_preset, presets, autoK } = fusionQuoteReceive
    const recommendedPreset = presets[recommended_preset]

    const auctionStartAmount = BigInt(recommendedPreset.auctionStartAmount);
    const auctionEndAmount = BigInt(recommendedPreset.auctionEndAmount);
    const averageDestinationTokenAmount = (auctionStartAmount + auctionEndAmount) / 2n;

    const rate = BigMath.div(
      averageDestinationTokenAmount,
      sourceTokenAmount,
      destinationToken.decimals,
      sourceToken.decimals
    );
    const revertedRate = BigMath.div(
      sourceTokenAmount,
      averageDestinationTokenAmount,
      sourceToken.decimals,
      destinationToken.decimals
    );

    const rateData: Rate = {
      chainId,
      rate,
      revertedRate,
      isReverted: false,
      sourceToken: sourceToken,
      destinationToken: destinationToken
    }

    const slippageSettings = this.settings.slippage
    let minReceive = BigInt(recommendedPreset.auctionEndAmount)
    if (slippageSettings.value !== null) {
      const [ slippage ] = slippageSettings.value
      const marketPrice = BigInt(toTokenAmount)
      const percentAmount = BigMath.calculatePercentage(marketPrice, slippage)
      minReceive = marketPrice - percentAmount
    }

    return {
      chainId,
      sourceToken,
      destinationToken,
      sourceTokenAmount,
      minReceive,
      destinationTokenAmount: BigInt(toTokenAmount),
      autoAuctionTime: recommendedPreset.auctionDuration,
      autoSlippage: autoK,
      rate: rateData,
    }
  }

}
