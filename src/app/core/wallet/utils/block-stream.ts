import { Observable } from 'rxjs';
import { Block } from 'viem';
import { getViemDefaultClient } from './viem-clients';
import {ChainId} from "../models";

export function blockStream(chainId: ChainId): Observable<Block> {
    const client = getViemDefaultClient(chainId)
    return new Observable(subscriber => {
        let lastBlockNumber: bigint | null = null
        const next = (block: any) => {
            if (lastBlockNumber === block.number) {
                return
            }
            lastBlockNumber = block.number
            subscriber.next(block)
        }

        client.getBlock().then(block => next(block))
        const unwatch = client.watchBlocks(
            { onBlock: block => next(block) }
        )
        return () => unwatch()
    })
}
