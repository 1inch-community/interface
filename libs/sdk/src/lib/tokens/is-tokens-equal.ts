import { IToken } from "@one-inch-community/models";
import { isAddressEqual } from 'viem';

export function isTokensEqual(token1: IToken, token2: IToken): boolean {
  if (!isAddressEqual(token1.address, token2.address)) {
    return false
  }
  if (token1.chainId !== token2.chainId) {
    return false
  }
  return true
}