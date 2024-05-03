import { IToken } from "@one-inch-community/models";
import { isAddressEqual } from 'viem';

export function isTokensEqual(token1: IToken, token2: IToken): boolean {
  const isAddressMatching = isAddressEqual(token1.address, token2.address);
  const isChainIdMatching = token1.chainId === token2.chainId;

  return isAddressMatching && isChainIdMatching;
}