import { ICacheAsync } from '@one-inch-community/models';
import type Dexie from 'dexie';
import type { Table } from 'dexie';

type LongTimeCacheData<Key, Value> = {
  key: Key;
  timestamp: number;
  value: Value;
}

const version = 1

let db: Dexie
async function getDexie<Key, Value>(storageKey: string): Promise<Table<LongTimeCacheData<Key, Value>, Key>> {
  if (db) return Reflect.get(db, 'cache')
  const Dexie = await import('dexie').then(m => m.Dexie)
  db = new Dexie('one-inch-long-time-async-cache_' + storageKey)
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

  constructor(private readonly storageKey: string, private readonly ttlDays: number) {
  }

  async set(key: Key, value: Value): Promise<void> {
    const db = await getDexie(this.storageKey)
    await db.put({ key: key.toLowerCase(), value, timestamp: Date.now() })
    this.cleanOldRecords().catch(console.error)
  }

  async get(key: Key): Promise<Value | null> {

    const _key = key.toLowerCase()
    const db = await getDexie<Key, Value>(this.storageKey)
    const result = await db
      .filter(item => (Date.now() - item.timestamp) < (this.ttlDays * 8.64e+7) && item.key === _key)
      .first()
    this.cleanOldRecords().catch(console.error)
    return result?.value ?? null
  }

  async has(key: Key): Promise<boolean> {
    const result = await this.get(key)
    return result !== null
  }

  async delete(key: Key): Promise<boolean> {
    try {
      const db = await getDexie<Key, Value>(this.storageKey)
      await db.delete(key)
      this.cleanOldRecords().catch(console.error)
      return true
    } catch {
      return false
    }
  }

  async clear(): Promise<void> {
    const db = await getDexie<Key, Value>(this.storageKey)
    db.clear()
  }

  async size(): Promise<number> {
    await this.cleanOldRecords().catch(console.error)
    const db = await getDexie<Key, Value>(this.storageKey)
    return db.count()
  }

  private async cleanOldRecords() {
    const db = await getDexie<Key, Value>(this.storageKey)
    await db.where('timestamp').below(Date.now() - (this.ttlDays * 8.64e+7)).delete();
  }
}
