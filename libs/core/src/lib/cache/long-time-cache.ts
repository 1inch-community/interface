import { ICache } from '@one-inch-community/models';
import { storage, JsonParser } from '@one-inch-community/core/storage';

/**
 * Type representing the cached data with a timestamp.
 * @template Value
 */
type LongTimeCacheData<Value> = {
  timestamp: number;
  value: Value;
}

/**
 * Class representing a long-term cache with TTL (Time To Live) functionality.
 * @template Key
 * @template Value
 * @implements {ICache<Key, Value>}
 */
export class LongTimeCache<Key, Value> implements ICache<Key, Value> {

  /** @private @readonly @type {Map<Key, LongTimeCacheData<Value>>} */
  private readonly cache: Map<Key, LongTimeCacheData<Value>> = new Map();

  private get storageKeyAndVersion() {
    return [this.storageKey, 'v2'].join(':')
  }

  /**
   * Creates an instance of LongTimeCache.
   * @param {string} storageKey - The key used to store the cache in localStorage.
   * @param {number} ttlDays - The TTL (Time To Live) for cache items in days.
   */
  constructor(private readonly storageKey: string, private readonly ttlDays: number) {
    const data = storage.get<[Key, LongTimeCacheData<Value>][]>(this.storageKeyAndVersion, JsonParser);
    this.cache = new Map(data);
  }

  /**
   * Sets a value in the cache.
   * @param {Key} key - The key under which the value is stored.
   * @param {Value} value - The value to be cached.
   */
  set(key: Key, value: Value): void {
    this.cache.set(key, { value, timestamp: Date.now() });
    this.updatePersistence();
  }

  /**
   * Gets a value from the cache.
   * @param {Key} key - The key of the value to retrieve.
   * @returns {Value | null} - The cached value, or null if not found or expired.
   */
  get(key: Key): Value | null {
    this.checkCacheData(key);
    return this.cache.get(key)?.value ?? null;
  }

  /**
   * Checks if a key exists in the cache.
   * @param {Key} key - The key to check.
   * @returns {boolean} - True if the key exists and is not expired, otherwise false.
   */
  has(key: Key): boolean {
    this.checkCacheData(key);
    return this.cache.has(key);
  }

  /**
   * Deletes a value from the cache.
   * @param {Key} key - The key of the value to delete.
   * @returns {boolean} - True if the value existed and was deleted, otherwise false.
   */
  delete(key: Key): boolean {
    const state = this.cache.delete(key);
    this.updatePersistence();
    return state;
  }

  /**
   * Clears the cache.
   */
  clear(): void {
    this.cache.clear();
    this.updatePersistence();
  }

  /**
   * Gets the size of the cache.
   * @returns {number} - The number of items in the cache.
   */
  size(): number {
    let isDirty = false;
    this.cache.forEach((_, key) => {
      const state = this.checkCacheData(key, true);
      if (state && !isDirty) {
        isDirty = true;
      }
    });
    if (isDirty) {
      this.updatePersistence();
    }
    return this.cache.size;
  }

  /**
   * Checks if a cached item is expired.
   * @private
   * @param {Key} key - The key of the item to check.
   * @param {boolean} [skipUpdatePersistence=false] - Whether to skip updating persistence.
   * @returns {boolean} - True if the item was expired and deleted, otherwise false.
   */
  private checkCacheData(key: Key, skipUpdatePersistence?: boolean): boolean {
    const data = this.cache.get(key);
    if (!data) return false;
    let isDirty = false;
    if ((Date.now() - data.timestamp) > (this.ttlDays * 8.64e+7)) {
      this.cache.delete(key);
      isDirty = true;
      if (!(skipUpdatePersistence ?? false)) {
        this.updatePersistence();
      }
    }
    return isDirty;
  }

  /**
   * Updates the persistent storage with the current cache state.
   * @private
   */
  private updatePersistence(): void {
    storage.set(this.storageKeyAndVersion, Array.from(this.cache.entries()));
  }
}
