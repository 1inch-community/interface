import { ChainId } from '@one-inch-community/models';
import { Chain } from 'viem';
import {
  arbitrum,
  aurora,
  avalanche,
  bsc,
  fantom,
  gnosis,
  klaytn,
  mainnet,
  optimism,
  polygon,
  zkSync
} from 'viem/chains';

const viemChainId: Record<ChainId, Chain> = {
  [ChainId.eth]: mainnet,
  [ChainId.bnb]: bsc,
  [ChainId.matic]: polygon,
  [ChainId.op]: optimism,
  [ChainId.arbitrum]: arbitrum,
  [ChainId.gnosis]: gnosis,
  [ChainId.avalanche]: avalanche,
  [ChainId.fantom]: fantom,
  [ChainId.aurora]: aurora,
  [ChainId.klaytn]: klaytn,
  [ChainId.zkSyncEra]: zkSync,
};

export function getChainById(chainId: ChainId): Chain {
  return viemChainId[chainId];
}