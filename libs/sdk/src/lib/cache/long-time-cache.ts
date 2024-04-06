import { ICache } from '@one-inch-community/models';
import { storage, JsonParser } from '../utils';

export class LongTimeCache<Key, Value> implements ICache<Key, Value> {

  private readonly cache: Map<Key, Value> = new Map<Key, Value>();

  constructor(private readonly storageKey: string, private readonly ttlDays: number) {
    let createTime = storage.get(`${storageKey}_create-time`, Number)
    if (createTime === null) {
      createTime = Date.now()
      storage.set(`${storageKey}_create-time`, createTime)
    }
    if ((Date.now() - createTime) < (ttlDays * 8.64e+7)) {
      const data = storage.get<[Key, Value][]>(storageKey, JsonParser)
      this.cache = new Map(data)
    } else {
      storage.remove(storageKey)
      storage.remove(`${storageKey}_create-time`)
    }
  }

  set(key: Key, value: Value): void {
    this.cache.set(key, value)
    storage.set(this.storageKey, Array.from(this.cache.entries()))
  }

  get(key: Key): Value | null {
    return this.cache.get(key) ?? null
  }

  has(key: Key): boolean {
    return this.cache.has(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

}