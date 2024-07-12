import { fallback, http, webSocket } from 'viem';
import { ChainId } from '@one-inch-community/models';
import { getEnvironmentValue } from '@one-inch-community/core/environment';
import { viemCustomHttpTransport } from './viem-custom-http-transport';

export const batchConfig = {
  wait: 50,
  batchSize: 50
};

export function getTransport(chainId: ChainId) {
  const httpTransports = transportMap[chainId];
  const wsTransports = transportWSMap[chainId];

  const transport = [
    ...wsTransports.map(rpc => webSocket(rpc, {
      reconnect: {
        attempts: 5,
        delay: 5_000
      }
    })),
    ...httpTransports.map(rpc => http(rpc, {
      batch: batchConfig
    }))
  ]

  const infuraRpc = getInfuraRpc(chainId)
  if (infuraRpc) {
    transport.push(viemCustomHttpTransport(infuraRpc, {
      batch: batchConfig,
      key: 'infura',
    }))
  }

  return fallback(transport, {
    retryCount: 10,
    retryDelay: 30_000,
    rank: {
      interval: 60_000 * 5,
      sampleCount: (httpTransports.length + wsTransports.length),
      timeout: 500,
      weights: {
        latency: 0.4,
        stability: 0.7
      }
    }
  });
}

function getInfuraRpc(chainId: ChainId): string | null {
  const apiKey = getEnvironmentValue('infuraApiKey')
  const endpoint = infuraEndpoints[chainId]
  if (!apiKey || endpoint === '') return null;
  return `${endpoint}${apiKey}`
}

const infuraEndpoints: Record<ChainId, string> = {
  [ChainId.eth]: 'https://mainnet.infura.io/v3/',
  [ChainId.bnb]: '',
  [ChainId.matic]: 'https://polygon-mainnet.infura.io/v3/',
  [ChainId.op]: 'https://optimism-mainnet.infura.io/v3/',
  [ChainId.arbitrum]: 'https://arbitrum-mainnet.infura.io/v3/',
  [ChainId.gnosis]: '',
  [ChainId.avalanche]: 'https://avalanche-mainnet.infura.io/v3/',
  [ChainId.fantom]: '',
  [ChainId.aurora]: '',
  [ChainId.klaytn]: '',
  [ChainId.zkSyncEra]: ''
}

const transportMap: Record<ChainId, string[]> = {
  [ChainId.eth]: [
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
    'https://ethereum-mainnet-rpc-korea.allthatnode.com', // korea
    'https://ethereum-mainnet-archive-korea.allthatnode.com', // archive korea
  ],
  [ChainId.bnb]: [
    'https://bsc.publicnode.com',
    'https://bsc-rpc.publicnode.com',
    'https://endpoints.omniatech.io/v1/bsc/mainnet/public',
    'https://bsc-pokt.nodies.app',
    'https://bsc.meowrpc.com',
    'https://bsc.drpc.org',
    'https://1rpc.io/bnb'
  ],
  [ChainId.matic]: [
    'https://polygon-bor-rpc.publicnode.com',
    'https://polygon-rpc.com',
    'https://polygon-pokt.nodies.app',
    'https://polygon-heimdall-rpc.publicnode.com:443',
    'https://endpoints.omniatech.io/v1/matic/mainnet/public',
    'https://polygon-bor.publicnode.com',
    'https://polygon.drpc.org',
    'https://polygon.meowrpc.com',
    'https://polygon.llamarpc.com'
  ],
  [ChainId.op]: [
    'https://optimism-rpc.publicnode.com',
    'https://optimism.llamarpc.com',
    'https://optimism.publicnode.com',
    'https://op-pokt.nodies.app',
    'https://optimism.meowrpc.com',
    'https://optimism.drpc.org',
    'https://endpoints.omniatech.io/v1/op/mainnet/public'
  ],
  [ChainId.arbitrum]: [
    'https://arbitrum-one.publicnode.com',
    'https://arb-pokt.nodies.app',
    'https://arbitrum.meowrpc.com',
    'https://arbitrum.drpc.org',
    'https://endpoints.omniatech.io/v1/arbitrum/one/public'
  ],
  [ChainId.gnosis]: [
    'https://gnosis.publicnode.com',
    'https://gnosis-rpc.publicnode.com',
    'https://rpc.gnosischain.com',
    'https://gnosis.drpc.org'
  ],
  [ChainId.avalanche]: [
    'https://avalanche-c-chain.publicnode.com',
    'https://1rpc.io/avax/c',
    'https://endpoints.omniatech.io/v1/avax/mainnet/public',
    'https://avax.meowrpc.com',
    'https://avalanche.drpc.org'
  ],
  [ChainId.fantom]: [
    'https://fantom.publicnode.com',
    'https://fantom-pokt.nodies.app',
    'https://1rpc.io/ftm',
    'https://fantom.drpc.org'
  ],
  [ChainId.aurora]: [
    'https://mainnet.aurora.dev',
    'https://endpoints.omniatech.io/v1/aurora/mainnet/public',
    'https://1rpc.io/aurora',
    'https://aurora.drpc.org'
  ],
  [ChainId.klaytn]: [
    'https://klaytn.drpc.org',
    'https://rpc.ankr.com/klaytn',
    'https://klaytn.blockpi.network/v1/rpc/public'
  ],
  [ChainId.zkSyncEra]: [
    'https://mainnet.era.zksync.io',
    'https://zksync-era.blockpi.network/v1/rpc/public',
    'https://zksync.meowrpc.com',
    'https://zksync.drpc.org'
  ]
};

const transportWSMap: Record<ChainId, string[]> = {
  [ChainId.eth]: [
    'wss://ethereum-rpc.publicnode.com',
    'wss://ethereum.publicnode.com',
    'wss://eth.drpc.org'
  ],
  [ChainId.bnb]: [
    'wss://bsc.publicnode.com',
    'wss://bsc-rpc.publicnode.com'
  ],
  [ChainId.matic]: [
    'wss://polygon.drpc.org',
    'wss://polygon-bor-rpc.publicnode.com',
    'wss://polygon-bor.publicnode.com',
    'wss://polygon-heimdall-rpc.publicnode.com:443/websocket'
  ],
  [ChainId.op]: [
    'wss://optimism.publicnode.com'
  ],
  [ChainId.arbitrum]: [
    'wss://arbitrum-one.publicnode.com'
  ],
  [ChainId.gnosis]: [
    'wss://rpc.gnosischain.com/wss',
    'wss://gnosis-rpc.publicnode.com',
    'wss://gnosis.publicnode.com'
  ],
  [ChainId.avalanche]: [
    'wss://avalanche-c-chain.publicnode.com'
  ],
  [ChainId.fantom]: [
    'wss://gnosis.publicnode.com'
  ],
  [ChainId.aurora]: [
    'wss://mainnet.aurora.dev'
  ],
  [ChainId.klaytn]: [
    'wss://public-en-cypress.klaytn.net/ws'
  ],
  [ChainId.zkSyncEra]: [
    'wss://mainnet.era.zksync.io/ws'
  ]
};
