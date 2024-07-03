import { IConnectWalletController, ISwapContext, Rate, SwapSettings, ISwapContextStrategy, ISwapContextStrategyDataSnapshot } from '@one-inch-community/models';
import { PairHolder } from './pair-holder';
import { getWrapperNativeToken, isNativeToken } from '@one-inch-community/sdk/chain';
import { OneInchDevPortalAdapter } from '@one-inch-community/core/api';
import { BigMath } from '@one-inch-community/core/math';


export class SwapContextFusionStrategy implements ISwapContextStrategy {

  constructor(
    private readonly swapContext: ISwapContext,
    private readonly pairHolder: PairHolder,
    private readonly walletController: IConnectWalletController,
    private readonly settings: SwapSettings,
    private readonly devPortalAdapter: OneInchDevPortalAdapter,
  ) {
  }

  async getDataSnapshot(): Promise<ISwapContextStrategyDataSnapshot> {
    const sourceTokenSnapshot = this.pairHolder.getSnapshot('source')
    const destinationTokenSnapshot = this.pairHolder.getSnapshot('destination')
    let { token: sourceToken } = sourceTokenSnapshot
    const { amount: sourceTokenAmount } = sourceTokenSnapshot
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

    const balance = await this.swapContext.getMaxAmount()

    if (balance < sourceTokenAmount) {
      throw new Error('')
    }

    if (isNativeToken(sourceToken.address)) {
      sourceToken = getWrapperNativeToken(chainId)
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
    const marketPrice = BigInt(toTokenAmount)

    const rate = BigMath.div(
      marketPrice,
      sourceTokenAmount,
      destinationToken.decimals,
      sourceToken.decimals
    );
    const revertedRate = BigMath.div(
      sourceTokenAmount,
      marketPrice,
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
      const percentAmount = BigMath.calculatePercentage(marketPrice, slippage)
      minReceive = marketPrice - percentAmount
    }

    return {
      chainId,
      sourceToken,
      destinationToken,
      sourceTokenAmount,
      minReceive,
      destinationTokenAmount: marketPrice,
      autoAuctionTime: recommendedPreset.auctionDuration,
      autoSlippage: autoK,
      rate: rateData,
      rawResponseData: fusionQuoteReceive
    }
  }

}
