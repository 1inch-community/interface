
export interface IStorageController {
  set<T>(key: string, data: T): void
  get<T>(key: string, parser: ((value: string) => T)): T | null
  remove(key: string): void
  update<T>(key: string, updates: ((value: T | null) => T)): T
  updateEntity(key: string, entityKey: string, value: unknown): void
}
