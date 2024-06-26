import {fallback, http, Transport, webSocket} from "viem";
import { ChainId } from '@one-inch-community/models';

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
      interval: 60_000 * 5,
      sampleCount: rpcList.length,
      timeout: 500,
      weights: {
        latency: 0.4,
        stability: 0.7
      }
    },
    retryCount: 10,
    retryDelay: 30_000
  })
}

function buildFallbackWSTransport(rpcList: string[]) {
  return fallback(rpcList.map(rpc => webSocket(rpc)), {
    rank: {
      interval: 60_000 * 5,
      sampleCount: rpcList.length,
      timeout: 500,
      weights: {
        latency: 0.4,
        stability: 0.7
      }
    },
    retryCount: 3,
    retryDelay: 30_000
  })
}

export const transportMap: Record<ChainId, Transport> = {
  [ChainId.eth]: buildFallbackTransport([
    'https://ethereum-rpc.publicnode.com',
    'https://ethereum.publicnode.com',
    'https://rpc.mevblocker.io',
    'https://eth.merkle.io',
    'https://1rpc.io/eth',
    'https://rpc.flashbots.net',
    'https://eth-pokt.nodies.app',
    'https://eth.meowrpc.com',
    'https://eth.drpc.org',
    'https://eth.llamarpc.com',
    'https://eth-mainnet.public.blastapi.io',
    'https://rpc.ankr.com/eth',
    'https://cloudflare-eth.com',
    'https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79',
    'https://nodes.mewapi.io/rpc/eth',
    'https://endpoints.omniatech.io/v1/eth/mainnet/public',
    'https://ethereum-mainnet-rpc.allthatnode.com', // global
    'https://ethereum-mainnet-archive.allthatnode.com', // archive global
    'https://ethereum-mainnet-rpc-germany.allthatnode.com', // germany
    'https://ethereum-mainnet-archive-germany.allthatnode.com', // archive germany
    // 'https://ethereum-mainnet-rpc-korea.allthatnode.com', // korea
    // 'https://ethereum-mainnet-archive-korea.allthatnode.com', // archive korea
  ]),
  [ChainId.bnb]: buildFallbackTransport([
    'https://bsc.publicnode.com',
    'https://bsc-rpc.publicnode.com',
    'https://endpoints.omniatech.io/v1/bsc/mainnet/public',
    'https://bsc-pokt.nodies.app',
    'https://bsc.meowrpc.com',
    'https://bsc.drpc.org',
    'https://1rpc.io/bnb',
  ]),
  [ChainId.matic]: buildFallbackTransport([
    'https://polygon-bor-rpc.publicnode.com',
    'https://polygon-rpc.com',
    'https://polygon-pokt.nodies.app',
    'https://polygon-heimdall-rpc.publicnode.com:443',
    'https://endpoints.omniatech.io/v1/matic/mainnet/public',
    'https://polygon-bor.publicnode.com',
    'https://polygon.drpc.org',
    'https://polygon.meowrpc.com',
    'https://polygon.llamarpc.com',
  ]),
  [ChainId.op]: buildFallbackTransport([
    'https://optimism-rpc.publicnode.com',
    'https://optimism.llamarpc.com',
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
    'https://gnosis-rpc.publicnode.com',
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
}

export const transportWSMap: Record<ChainId, Transport> = {
  [ChainId.eth]: buildFallbackWSTransport([
    'wss://ethereum-rpc.publicnode.com',
    'wss://ethereum.publicnode.com',
    'wss://eth.drpc.org',
  ]),
  [ChainId.bnb]: buildFallbackWSTransport([
    'wss://bsc.publicnode.com',
    'wss://bsc-rpc.publicnode.com',
  ]),
  [ChainId.matic]: buildFallbackWSTransport([
    'wss://polygon-bor-rpc.publicnode.com',
    'wss://polygon-heimdall-rpc.publicnode.com:443/websocket',
    'wss://polygon-bor.publicnode.com',
    'wss://polygon.drpc.org',
  ]),
  [ChainId.op]: buildFallbackWSTransport([
    'wss://optimism.publicnode.com',
  ]),
  [ChainId.arbitrum]: buildFallbackWSTransport([
    'wss://arbitrum-one.publicnode.com',
  ]),
  [ChainId.gnosis]: buildFallbackWSTransport([
    'wss://rpc.gnosischain.com/wss',
    'wss://gnosis-rpc.publicnode.com',
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
}
