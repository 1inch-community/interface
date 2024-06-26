import { ChainId } from '@one-inch-community/models';
import { Block } from 'viem';
import { getClient } from './chain-client';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent, interval,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  startWith, Subscription,
  switchMap
} from 'rxjs';
import { averageBlockTime } from './average-block-time';

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

let lastMouseMoveTimestamp: number = Date.now()

document.addEventListener('mousemove', () => lastMouseMoveTimestamp = Date.now())

function smartBlockListener(chainId: ChainId) {
  let subs: Subscription
  let nowSlow = false
  const isSlowLoad = () => {
    return Date.now() - lastMouseMoveTimestamp > (60 * 1000)
  }
  return new Observable<Block>(subscriber => {
    const handler = (block: Block) => {
      subscriber.next(block)
      const isSlowLoadNow = isSlowLoad()
      if (isSlowLoadNow && !nowSlow) {
        nowSlow = true
        subs?.unsubscribe()
        subs = blockSlowListener(chainId).subscribe(handler)
        console.log('slow block loader')
      } else if (!isSlowLoadNow && nowSlow) {
        nowSlow = false
        subs?.unsubscribe()
        subs = blockListener(chainId).subscribe(handler)
        console.log('regular block loader')
      }
    }

    subs = blockListener(chainId).subscribe(handler)

    return () => {
      subs?.unsubscribe()
    }
  })
}

function blockListener(chainId: ChainId): Observable<Block> {
  return new Observable<Block>(subscriber => {
    const client = getClient(chainId)
    return client.watchBlocks({ onBlock: block => subscriber.next(block) })
  }).pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  )
}

function blockSlowListener(chainId: ChainId): Observable<Block> {
  const client = getClient(chainId)
  return interval(30 * 1000).pipe(
    switchMap(() => client.getBlock())
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
    fromEvent(document, 'visibilitychange'),
  ).pipe(
    startWith(null),
    map(() => {
      if (isFirst) {
        isFirst = false
        return true
      }
      return isWindowVisibleAndFocused()
    }),
    distinctUntilChanged()
  );
}

export function getBlockEmitter(chainId: ChainId): Observable<Block> {
  if (blockEmitterMap[chainId] === null) {
    blockEmitterMap[chainId] = isWindowVisibleAndFocused$().pipe(
      switchMap(state => {
        if (state) return smartBlockListener(chainId)
        return of()
      }),
      debounceTime(averageBlockTime[chainId] / 2),
      shareReplay({ bufferSize: 1, refCount: true })
    )
  }
  return blockEmitterMap[chainId]!
}
