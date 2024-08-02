import { Address, BlockTag, Hash } from 'viem';
import { ChainId } from '@one-inch-community/models';
import { getClient } from './chain-client';

export function waitTransaction(
    chain: ChainId,
    hash: Hash,
    blockTag: BlockTag = 'latest',
): Promise<void> {
    const client = getClient(chain)
    return new Promise((resolve) => {
        const handler = async () => {
            try {
                const tx = await client.getTransaction({ hash, blockTag } as any)
                if (tx.blockNumber) {
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
}

export async function waitTransactions(chain: ChainId, hashes: Address[]) {
    return await Promise.all(hashes.map(hash => waitTransaction(chain, hash)))
}
