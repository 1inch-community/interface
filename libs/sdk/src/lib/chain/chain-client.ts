import { ChainId } from '@one-inch-community/models';
import { createPublicClient, PublicClient } from 'viem';
import { contextField } from '../utils/context-field';
import { transportMap, transportWSMap } from './transport-map';
import { getChainById } from './viem-chain-map';

const viemClients: Record<ChainId, PublicClient | null> = contextField('__chain_client', () => ({
  [ChainId.eth]: null,
  [ChainId.bnb]: null,
  [ChainId.matic]: null,
  [ChainId.op]: null,
  [ChainId.arbitrum]: null,
  [ChainId.gnosis]: null,
  [ChainId.avalanche]: null,
  [ChainId.fantom]: null,
  [ChainId.aurora]: null,
  [ChainId.klaytn]: null,
  [ChainId.zkSyncEra]: null,
}));

const viemWSClients: Record<ChainId, PublicClient | null> = contextField('__chain_ws_client', () => ({
  [ChainId.eth]: null,
  [ChainId.bnb]: null,
  [ChainId.matic]: null,
  [ChainId.op]: null,
  [ChainId.arbitrum]: null,
  [ChainId.gnosis]: null,
  [ChainId.avalanche]: null,
  [ChainId.fantom]: null,
  [ChainId.aurora]: null,
  [ChainId.klaytn]: null,
  [ChainId.zkSyncEra]: null,
}))

function buildViemDefaultClient(chainId: ChainId) {
  const chain = getChainById(chainId);
  const transport = transportMap[chainId];
  return createPublicClient({
    chain,
    transport,
  });
}

function buildViemWSDefaultClient(chainId: ChainId) {
  const chain = getChainById(chainId);
  const transport = transportWSMap[chainId];
  return createPublicClient({
    chain,
    transport,
  });
}

export function getClient(chainId: ChainId): PublicClient {
  if (!viemClients[chainId]) {
    viemClients[chainId] = buildViemDefaultClient(chainId)
  }
  return viemClients[chainId] as any
}

export function getWSClient(chainId: ChainId): PublicClient {
  if (!viemWSClients[chainId]) {
    viemWSClients[chainId] = buildViemWSDefaultClient(chainId)
  }
  return viemWSClients[chainId] as any
}