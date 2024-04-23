import { ChainId } from "@one-inch-community/models";

export function isChainId(chainId: any): chainId is ChainId {
  return ChainId[chainId] !== undefined
}