export interface ICache<Key, Value> {
  set(key: Key, value: Value): void
  get(key: Key): Value | null
  has(key: Key): boolean
  delete(key: Key): boolean
  clear(): void
  size(): number
}

export interface ICacheAsync<Key, Value> {
  set(key: Key, value: Value): Promise<void>
  get(key: Key): Promise<Value | null>
  has(key: Key): Promise<boolean>
  delete(key: Key): Promise<boolean>
  clear(): Promise<void>
  size(): Promise<number>
}
