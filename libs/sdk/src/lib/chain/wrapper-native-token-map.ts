import { ChainId, IToken } from "@one-inch-community/models";
import { Address, WalletClient } from 'viem';
import { getChainById } from './viem-chain-map';

export const wrapperNativeTokenMap: Readonly<Record<ChainId, Address>> = {
  [ChainId.eth]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [ChainId.bnb]: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  [ChainId.matic]: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  [ChainId.op]: '0x4200000000000000000000000000000000000006',
  [ChainId.arbitrum]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  [ChainId.gnosis]: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
  [ChainId.avalanche]: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
  [ChainId.fantom]: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  [ChainId.aurora]: '0xc9bdeed33cd01541e1eed10f90519d2c06fe3feb',
  [ChainId.klaytn]: '0xe4f05a66ec68b54a58b17c22107b02e0232cc817',
  [ChainId.zkSyncEra]: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
}

export function getWrapperNativeTokenAddress(chainId: ChainId): Address {
  return wrapperNativeTokenMap[chainId]
}

export function getWrapperNativeToken(chainId: ChainId): IToken {
  const chain = getChainById(chainId)
  return {
    chainId,
    symbol: `W${chain.nativeCurrency.symbol}`,
    name: `W${chain.nativeCurrency.symbol}`,
    decimals: chain?.nativeCurrency?.decimals ?? 18,
    address: wrapperNativeTokenMap[chainId],
    isInternalWrapToken: true
  }
}

export function getSymbolFromWrapToken(token: IToken) {
  if (token.isInternalWrapToken) {
    return token.symbol.slice(1)
  }
  return token.symbol
}
