import { contextField } from '../utils/context-field';
import { ChainId } from '@one-inch-community/models';
import { Block } from 'viem';
import { getWSClient } from './chain-client';
import { Observable, shareReplay } from 'rxjs';

const blockEmitterMap: Record<ChainId, Observable<Block> | null> = contextField('__block_emitter_map', () => ({
  [ChainId.eth]: null,
  [ChainId.bnb]: null,
  [ChainId.matic]: null,
  [ChainId.op]: null,
  [ChainId.arbitrum]: null,
  [ChainId.gnosis]: null,
  [ChainId.avalanche]: null,
  [ChainId.fantom]: null,
  [ChainId.aurora]: null,
  [ChainId.klaytn]: null,
  [ChainId.zkSyncEra]: null,
}))

function blockListener(chainId: ChainId): Observable<Block> {
  return new Observable<Block>(subscriber => {
    const client = getWSClient(chainId)
    return client.watchBlocks({ onBlock: block => subscriber.next(block) })
  }).pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  )
}

export function getBlockEmitter(chainId: ChainId): Observable<Block> {
  if (blockEmitterMap[chainId] === null) {
    blockEmitterMap[chainId] = blockListener(chainId)
  }
  return blockEmitterMap[chainId]!
}