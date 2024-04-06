import {fallback, http, Transport, webSocket} from "viem";
import { ChainId } from '@one-inch-community/models';
import { contextField } from '../utils/context-field';

export const batchConfig = {
  wait: 50,
  batchSize: 50
}

function buildFallbackTransport(rpcList: string[]) {
  return fallback(rpcList.map(rpc => http(rpc,
    {
      batch: batchConfig
    })),
    {
    rank: {
      interval: 30_000,
      sampleCount: rpcList.length,
      timeout: 500,
      weights: {
        latency: 0.4,
        stability: 0.7
      }
    },
    retryCount: Math.round(rpcList.length / 2),
    retryDelay: 100
  })
}

function buildFallbackWSTransport(rpcList: string[]) {
  return fallback(rpcList.map(rpc => webSocket(rpc)), {
    rank: {
      interval: 10_000,
      sampleCount: rpcList.length,
      timeout: 500,
      weights: {
        latency: 0.4,
        stability: 0.7
      }
    },
    retryCount: Math.round(rpcList.length / 2),
    retryDelay: 100
  })
}

export const transportMap: Record<ChainId, Transport> = contextField('__transport_map', () => ({
  [ChainId.eth]: buildFallbackTransport([
    'https://ethereum.publicnode.com',
    'https://rpc.mevblocker.io',
    'https://eth.merkle.io',
    'https://ethereum-mainnet-rpc.allthatnode.com', // global
    'https://ethereum-mainnet-archive.allthatnode.com', // archive global
    'https://ethereum-mainnet-rpc-germany.allthatnode.com', // germany
    'https://ethereum-mainnet-archive-germany.allthatnode.com', // archive germany
    // 'https://ethereum-mainnet-rpc-korea.allthatnode.com', // korea
    // 'https://ethereum-mainnet-archive-korea.allthatnode.com', // archive korea
  ]),
  [ChainId.bnb]: buildFallbackTransport([
    'https://bsc.publicnode.com',
    'https://endpoints.omniatech.io/v1/bsc/mainnet/public',
    'https://bsc-pokt.nodies.app',
    'https://bsc.meowrpc.com',
    'https://bsc.drpc.org',
  ]),
  [ChainId.matic]: buildFallbackTransport([
    'https://polygon.llamarpc.com',
    'https://endpoints.omniatech.io/v1/matic/mainnet/public',
    'https://endpoints.omniatech.io/v1/matic/mainnet/public',
    'https://polygon-bor.publicnode.com',
    'https://polygon.drpc.org',
    'https://polygon.meowrpc.com',
  ]),
  [ChainId.op]: buildFallbackTransport([
    'https://optimism.publicnode.com',
    'https://op-pokt.nodies.app',
    'https://optimism.meowrpc.com',
    'https://optimism.drpc.org',
    'https://endpoints.omniatech.io/v1/op/mainnet/public',
  ]),
  [ChainId.arbitrum]: buildFallbackTransport([
    'https://arbitrum-one.publicnode.com',
    'https://arb-pokt.nodies.app',
    'https://arbitrum.meowrpc.com',
    'https://arbitrum.drpc.org',
    'https://endpoints.omniatech.io/v1/arbitrum/one/public',
  ]),
  [ChainId.gnosis]: buildFallbackTransport([
    'https://gnosis.publicnode.com',
    'https://rpc.gnosischain.com',
    'https://gnosis.drpc.org',
  ]),
  [ChainId.avalanche]: buildFallbackTransport([
    'https://avalanche-c-chain.publicnode.com',
    'https://1rpc.io/avax/c',
    'https://endpoints.omniatech.io/v1/avax/mainnet/public',
    'https://avax.meowrpc.com',
    'https://avalanche.drpc.org',
  ]),
  [ChainId.fantom]: buildFallbackTransport([
    'https://fantom.publicnode.com',
    'https://fantom-pokt.nodies.app',
    'https://1rpc.io/ftm',
    'https://fantom.drpc.org',
  ]),
  [ChainId.aurora]: buildFallbackTransport([
    'https://mainnet.aurora.dev',
    'https://endpoints.omniatech.io/v1/aurora/mainnet/public',
    'https://1rpc.io/aurora',
    'https://aurora.drpc.org',
  ]),
  [ChainId.klaytn]: buildFallbackTransport([
    'https://klaytn.drpc.org',
    'https://rpc.ankr.com/klaytn',
    'https://klaytn.blockpi.network/v1/rpc/public',
  ]),
  [ChainId.zkSyncEra]: buildFallbackTransport([
    'https://mainnet.era.zksync.io',
    'https://zksync-era.blockpi.network/v1/rpc/public',
    'https://zksync.meowrpc.com',
    'https://zksync.drpc.org',
  ]),
}))

export const transportWSMap: Record<ChainId, Transport> = contextField('__transport_ws_map', () => ({
  [ChainId.eth]: buildFallbackWSTransport([
    'wss://ethereum.publicnode.com',
  ]),
  [ChainId.bnb]: buildFallbackWSTransport([
    'wss://bsc.publicnode.com',
  ]),
  [ChainId.matic]: buildFallbackWSTransport([
    'wss://polygon-bor.publicnode.com',
  ]),
  [ChainId.op]: buildFallbackWSTransport([
    'wss://optimism.publicnode.com',
  ]),
  [ChainId.arbitrum]: buildFallbackWSTransport([
    'wss://arbitrum-one.publicnode.com',
  ]),
  [ChainId.gnosis]: buildFallbackWSTransport([
    'wss://rpc.gnosischain.com/wss',
    'wss://gnosis.publicnode.com',
  ]),
  [ChainId.avalanche]: buildFallbackWSTransport([
    'wss://avalanche-c-chain.publicnode.com',
  ]),
  [ChainId.fantom]: buildFallbackWSTransport([
    'wss://gnosis.publicnode.com',
  ]),
  [ChainId.aurora]: buildFallbackWSTransport([
    'wss://mainnet.aurora.dev',
  ]),
  [ChainId.klaytn]: buildFallbackWSTransport([
    'wss://public-en-cypress.klaytn.net/ws',
  ]),
  [ChainId.zkSyncEra]: buildFallbackWSTransport([
    'wss://mainnet.era.zksync.io/ws'
  ]),
}))