import type { ICacheAsync } from '@one-inch-community/models';
import type { Table } from 'dexie';

type LongTimeCacheData<Key, Value> = {
  key: Key;
  timestamp: number;
  value: Value;
}

const version = 1

async function getDexie<Key, Value>(storageKey: string): Promise<Table<LongTimeCacheData<Key, Value>, Key>> {
  const Dexie = await import('dexie').then(m => m.Dexie)
  const db = new Dexie('one-inch-long-time-async-cache_' + storageKey)
  db.version(version).stores({
    cache: [
      'key',
      'value',
      'timestamp',
    ].join(', '),
  });
  return Reflect.get(db, 'cache')
}

export class LongTimeAsyncCache<Value, Key extends string = string> implements ICacheAsync<Key, Value> {

  private storage?: Table<LongTimeCacheData<Key, Value>, Key>

  constructor(private readonly storageKey: string, private readonly ttlDays: number) {
  }

  async set(key: Key, value: Value): Promise<void> {
    const db = await this.getDexie(this.storageKey)
    await db.put({ key: key.toLowerCase() as Key, value, timestamp: Date.now() })
    this.cleanOldRecords().catch(console.error)
  }

  async get(key: Key): Promise<Value | null> {
    const _key = key.toLowerCase()
    const db = await this.getDexie(this.storageKey)
    const result = await db
      .filter(item => (Date.now() - item.timestamp) < (this.ttlDays * 8.64e+7) && item.key === _key)
      .first()
    this.cleanOldRecords().catch(console.error)
    return result?.value ?? null
  }

  async getAll() {
    const db = await this.getDexie(this.storageKey)
    const result = await db
      .filter(item => (Date.now() - item.timestamp) < (this.ttlDays * 8.64e+7))
      .toArray()
    this.cleanOldRecords().catch(console.error)
    return result.map(record => record.value)
  }

  async has(key: Key): Promise<boolean> {
    const result = await this.get(key)
    return result !== null
  }

  async delete(key: Key): Promise<boolean> {
    try {
      const db = await this.getDexie(this.storageKey)
      await db.delete(key)
      this.cleanOldRecords().catch(console.error)
      return true
    } catch {
      return false
    }
  }

  async clear(): Promise<void> {
    const db = await this.getDexie(this.storageKey)
    db.clear()
  }

  async size(): Promise<number> {
    await this.cleanOldRecords().catch(console.error)
    const db = await this.getDexie(this.storageKey)
    return db.count()
  }

  private async cleanOldRecords() {
    const db = await this.getDexie(this.storageKey)
    await db.where('timestamp').below(Date.now() - (this.ttlDays * 8.64e+7)).delete();
  }

  private async getDexie(storageKey: string): Promise<Table<LongTimeCacheData<Key, Value>, Key>> {
    if (this.storage !== undefined) {
      return this.storage as any
    }
    this.storage = await getDexie<Key, Value>(storageKey) as any
    return this.storage as any
  }
}
