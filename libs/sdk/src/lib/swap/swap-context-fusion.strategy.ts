import {
  IConnectWalletController,
  ISwapContext,
  Rate,
  SwapSettings,
  ISwapContextStrategy,
  ISwapContextStrategyDataSnapshot,
  IOneInchDevPortalAdapter, FusionQuoteReceiveDto,
  SwapSnapshot
} from '@one-inch-community/models';
import { PairHolder } from './pair-holder';
import {
  getOneInchRouterV6ContractAddress, getPermit,
  getWrapperNativeToken,
  isNativeToken,
  preparePermit2ForSwap
} from '@one-inch-community/sdk/chain';
import { BigMath } from '@one-inch-community/core/math';
import { buildFusionSdk } from '@one-inch-community/sdk/api';
import type { OrderParams } from '@1inch/fusion-sdk';
import { Hash } from 'viem';

const RATE_BUMP_DENOMINATOR = 10_000_000n // 100%

export class SwapContextFusionStrategy implements ISwapContextStrategy<FusionQuoteReceiveDto | null> {

  constructor(
    private readonly swapContext: ISwapContext,
    private readonly pairHolder: PairHolder,
    private readonly walletController: IConnectWalletController,
    private readonly settings: SwapSettings,
    private readonly devPortalAdapter: IOneInchDevPortalAdapter
  ) {
  }

  async swap(swapSnapshot: SwapSnapshot<FusionQuoteReceiveDto | null>): Promise<Hash> {
    const {
      chainId,
      sourceToken,
      destinationToken,
      sourceTokenAmount,
      destinationTokenAmount,
      slippage,
      auctionTime,
      rawResponseData
    } = swapSnapshot
    const walletAddress = await this.walletController.data.getActiveAddress()
    if (walletAddress === null) {
      throw new Error('Wallet not connected')
    }
    if (!rawResponseData) {
      throw new Error('')
    }
    const fusionSDK = await buildFusionSdk(chainId, this.walletController)
    const permitData = await getPermit(chainId, sourceToken.address, walletAddress, getOneInchRouterV6ContractAddress(chainId))
    const orderParams: OrderParams = {
      walletAddress,
      fromTokenAddress: sourceToken.address,
      toTokenAddress: destinationToken.address,
      amount: sourceTokenAmount.toString(),
      preset: rawResponseData.recommended_preset as any
    }
    if (permitData) {
      orderParams.permit = await preparePermit2ForSwap(chainId, walletAddress, permitData.signature, permitData.permitSingle)
      orderParams.isPermit2 = true
    }
    const { type: slippageType, value: slippageValue } = slippage
    const { type: auctionTimeType, value: auctionTimeValue } = auctionTime
    if (slippageType !== 'auto' || auctionTimeType !== 'auto') {
      const preset = rawResponseData.presets[rawResponseData.recommended_preset]
      const auctionEndAmount = (slippageType !== 'auto' ?
        destinationTokenAmount - BigMath.calculatePercentage(destinationTokenAmount, slippageValue ?? rawResponseData.autoK) :
        BigInt(preset.auctionEndAmount)) * 2n

      const auctionDuration = auctionTimeType !== 'auto' ? auctionTimeValue ?? preset.auctionDuration : preset.auctionDuration
      const auctionStartAmount = (BigInt(preset.auctionStartAmount) * 2n).toString()

      const getToTokenAmount = (coefficient: number) => {
        let rate = coefficient - preset.gasCost.gasBumpEstimate
        if (rate < 0) rate = 0
        return (auctionEndAmount * (BigInt(rate) + RATE_BUMP_DENOMINATOR)) /
          RATE_BUMP_DENOMINATOR
      }
      const getDelay = (delay: number) => {
        if (auctionTimeType === 'auto') return delay
        return delay * auctionTimeValue! / preset.auctionDuration
      }
      orderParams.customPreset = {
        auctionDuration,
        auctionStartAmount,
        auctionEndAmount: auctionEndAmount.toString(),
        // points: [
        //   ...preset.points.map((point, index) => ({
        //       delay: getDelay(point.delay),
        //       toTokenAmount: getToTokenAmount(point.coefficient).toString()
        //   }))
        // ]
      }
      orderParams.preset = 'custom' as any
    }
    const createOrderResponse = await fusionSDK.createOrder(orderParams)
    const info = await fusionSDK.submitOrder(createOrderResponse.order, createOrderResponse.quoteId)
    return info.orderHash as Hash
  }

  async getDataSnapshot(): Promise<ISwapContextStrategyDataSnapshot> {
    const sourceTokenSnapshot = this.pairHolder.getSnapshot('source');
    const destinationTokenSnapshot = this.pairHolder.getSnapshot('destination');
    let { token: sourceToken } = sourceTokenSnapshot;
    const { amount: sourceTokenAmount } = sourceTokenSnapshot;
    const { token: destinationToken } = destinationTokenSnapshot;
    const chainId = await this.walletController.data.getChainId();
    const activeAddress = await this.walletController.data.getActiveAddress();

    if (
      chainId === null
      || sourceToken === null
      || destinationToken === null
      || sourceTokenAmount === null
      || activeAddress === null
      || sourceTokenAmount === 0n
    ) {
      throw new Error('');
    }

    const balance = await this.swapContext.getMaxAmount();

    if (balance < sourceTokenAmount) {
      throw new Error('');
    }

    if (isNativeToken(sourceToken.address)) {
      sourceToken = getWrapperNativeToken(chainId);
    }

    const fusionQuoteReceive = await this.devPortalAdapter.getFusionQuoteReceive(
      chainId,
      sourceToken.address,
      destinationToken.address,
      sourceTokenAmount,
      activeAddress
    );

    if (fusionQuoteReceive === null) {
      throw new Error('');
    }

    const { toTokenAmount, recommended_preset, presets, autoK } = fusionQuoteReceive;
    const recommendedPreset = presets[recommended_preset];
    const marketPrice = BigInt(toTokenAmount);

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
    };

    const slippageSettings = this.settings.slippage;
    let minReceive = BigInt(recommendedPreset.auctionEndAmount);
    if (slippageSettings.value !== null) {
      const [slippage] = slippageSettings.value;
      const percentAmount = BigMath.calculatePercentage(marketPrice, slippage);
      minReceive = marketPrice - percentAmount;
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
    };
  }

}
