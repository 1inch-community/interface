import { ICache } from '@one-inch-community/models';
import { storage, JsonParser } from '../utils';

/**
 * Implements a long-term cache system using key-value storage mechanism with storage.
 * The cache entries have a specified time-to-live (TTL) in days and are stored
 * using a unique storage key in the storage, allowing data persistence across browser sessions.
 *
 * It is important to remember that checking the validity of the cache over time occurs only
 *  once at the time the constructor is called, and then only the storage is updated without
 *  checking the data on time-to-live
 *
 * @template Key The type of the keys used for the cache entries, which should be compatible with string since storage keys are strings.
 * @template Value The type of the values stored in the cache. Since storage stores data as strings,
 * the values must be serializable to a string format, typically using JSON serialization.
 */
export class LongTimeCache<Key, Value> implements ICache<Key, Value> {

  private readonly cache: Map<Key, Value> = new Map<Key, Value>();

  /**
   * Creates an instance of LongTimeCache.
   * Initializes the cache from the storage if data exists, and sets up the TTL mechanism.
   *
   * @param {string} storageKey The key under which the cache's data and metadata are stored in storage.
   * This key is used to differentiate this cache instance's data from other data in storage.
   * @param {number} ttlDays The time-to-live for the cache data, in days. After this period, the cache is considered expired
   * and its data is removed from storage.
   */
  constructor(private readonly storageKey: string, ttlDays: number) {
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

  /**
   * Stores a value in the cache under the specified key and updates storage accordingly.
   * If the cache already contains a value for this key, it will be overwritten both in the in-memory cache
   * and in storage.
   *
   * Values stored in storage are serialized to a string, typically using JSON serialization.
   *
   * @param {Key} key The key under which the value should be stored. Since storage uses strings as keys,
   * the provided key is converted to a string.
   * @param {Value} value The value to store in the cache. This value is serialized to a string for storage.
   */
  set(key: Key, value: Value): void {
    this.cache.set(key, value)
    storage.set(this.storageKey, Array.from(this.cache.entries()))
  }

  /**
   * Retrieves a value from the cache for the specified key.
   * This does not check if the data for the key has expired.
   *
   * @param {Key} key The key of the value to retrieve.
   * @returns {Value | null} The value associated with the key, or `null` if the key is not found or expired.
   */
  get(key: Key): Value | null {
    return this.cache.get(key) ?? null
  }

  /**
   * Checks if the cache (and implicitly the storage) contains a given key.
   * This does not check if the data for the key has expired; it only checks for existence.
   *
   * @param {Key} key The key to check in the cache.
   * @returns {boolean} `true` if the cache contains the key, otherwise `false`.
   */
  has(key: Key): boolean {
    return this.cache.has(key)
  }

  /**
   * Deletes a value from the cache and storage for the specified key.
   * If the key does not exist in the cache, this method does nothing.
   *
   * @param {Key} key The key of the value to delete.
   */
  delete(key: Key) {
    const state = this.cache.has(key)
    storage.set(this.storageKey, Array.from(this.cache.entries()))
    return state
  }

  /**
   * Clears all data from the cache and removes the associated data from storage.
   * This is useful for scenarios where the cache needs to be completely refreshed or invalidated.
   */
  clear(): void {
    this.cache.clear()
    storage.set(this.storageKey, Array.from(this.cache.entries()))
  }

  /**
   * @returns {number} returns cache size.
   * */
  size(): number {
    return this.cache.size
  }

}