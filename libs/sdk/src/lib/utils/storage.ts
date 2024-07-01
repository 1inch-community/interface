type StorageConfig = {
  storagePrefix?: string
  storageSeparator?: string
}

class Storage {

  private readonly storage: globalThis.Storage | null = getStorage()

  private get prefix() {
    return this.config.storagePrefix ?? ''
  }

  private get separator() {
    return this.config.storageSeparator ?? ':'
  }

  constructor(private readonly config: StorageConfig) {
  }


  set<T>(key: string, data: T): void {
    if (!this.storage) return;
    try {
      const _key = this.key(key)
      const strData = typeof data !== 'string' ? JSON.stringify(data) : data
      this.storage.setItem(_key, strData)
    } catch (error) {
      console.warn(error)
    }
  }

  get<T>(key: string, parser: ((value: string) => T)): T | null {
    if (!this.storage) return null;
    try {
      const _key = this.key(key)
      const strData = this.storage.getItem(_key)
      if (strData === null) return null;
      return parser(strData)
    } catch (error) {
      console.warn(error)
      return null;
    }
  }

  remove(key: string): void {
    if (!this.storage) return;
    try {
      const _key = this.key(key)
      this.storage.removeItem(_key)
    } catch (error) {
      console.warn(error)
    }
  }

  update<T>(key: string, updates: ((value: T | null) => T)): T {
    const value = this.get<T>(key, JsonParser);
    const newValue = updates(value);
    this.set(key, newValue);
    return newValue;
  }

  updateEntity(key: string, entityKey: string, value: unknown) {
    const entity: any = this.get<object>(key, JsonParser) ?? {};
    const newEntity = { ...entity, [entityKey]: value }
    this.set(key, newEntity);
  }

  private key(rawKey: string): string {
    return [this.prefix, rawKey].join(this.separator)
  }
}

function getStorage(): globalThis.Storage | null {
  if (isSupportedStorage(window.localStorage)) {
    return window.localStorage
  }
  if (isSupportedStorage(window.sessionStorage)) {
    return window.sessionStorage
  }
  return null;
}

function isSupportedStorage(storage: globalThis.Storage): boolean {
  if (window?.localStorage) {
    try {
      storage.setItem('@__test__@', '1')
      const item1 = window.localStorage.getItem('@__test__@')
      storage.removeItem('@__test__@')
      const item2 = storage.getItem('@__test__@')
      return item1 === '1' && item2 === null;
    } catch {
      return false;
    }
  }
  return false
}

export function JsonParser<T>(value: string): T {
  return JSON.parse(value)
}

export const storage = new Storage({
  storagePrefix: 'one-inch',
  storageSeparator: ':'
})
