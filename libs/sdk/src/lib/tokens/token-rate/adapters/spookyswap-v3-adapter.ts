import { ChainId } from '@one-inch-community/models';
import { UniswapV3BaseRateAdapter } from '../base-adapters/uniswap-v3-base-rate-adapter';


export const spookyswapV3Adapter = new UniswapV3BaseRateAdapter(
  'SpookySwapV3',
  () => '0x7928a2c48754501f3a8064765ECaE541daE5c3E6',
  [
    ChainId.fantom,
  ],
  [100, 500, 3000, 10000]
)
