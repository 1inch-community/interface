import { UniswapV2BaseRateAdapter } from '../base-adapters/uniswap-v2-base-rate-adapter';
import { ChainId } from '@one-inch-community/models';
import { type Address } from 'viem';

const PancakeSwapFactory: Record<number, Address> = {
  [ChainId.eth]: '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362',
  [ChainId.bnb]: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  [ChainId.arbitrum]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
}

export const pancakeswapV2Adapter = new UniswapV2BaseRateAdapter(
  'PancakeSwapV2',
  (chainId) => PancakeSwapFactory[chainId],
  [
    ChainId.eth,
    ChainId.bnb,
    ChainId.arbitrum,
  ]
)