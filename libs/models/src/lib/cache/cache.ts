export interface ICache<Key, Value> {
  set(key: Key, value: Value): void
  get(key: Key): Value | null
  has(key: Key): boolean
  clear(): void
  size(): number
}