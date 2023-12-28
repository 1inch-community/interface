interface QueueCacheRecord<Value> {
    index: number
    value: Value
}

export class QueueCache<Key, Value> {
    private readonly cache = new Map<Key, Value>()
    private readonly indexes = new Map<number, Key>()
    private lastIndex = 0


    constructor(private readonly bufferSize: number) {
    }

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

    get(key: Key): Value | null {
        return this.cache.get(key) ?? null
    }

    has(key: Key): boolean {
        return this.cache.has(key)
    }
}
