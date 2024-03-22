import { IBaseEventEmitter, IEventEmitter } from '@one-inch-community/models';

export function convertToPrivateEmitter<T>(emitter: IEventEmitter<T>): IBaseEventEmitter<T> {
  return new PrivateEventEmitter(emitter)
}

export class PrivateEventEmitter<T> implements IBaseEventEmitter<T> {

  constructor(private readonly emitter: IEventEmitter<T>) {
  }

  on(handler: (value: T) => void): number {
    return this.emitter.on(handler)
  }

  off(handler: (value: T) => void): void;
  off(handlerNumber: number): void;
  off(handlerNumber: unknown): void {
    return this.emitter.off(handlerNumber as any)
  }

  getValue(): T | null {
    return this.emitter.getValue()
  }

  getListenersCount(): number {
    return this.emitter.getListenersCount()
  }


}