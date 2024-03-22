import { IBaseEventEmitter } from '@one-inch-community/models';
import { EventEmitter } from './event-emitter';

type InternalEventEmitterCondition<T> = (emitter: EventEmitter<T>) => () => void

export class InternalEventEmitter<T> implements IBaseEventEmitter<T> {

  private readonly emitter = new EventEmitter<T>()

  private unsubscribe: (() => void) | null = null

  constructor(private readonly condition: InternalEventEmitterCondition<T>) {
  }

  emit!: never;

  on(handler: (value: T) => void): number {
    const index = this.emitter.on(handler)
    if (!this.unsubscribe && this.getListenersCount() > 0) {
      this.unsubscribe = this.condition(this.emitter)
    }
    return index
  }

  off(handler: (value: T) => void): void;
  off(handlerNumber: number): void;
  off(handlerNumber: unknown): void {
    this.emitter.off(handlerNumber as any)
    if (this.unsubscribe && this.getListenersCount() === 0) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }

  getValue(): T | null {
    return this.emitter.getValue()
  }

  getListenersCount(): number {
    return this.emitter.getListenersCount()
  }

}
