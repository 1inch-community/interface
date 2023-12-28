interface TimeCacheRecord<Value> {
    value: Value
    timestamp: number
}

export class TimeCache<Key, Value> {
    private readonly cache = new Map<Key, TimeCacheRecord<Value>>()
    private autoCleanTimer?: any

    constructor(private readonly ttlMs: number,
                private autoClean: boolean = false) {
        this.enabledAutoClean()
    }

    set(key: Key, value: Value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        })
    }

    get(key: Key): Value | null {
        const record = this.cache.get(key)
        if (!record) return null
        if (Date.now() - record.timestamp > this.ttlMs) {
            this.cache.delete(key)
            return null
        }
        return record.value
    }

    destroy() {
        if (!this.autoCleanTimer) return
        clearInterval(this.autoCleanTimer)
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
