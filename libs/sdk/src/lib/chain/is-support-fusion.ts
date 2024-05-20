import { ChainId } from "@one-inch-community/models";

const isSupportFusionList: ChainId[] = [
  ChainId.eth,
  ChainId.bnb,
  ChainId.matic,
  ChainId.arbitrum,
  ChainId.avalanche,
  ChainId.op,
  ChainId.gnosis,
  ChainId.fantom,
]

export function isSupportFusion(chainId: ChainId) {
  return isSupportFusionList.includes(chainId);
}
