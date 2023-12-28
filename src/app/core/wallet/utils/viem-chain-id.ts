import { bsc, Chain, mainnet, zkSync, polygon, optimism, arbitrum, gnosis, avalanche, fantom, aurora, klaytn } from 'viem/chains';
import {ChainId} from "../models";

export const viemChainId: Record<ChainId, Chain> = {
    [ChainId.ethereumMainnet]: mainnet,
    [ChainId.binanceMainnet]: bsc,
    [ChainId.polygonMainnet]: polygon,
    [ChainId.optimismMainnet]: optimism,
    [ChainId.arbitrumMainnet]: arbitrum,
    [ChainId.gnosisMainnet]: gnosis,
    [ChainId.avalancheMainnet]: avalanche,
    [ChainId.fantomMainnet]: fantom,
    [ChainId.auroraMainnet]: aurora,
    [ChainId.klaytnMainnet]: klaytn,
    [ChainId.zkSyncEraMainnet]: zkSync,
};

export function getViemChainId(chainId: ChainId): Chain {
    return viemChainId[chainId];
}

