import { ChainId } from '@one-inch-community/models';

// minimum 3s
export const averageBlockTime: Readonly<Record<ChainId, number>> = {
  [ChainId.eth]: 11000,
  [ChainId.bnb]: 3000,
  [ChainId.matic]: 3000,
  [ChainId.op]: 3000,
  [ChainId.arbitrum]: 14000,
  [ChainId.gnosis]: 4500,
  [ChainId.avalanche]: 3000,
  [ChainId.fantom]: 3000,
  [ChainId.aurora]: 3000,
  [ChainId.klaytn]: 3000,
  [ChainId.zkSyncEra]: 3000,
}