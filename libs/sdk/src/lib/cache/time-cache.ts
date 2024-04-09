import { ICache } from "@one-inch-community/models"

interface TimeCacheRecord<Value> {
  value: Value
  timestamp: number
}

/**
 * A cache implementation with time-based expiration for key-value pairs.
 * @template Key - The type of the cache key.
 * @template Value - The type of the cache value.
 */
export class TimeCache<Key, Value> implements ICache<Key, Value> {
  private readonly cache = new Map<Key, TimeCacheRecord<Value>>()
  private autoCleanTimer?: any

  constructor(private readonly ttlMs: number,
              private autoClean = false) {
    this.enabledAutoClean()
  }

  /**
   * Set a key-value pair in the cache.
   *
   * @param {Key} key - The key of the pair to be set.
   * @param {Value} value - The value of the pair to be set.
   */
  set(key: Key, value: Value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    })
  }

  /**
   * Checks if the cache has a record for the given key and if it is still within the time-to-live (TTL) period.
   * @param {Key} key - The key to check the cache for.
   * @return {boolean} - Returns true if the cache has a record for the key within the TTL period, otherwise false.
   */
  get(key: Key): Value | null {
    const record = this.cache.get(key)
    if (!record) return null
    if (Date.now() - record.timestamp > this.ttlMs) {
      this.cache.delete(key)
      return null
    }
    return record.value
  }

  /**
   * Checks if the cache has a record for the given key and if it is still within the time-to-live (TTL) period.
   * @param {Key} key - The key to check the cache for.
   * @return {boolean} - Returns true if the cache has a record for the key within the TTL period, otherwise false.
   */
  has(key: Key) {
    const record = this.cache.get(key)
    if (!record) return false
    if (Date.now() - record.timestamp > this.ttlMs) {
      this.cache.delete(key)
      return false
    }
    return true
  }

  delete(key: Key) {
    return this.cache.delete(key)
  }


  clear() {
    this.cache.clear()
    if (!this.autoCleanTimer) return
    clearInterval(this.autoCleanTimer)
  }

  /**
  * @deprecated
  * */
  size() {
    return 0
  }

  private enabledAutoClean() {
    if (!this.autoClean) return
    this.autoCleanTimer = setInterval(() => {
      for (const key of [...this.cache.keys()]) {
        this.get(key)
      }
    }, this.ttlMs)
  }

}