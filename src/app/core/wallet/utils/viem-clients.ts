import {createPublicClient, HttpTransport, PublicClient} from 'viem';
import {getViemChainId} from './viem-chain-id';
import {ChainId} from "../models";
import {transportMap, transportWSMap} from "./viem-rpc-transport";

const viemClients: Record<ChainId, PublicClient | null> = {
    [ChainId.ethereumMainnet]: null,
    [ChainId.binanceMainnet]: null,
    [ChainId.polygonMainnet]: null,
    [ChainId.optimismMainnet]: null,
    [ChainId.arbitrumMainnet]: null,
    [ChainId.gnosisMainnet]: null,
    [ChainId.avalancheMainnet]: null,
    [ChainId.fantomMainnet]: null,
    [ChainId.auroraMainnet]: null,
    [ChainId.klaytnMainnet]: null,
    [ChainId.zkSyncEraMainnet]: null,
};

const viemWSClients: Record<ChainId, PublicClient | null> = {
  [ChainId.ethereumMainnet]: null,
  [ChainId.binanceMainnet]: null,
  [ChainId.polygonMainnet]: null,
  [ChainId.optimismMainnet]: null,
  [ChainId.arbitrumMainnet]: null,
  [ChainId.gnosisMainnet]: null,
  [ChainId.avalancheMainnet]: null,
  [ChainId.fantomMainnet]: null,
  [ChainId.auroraMainnet]: null,
  [ChainId.klaytnMainnet]: null,
  [ChainId.zkSyncEraMainnet]: null,
};

function buildViemDefaultClient(chainId: ChainId) {
    const chain = getViemChainId(chainId);
    const transport = transportMap[chainId];
    return createPublicClient({
        chain,
        transport,
    });
}

function buildViemWSDefaultClient(chainId: ChainId) {
  const chain = getViemChainId(chainId);
  const transport = transportWSMap[chainId];
  return createPublicClient({
    chain,
    transport,
  });
}


export function getViemDefaultClient<C extends ChainId>(chainId: C): PublicClient<HttpTransport> {
    if (!viemClients[chainId]) {
        viemClients[chainId] = buildViemDefaultClient(chainId)
    }
    return viemClients[chainId] as any;
}

export function getViemWSDefaultClient<C extends ChainId>(chainId: C): PublicClient<HttpTransport> {
  if (!viemWSClients[chainId]) {
    viemWSClients[chainId] = buildViemWSDefaultClient(chainId)
  }
  return viemWSClients[chainId] as any;
}
