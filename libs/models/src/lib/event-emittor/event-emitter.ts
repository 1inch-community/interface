export interface IBaseEventEmitter<T> {
  on(handler: (value: T) => void): number
  off(handler: (value: T) => void): void
  off(handlerNumber: number): void
  getValue(): T | null
  getListenersCount(): number
}

export interface IEventEmitter<T> extends IBaseEventEmitter<T> {
  emit(value: T): void
}
