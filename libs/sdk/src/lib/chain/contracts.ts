import { ChainId } from '@one-inch-community/models';
import { Address } from 'viem';
import { requireChainId } from './is-chain-id';

const oneInchRouterV6: Record<ChainId, Address> = {
  [ChainId.eth]: '0x111111125421ca6dc452d289314280a0f8842a65',
  [ChainId.bnb]: '0x111111125421ca6dc452d289314280a0f8842a65',
  [ChainId.matic]: '0x111111125421ca6dc452d289314280a0f8842a65',
  [ChainId.op]: '0x111111125421ca6dc452d289314280a0f8842a65',
  [ChainId.arbitrum]: '0x111111125421ca6dc452d289314280a0f8842a65',
  [ChainId.gnosis]: '0x111111125421ca6dc452d289314280a0f8842a65',
  [ChainId.avalanche]: '0x111111125421ca6dc452d289314280a0f8842a65',
  [ChainId.fantom]: '0x111111125421ca6dc452d289314280a0f8842a65',
  [ChainId.aurora]: '0x111111125421ca6dc452d289314280a0f8842a65',
  [ChainId.klaytn]: '0x111111125421ca6dc452d289314280a0f8842a65',
  [ChainId.zkSyncEra]: '0x6fd4383cb451173d5f9304f041c7bcbf27d561ff'
}

export function getOneInchRouterV6ContractAddress(chainId: ChainId): Address {
  requireChainId(chainId)
  return oneInchRouterV6[chainId]
}
