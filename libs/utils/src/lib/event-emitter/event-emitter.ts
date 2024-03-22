import { IEventEmitter } from '@one-inch-community/models';

export class EventEmitter<T> implements IEventEmitter<T> {
  private index = 0
  private value: T | null
  private readonly handlers = new Map<number, (value: T) => void>()

  constructor(initValue?: T) {
    this.value = initValue ?? null
  }

  emit(value: T) {
    this.value = value
    this.handlers.forEach(handler => handler(value))
  }

  on(handler: (value: T) => void) {
    const number = this.index++
    this.handlers.set(number, handler)
    return number
  }

  off(handler: (value: T) => void): void
  off(handlerNumber: number): void
  off(handlerNumberOrHandler: number | ((value: T) => void)) {
    if (typeof handlerNumberOrHandler === 'number') {
      this.handlers.delete(handlerNumberOrHandler)
      return
    }
    for (const [ index, handler ] of this.handlers.entries()) {
      if (handler === handlerNumberOrHandler) {
        this.handlers.delete(index)
        return;
      }
    }
  }

  getValue() {
    return this.value
  }

  getListenersCount() {
    return this.handlers.size
  }

}