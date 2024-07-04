import { ICache } from "@one-inch-community/models"


/**
 * Represents a queue-based cache implementation.
 *
 * @template Key - The data type of the keys in the cache.
 * @template Value - The data type of the values in the cache.
 */
export class QueueCache<Key, Value> implements ICache<Key, Value> {
  private readonly cache = new Map<Key, Value>()
  private readonly indexes = new Map<number, Key>()
  private lastIndex = 0

  /**
   * Creates a new instance of the QueueCache class.
   *
   * @constructor
   * @param {number} bufferSize - The size of the buffer.
   */
  constructor(private readonly bufferSize: number) {
  }

  /**
   * Add a key-value pair to the cache.
   * If the key already exists in the cache, nothing will be done.
   * If the cache is full, the least recently used item will be removed before adding the new item.
   *
   * @param {Key} key - The key to be added to the cache.
   * @param {Value} value - The value associated with the key to be added to the cache.
   *
   * @return {void}
   */
  set(key: Key, value: Value) {
    if (this.has(key)) {
      return;
    }
    if (this.cache.size >= this.bufferSize) {
      const min = Math.min(...this.indexes.keys())
      const key = this.indexes.get(min) as Key
      this.indexes.delete(min)
      this.cache.delete(key)
      return
    }

    const index = this.lastIndex++
    this.indexes.set(index, key)
    this.cache.set(key, value)
  }

  /**
   * Retrieves the value associated with the given key from the cache.
   *
   * @param {Key} key - The key to retrieve the value for.
   * @returns {Value | null} The value associated with the given key, or null if the key is not found in the cache.
   */
  get(key: Key): Value | null {
    return this.cache.get(key) ?? null
  }

  /**
   * Checks if the cache has the specified key.
   *
   * @param {Key} key - The key to check in the cache.
   * @returns {boolean} Returns true if the cache has the key, otherwise returns false.
   */
  has(key: Key): boolean {
    return this.cache.has(key)
  }

  delete(key: Key) {
    return this.cache.delete(key)
  }

  /**
   * Clears the cache storage.
   *
   * @return {void}
   */
  clear(): void {
    this.cache.clear()
    this.indexes.clear()
    this.lastIndex = 0
  }

  size() {
    return this.cache.size
  }
}
