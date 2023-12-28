import {ChainId} from "@1inch/v3/core/wallet";

const Eip1559Chains: Record<ChainId, boolean> = {
  [ChainId.ethereumMainnet]: true,
  [ChainId.binanceMainnet]: false,
  [ChainId.polygonMainnet]: true,
  [ChainId.optimismMainnet]: true,
  [ChainId.arbitrumMainnet]: true,
  [ChainId.gnosisMainnet]: true,
  [ChainId.avalancheMainnet]: true,
  [ChainId.fantomMainnet]: false,
  [ChainId.auroraMainnet]: false,
  [ChainId.klaytnMainnet]: false,
  [ChainId.zkSyncEraMainnet]: false,
}

export function isEip1559Chain(chainId: ChainId): boolean {
  return Eip1559Chains[chainId]
}
