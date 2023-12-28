import {fallback, http, Transport, webSocket} from "viem";
import {ChainId} from "@1inch/v3/core/wallet";

function buildFallbackTransport(rpcList: string[]) {
    return fallback(rpcList.map(rpc => http(rpc)), {
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

export const transportMap: Record<ChainId, Transport> = {
    [ChainId.ethereumMainnet]: buildFallbackTransport([
        'https://ethereum.publicnode.com',
        'https://rpc.mevblocker.io',
        'https://rpc.builder0x69.io',
        'https://eth.merkle.io',
        'https://ethereum-mainnet-rpc.allthatnode.com', // global
        'https://ethereum-mainnet-archive.allthatnode.com', // archive global
        'https://ethereum-mainnet-rpc-germany.allthatnode.com', // germany
        'https://ethereum-mainnet-archive-germany.allthatnode.com', // archive germany
        'https://ethereum-mainnet-rpc-korea.allthatnode.com', // korea
        'https://ethereum-mainnet-archive-korea.allthatnode.com', // archive korea
    ]),
    [ChainId.binanceMainnet]: buildFallbackTransport([
        'https://bsc.publicnode.com',
        'https://endpoints.omniatech.io/v1/bsc/mainnet/public',
        'https://bsc-pokt.nodies.app',
        'https://bsc.meowrpc.com',
        'https://bsc.drpc.org',
    ]),
    [ChainId.polygonMainnet]: buildFallbackTransport([
        'https://polygon.llamarpc.com',
        'https://endpoints.omniatech.io/v1/matic/mainnet/public',
        'https://endpoints.omniatech.io/v1/matic/mainnet/public',
        'https://polygon-bor.publicnode.com',
        'https://polygon.drpc.org',
        'https://polygon.meowrpc.com',
    ]),
    [ChainId.optimismMainnet]: buildFallbackTransport([
        'https://optimism.publicnode.com',
        'https://op-pokt.nodies.app',
        'https://optimism.meowrpc.com',
        'https://optimism.drpc.org',
        'https://endpoints.omniatech.io/v1/op/mainnet/public',
    ]),
    [ChainId.arbitrumMainnet]: buildFallbackTransport([
        'https://arbitrum-one.publicnode.com',
        'https://arb-pokt.nodies.app',
        'https://arbitrum.meowrpc.com',
        'https://arbitrum.drpc.org',
        'https://endpoints.omniatech.io/v1/arbitrum/one/public',
    ]),
    [ChainId.gnosisMainnet]: buildFallbackTransport([
        'https://gnosis.publicnode.com',
        'https://rpc.gnosischain.com',
        'https://gnosis.drpc.org',
    ]),
    [ChainId.avalancheMainnet]: buildFallbackTransport([
        'https://avalanche-c-chain.publicnode.com',
        'https://1rpc.io/avax/c',
        'https://endpoints.omniatech.io/v1/avax/mainnet/public',
        'https://avax.meowrpc.com',
        'https://avalanche.drpc.org',
    ]),
    [ChainId.fantomMainnet]: buildFallbackTransport([
        'https://fantom.publicnode.com',
        'https://fantom-pokt.nodies.app',
        'https://1rpc.io/ftm',
        'https://fantom.drpc.org',
    ]),
    [ChainId.auroraMainnet]: buildFallbackTransport([
        'https://mainnet.aurora.dev',
        'https://endpoints.omniatech.io/v1/aurora/mainnet/public',
        'https://1rpc.io/aurora',
        'https://aurora.drpc.org',
    ]),
    [ChainId.klaytnMainnet]: buildFallbackTransport([
        'https://klaytn.drpc.org',
        'https://rpc.ankr.com/klaytn',
        'https://klaytn.blockpi.network/v1/rpc/public',
    ]),
    [ChainId.zkSyncEraMainnet]: buildFallbackTransport([
        'https://mainnet.era.zksync.io',
        'https://zksync-era.blockpi.network/v1/rpc/public',
        'https://zksync.meowrpc.com',
        'https://zksync.drpc.org',
    ]),
}

export const transportWSMap: Record<ChainId, Transport> = {
  [ChainId.ethereumMainnet]: buildFallbackWSTransport([
    'wss://ethereum.publicnode.com',
  ]),
  [ChainId.binanceMainnet]: buildFallbackWSTransport([
    'wss://bsc.publicnode.com',
  ]),
  [ChainId.polygonMainnet]: buildFallbackWSTransport([
    'wss://polygon-bor.publicnode.com',
  ]),
  [ChainId.optimismMainnet]: buildFallbackWSTransport([
    'wss://optimism.publicnode.com',
  ]),
  [ChainId.arbitrumMainnet]: buildFallbackWSTransport([
    'wss://arbitrum-one.publicnode.com',
  ]),
  [ChainId.gnosisMainnet]: buildFallbackWSTransport([
    'wss://rpc.gnosischain.com/wss',
    'wss://gnosis.publicnode.com',
  ]),
  [ChainId.avalancheMainnet]: buildFallbackWSTransport([
    'wss://avalanche-c-chain.publicnode.com',
  ]),
  [ChainId.fantomMainnet]: buildFallbackWSTransport([
    'wss://gnosis.publicnode.com',
  ]),
  [ChainId.auroraMainnet]: buildFallbackWSTransport([
    'wss://mainnet.aurora.dev',
  ]),
  [ChainId.klaytnMainnet]: buildFallbackWSTransport([
    'wss://public-en-cypress.klaytn.net/ws',
  ]),
  [ChainId.zkSyncEraMainnet]: buildFallbackWSTransport([
    'wss://mainnet.era.zksync.io/ws'
  ]),
}
