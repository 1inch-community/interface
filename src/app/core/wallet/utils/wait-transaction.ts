import { Address, Hash, BlockTag } from 'viem';
import { getViemDefaultClient } from './viem-clients';
import {buildEtherscanTxLink} from "./scan-link";
import {ChainId} from "@1inch/v3/core/wallet";

const BlockTagList: BlockTag[] = [
    'latest',
    'earliest',
    'pending',
    'safe',
    'finalized'
]

const pendingMap = new Map<string, Promise<void>>()

export function waitTransaction(
    hash: Hash,
    chain: ChainId,
    blockTag: BlockTag,
    name?: string
): Promise<void>
export function waitTransaction(
    hash: Hash,
    chain: ChainId,
    name?: string
): Promise<void>
export function waitTransaction(
    hash: Hash,
    chain: ChainId,
    blockTagOrName: string | BlockTag = 'finalized',
    name?: string
): Promise<void> {
    const id = [chain, hash].join(':').toLowerCase()
    const pendingFromMap = pendingMap.get(id)
    if (pendingFromMap) {
      return pendingFromMap
    }
    const blockTag: BlockTag = BlockTagList.includes(blockTagOrName as any) ? blockTagOrName as BlockTag : 'finalized'
    const nameTransaction = BlockTagList.includes(blockTagOrName as any) ? name : blockTagOrName
    console.log('start wait transaction', buildEtherscanTxLink(chain, hash), nameTransaction ?? '')
    const client = getViemDefaultClient(chain)
    const pending = new Promise<void>((resolve) => {
        const handler = async () => {
            try {
                const tx = await client.getTransaction({ hash, blockTag } as any)
                if (tx.blockNumber) {
                    pendingMap.delete(id)
                    unwatch()
                    resolve()
                }
            } catch { /* empty */ }
        }
        const unwatch = client.watchBlocks(
            { onBlock: handler },
        )
        handler().catch()
    })
    pendingMap.set(id, pending)
    return pending
}

export async function waitTransactions(hashes: Address[], chain: ChainId, name?: string) {
    if (name) {
        console.group('start wait transactions', name)
    }
    const results = await Promise.all(hashes.map(hash => waitTransaction(hash, chain)))
    if (name) {
        console.groupEnd()
    }
    return results
}
