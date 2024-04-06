import { ChainId } from "@one-inch-community/models";
import { TimeCache } from './time-cache';
import { averageBlockTime } from '../chain/average-block-time';

export class BlockTimeCache<Key, Value> {

  private readonly timeCacheStorage: Partial<Record<ChainId, TimeCache<Key, Value>>> = {}

  set(chainId: ChainId, key: Key, value: Value) {
    let cache = this.timeCacheStorage[chainId]
    if (!cache) {
      cache = new TimeCache<Key, Value>(averageBlockTime[chainId]);
      this.timeCacheStorage[chainId] = cache;
    }
    cache.set(key, value);
  }

  get(chainId: ChainId, key: Key): Value | null {
    const cache = this.timeCacheStorage[chainId]
    if (!cache) {
      return null
    }
    return cache.get(key)
  }

}