import { ChainId } from '@one-inch-community/models';
import { UniswapV3BaseRateAdapter } from '../base-adapters/uniswap-v3-base-rate-adapter';
import { Address } from 'viem';

function factoryContractGetter(chainId: ChainId): Address {
  if (chainId === ChainId.bnb) return '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7'
  if (chainId === ChainId.avalanche) return '0x740b1c1de25031C31FF4fC9A62f554A55cdC1baD'
  return '0x1F98431c8aD98523631AE4a59f267346ea31F984'
}

export const uniswapV3Adapter = new UniswapV3BaseRateAdapter(
  'UniswapV3',
  factoryContractGetter,
  [
    ChainId.eth,
    ChainId.bnb,
    ChainId.matic,
    ChainId.op,
    ChainId.arbitrum,
    ChainId.avalanche,
  ],
  [100, 500, 3000, 10000]
)
