import { ReactiveControllerHost, ReactiveController } from 'lit';
import { IEventEmitter } from '@one-inch-community/models';

export function bindEmitter<T>(host: ReactiveControllerHost, eventEmitter: IEventEmitter<T> | (() => IEventEmitter<T>)) {
  return new EventEmitterViewBinder<T>(host, eventEmitter)
}

export class EventEmitterViewBinder<T> implements ReactiveController {

  private handlerNumber?: number

  private _eventEmitter?: IEventEmitter<T>

  get value(): T | null {
    return this._eventEmitter?.getValue() ?? null
  }

  constructor(
    private readonly host: ReactiveControllerHost,
    private readonly eventEmitter: IEventEmitter<T> | (() => IEventEmitter<T>)
  ) {
    this.host.addController(this)
  }

  hostConnected() {
    const eventEmitter = typeof this.eventEmitter === 'function' ? this.eventEmitter() : this.eventEmitter
    if (!eventEmitter) {
      throw new EventEmitterViewBinderError('a non-existent event emitter was passed')
    }
    this._eventEmitter = eventEmitter
    this.handlerNumber = eventEmitter.on(() => this.host.requestUpdate())
  }

  hostDisconnected() {
    this.handlerNumber && this._eventEmitter?.off(this.handlerNumber);
  }

}

class EventEmitterViewBinderError extends Error {
  constructor(message: string) {
    super(message);
  }
}