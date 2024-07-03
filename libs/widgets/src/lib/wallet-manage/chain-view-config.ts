import { ChainId } from "@one-inch-community/models"
import { isL2Chain } from "@one-inch-community/sdk/chain"
import { isSupportFusion } from "@one-inch-community/sdk/swap"

type ChainViewInfo = {
  name: string
  iconName: string
  priority?: number
}

type ChainViewFull = {
  chainId: ChainId
} & ChainViewInfo

export const chainViewConfig: Record<ChainId, ChainViewInfo> = {
  [ChainId.eth]: { name: 'Ethereum', iconName: 'eth24' },
  [ChainId.arbitrum]: { name: 'Arbitrum', iconName: 'arbitrum24' },
  [ChainId.op]: { name: 'Optimism', iconName: 'op24' },
  [ChainId.zkSyncEra]: { name: 'zkSync Era', iconName: 'zkSyncEra24' },
  [ChainId.bnb]: { name: 'BNB Smart Chain', iconName: 'bnb24', priority: 1 },
  [ChainId.matic]: { name: 'Polygon', iconName: 'matic24', priority: 1 },
  [ChainId.gnosis]: { name: 'Gnosis', iconName: 'gnosis24' },
  [ChainId.avalanche]: { name: 'Avalanche', iconName: 'avalanche24' },
  [ChainId.fantom]: { name: 'Fantom', iconName: 'fantom24' },
  [ChainId.aurora]: { name: 'Aurora', iconName: 'aurora24' },
  [ChainId.klaytn]: { name: 'Klaytn', iconName: 'klaytn24' }
};

export const chainList: ChainViewFull[] = Object.keys(chainViewConfig)
  .filter(chainId => isSupportFusion(+chainId))
  .map((chainId) => ({ ...(chainViewConfig as any)[chainId], chainId: Number(chainId) }))
  .sort((info1: ChainViewFull, info2: ChainViewFull) => {
    if (info1.chainId == ChainId.eth) return -1;
    if (info2.chainId == ChainId.eth) return 1;
    if (isL2Chain(info1.chainId)) return -1;
    if (isL2Chain(info2.chainId)) return 1;


    return (info2.priority ?? 0) - (info1.priority ?? 0);
  });
