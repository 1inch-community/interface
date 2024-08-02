import type { Address, Hash } from 'viem';
import { ChainId } from '../chain';
import { FusionQuoteReceiveDto, GasPriceDto, ITokenDto } from '../dto';
import { InitializingEntity } from '../base';
import type { OrderStatusResponse } from '@1inch/fusion-sdk';

export type QuoteReceiveCustomPreset = {
  auctionDuration: number
  auctionStartAmount: string
  auctionEndAmount: string
  points: {toTokenAmount: string; delay: number}[]
}

export interface IOneInchDevPortalAdapter extends InitializingEntity {
  getWhiteListedTokens(chainId: ChainId): Promise<ITokenDto[]>
  getGasPrice(chainId: ChainId): Promise<GasPriceDto | null>
  getFusionQuoteReceive(
    chainId: ChainId,
    fromTokenAddress: Address,
    toTokenAddress: Address,
    amount: bigint,
    walletAddress: Address,
    customPreset?: QuoteReceiveCustomPreset,
    enableEstimate?: boolean,
  ): Promise<FusionQuoteReceiveDto | null>
  getTokenPrices(chainId: ChainId): Promise<Record<Address, string>>
  getBalancesByWalletAddress(chainId: ChainId, walletAddress: Address): Promise<Record<Address, string>>
  getFusionOrderStatus(chainId: ChainId, orderHash: Hash): Promise<OrderStatusResponse>
}
