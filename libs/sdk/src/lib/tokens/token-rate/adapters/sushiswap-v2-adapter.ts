import { UniswapV2BaseRateAdapter } from '../base-adapters/uniswap-v2-base-rate-adapter';
import { ChainId } from '@one-inch-community/models';
import { type Address } from 'viem';

const SushiSwapFactory: Record<number, Address> = {
  [ChainId.eth]: '0xC0AeE478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
  [ChainId.bnb]: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
  [ChainId.matic]: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
  [ChainId.gnosis]: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
  [ChainId.fantom]: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
  [ChainId.avalanche]: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
  [ChainId.arbitrum]: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
}

export const sushiswapV2Adapter = new UniswapV2BaseRateAdapter(
  'SushiSwapV2',
  (chainId) => SushiSwapFactory[chainId],
  [
    ChainId.eth,
    ChainId.bnb,
    ChainId.matic,
    ChainId.gnosis,
    ChainId.fantom,
    ChainId.arbitrum,
    ChainId.avalanche,
  ]
)