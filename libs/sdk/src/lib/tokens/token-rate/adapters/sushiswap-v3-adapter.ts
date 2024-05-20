import { UniswapV2BaseRateAdapter } from '../base-adapters/uniswap-v2-base-rate-adapter';
import { ChainId } from '@one-inch-community/models';
import { type Address } from 'viem';
import { UniswapV3BaseRateAdapter } from '../base-adapters/uniswap-v3-base-rate-adapter';

const SushiSwapFactory: Record<number, Address> = {
  [ChainId.eth]: '0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F',
  [ChainId.bnb]: '0x126555dd55a39328F69400d6aE4F782Bd4C34ABb',
  [ChainId.matic]: '0x917933899c6a5F8E37F31E19f92CdBFF7e8FF0e2',
  [ChainId.gnosis]: '0xf78031CBCA409F2FB6876BDFDBc1b2df24cF9bEf',
  [ChainId.fantom]: '0x7770978eED668a3ba661d51a773d3a992Fc9DDCB',
  [ChainId.avalanche]: '0x3e603C14aF37EBdaD31709C4f848Fc6aD5BEc715',
  [ChainId.arbitrum]: '0x1af415a1EbA07a4986a52B6f2e7dE7003D82231e',
  [ChainId.op]: '0x9c6522117e2ed1fE5bdb72bb0eD5E3f2bdE7DBe0',
}

export const sushiswapV3Adapter = new UniswapV3BaseRateAdapter(
  'SushiSwapV3',
  (chainId) => SushiSwapFactory[chainId],
  [
    ChainId.eth,
    ChainId.bnb,
    ChainId.op,
    ChainId.matic,
    ChainId.gnosis,
    ChainId.fantom,
    ChainId.arbitrum,
    ChainId.avalanche,
  ],
  [100, 500, 3000, 10000]
)
