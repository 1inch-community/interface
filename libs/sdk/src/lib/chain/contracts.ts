import { ChainId } from '@one-inch-community/models';
import { Address } from 'viem';
import { requireChainId } from './is-chain-id';

export function getOneInchRouterV6ContractAddress(chainId: ChainId): Address {
  requireChainId(chainId)
  if (chainId === ChainId.zkSyncEra) {
    return '0x6fd4383cb451173d5f9304f041c7bcbf27d561ff'
  }
  return '0x111111125421ca6dc452d289314280a0f8842a65'
}

export function permit2ContractAddress(chainId: ChainId): Address {
  requireChainId(chainId)
  if (chainId === ChainId.zkSyncEra) {
    return '0x0000000000225e31D15943971F47aD3022F714Fa'
  }
  return '0x000000000022D473030F116dDEE9F6B43aC78BA3'
}
