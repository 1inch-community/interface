import { ChainId } from "@one-inch-community/models";

export const layer2Chain: Record<ChainId, boolean> = {
  [ChainId.eth]: false,
  [ChainId.bnb]: false,
  [ChainId.matic]: false,
  [ChainId.op]: true,
  [ChainId.arbitrum]: true,
  [ChainId.gnosis]: false,
  [ChainId.avalanche]: false,
  [ChainId.fantom]: false,
  [ChainId.aurora]: false,
  [ChainId.klaytn]: false,
  [ChainId.zkSyncEra]: true
}

export function isL2Chain(chainId: ChainId): boolean {
  return layer2Chain[chainId]
}