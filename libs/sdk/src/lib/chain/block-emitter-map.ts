import { ChainId } from '@one-inch-community/models';
import { Block } from 'viem';
import { getWSClient } from './chain-client';
import { fromEvent, map, merge, Observable, of, shareReplay, startWith, switchMap } from 'rxjs';

const blockEmitterMap: Record<ChainId, Observable<Block> | null> = {
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
}

function blockListener(chainId: ChainId): Observable<Block> {
  return new Observable<Block>(subscriber => {
    const client = getWSClient(chainId)
    return client.watchBlocks({ onBlock: block => subscriber.next(block) })
  }).pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  )
}

function isWindowVisibleAndFocused(): boolean {
  const isFocused = document.hasFocus();
  const isVisible = document.visibilityState === 'visible';
  return isFocused && isVisible;
}

function isWindowVisibleAndFocused$(): Observable<boolean> {
  let isFirst = true
  return merge(
    fromEvent(window, 'focus'),
    fromEvent(window, 'blur'),
    fromEvent(document, 'visibilitychange')
  ).pipe(
    startWith(null),
    map(() => {
      if (isFirst) {
        isFirst = false
        return true
      }
      return isWindowVisibleAndFocused()
    })
  );
}

export function getBlockEmitter(chainId: ChainId): Observable<Block> {
  if (blockEmitterMap[chainId] === null) {
    blockEmitterMap[chainId] = isWindowVisibleAndFocused$().pipe(
      switchMap(state => {
        if (state) return blockListener(chainId)
        return of()
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    )
  }
  return blockEmitterMap[chainId]!
}
