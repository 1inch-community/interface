import { ChainId } from "@one-inch-community/models";

export function isChainId(chainId: any): chainId is ChainId {
  return ChainId[chainId] !== undefined
}

export function requireChainId(chainId: any): void | never {
  if (!isChainId(chainId)) throw new Error(`chain ${chainId} not supported`)
}
