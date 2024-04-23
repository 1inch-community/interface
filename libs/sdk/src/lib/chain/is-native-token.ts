import { Address, isAddressEqual } from 'viem';

export const nativeTokenAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
export function isNativeToken(address: Address) {
  return isAddressEqual(nativeTokenAddress, address)
}