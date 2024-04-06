import { UniswapV2BaseRateAdapter } from '../base-adapters/uniswap-v2-base-rate-adapter';
import { ChainId } from '@one-inch-community/models';

export const uniswapV2Adapter = new UniswapV2BaseRateAdapter(
  'UniswapV2',
  () => '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  [
    ChainId.eth,
    ChainId.bnb,
    ChainId.matic,
    ChainId.op,
    ChainId.arbitrum,
    ChainId.avalanche,
  ]
)