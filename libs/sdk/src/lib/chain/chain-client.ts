import { ChainId } from '@one-inch-community/models';
import { createPublicClient, PublicClient } from 'viem';
import { batchConfig, getTransport } from './transport-map';
import { getChainById } from './viem-chain-map';

const viemClients: Record<ChainId, PublicClient | null> = {
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
}

function buildViemDefaultClient(chainId: ChainId) {
  const chain = getChainById(chainId);
  const transport = getTransport(chainId);
  return createPublicClient({
    batch: {
      multicall: batchConfig
    },
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
