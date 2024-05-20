import { ChainId } from '@one-inch-community/models';
import { type Address } from 'viem';
import { UniswapV3BaseRateAdapter } from '../base-adapters/uniswap-v3-base-rate-adapter';

function factoryContractGetter(chainId: ChainId): Address {
  if (chainId === ChainId.zkSyncEra) return '0x1BB72E0CbbEA93c08f535fc7856E0338D7F7a8aB'
  return '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865'
}

export const pancakeswapV3Adapter = new UniswapV3BaseRateAdapter(
  'PancakeSwapV3',
  factoryContractGetter,
  [
    ChainId.eth,
    ChainId.bnb,
    ChainId.arbitrum,
    ChainId.zkSyncEra,
  ],
  [100, 500, 2500, 10000]
)
