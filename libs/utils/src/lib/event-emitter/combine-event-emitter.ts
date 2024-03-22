import { IBaseEventEmitter } from '@one-inch-community/models';
import { EventEmitter } from './event-emitter';

interface ICombineEventEmitterConstructor {
  new<E1>(e1: IBaseEventEmitter<E1>): IBaseEventEmitter<[E1]>
  new<E1, E2>(e1: IBaseEventEmitter<E1>, e2: IBaseEventEmitter<E2>): IBaseEventEmitter<[E1, E2]>
  new<E1, E2, E3>(e1: IBaseEventEmitter<E1>, e2: IBaseEventEmitter<E2>, e3: IBaseEventEmitter<E3>): IBaseEventEmitter<[E1, E2, E3]>
  new<E1, E2, E3, E4>(e1: IBaseEventEmitter<E1>, e2: IBaseEventEmitter<E2>, e3: IBaseEventEmitter<E3>, e4: IBaseEventEmitter<E4>): IBaseEventEmitter<[E1, E2, E3, E4]>
  new<E1, E2, E3, E4, E5>(e1: IBaseEventEmitter<E1>, e2: IBaseEventEmitter<E2>, e3: IBaseEventEmitter<E3>, e4: IBaseEventEmitter<E4>, e5: IBaseEventEmitter<E5>): IBaseEventEmitter<[E1, E2, E3, E4, E5]>
  new<E1, E2, E3, E4, E5, E6>(e1: IBaseEventEmitter<E1>, e2: IBaseEventEmitter<E2>, e3: IBaseEventEmitter<E3>, e4: IBaseEventEmitter<E4>, e5: IBaseEventEmitter<E5>, e6: IBaseEventEmitter<E6>): IBaseEventEmitter<[E1, E2, E3, E4, E5, E6]>
  new<E1, E2, E3, E4, E5, E6, E7>(e1: IBaseEventEmitter<E1>, e2: IBaseEventEmitter<E2>, e3: IBaseEventEmitter<E3>, e4: IBaseEventEmitter<E4>, e5: IBaseEventEmitter<E5>, e6: IBaseEventEmitter<E6>, e7: IBaseEventEmitter<E7>): IBaseEventEmitter<[E1, E2, E3, E4, E5, E6, E7]>
  new<E1, E2, E3, E4, E5, E6, E7, E8>(e1: IBaseEventEmitter<E1>, e2: IBaseEventEmitter<E2>, e3: IBaseEventEmitter<E3>, e4: IBaseEventEmitter<E4>, e5: IBaseEventEmitter<E5>, e6: IBaseEventEmitter<E6>, e7: IBaseEventEmitter<E7>, e8: IBaseEventEmitter<E8>): IBaseEventEmitter<[E1, E2, E3, E4, E5, E6, E7, E8]>
  new<E1, E2, E3, E4, E5, E6, E7, E8, E9>(e1: IBaseEventEmitter<E1>, e2: IBaseEventEmitter<E2>, e3: IBaseEventEmitter<E3>, e4: IBaseEventEmitter<E4>, e5: IBaseEventEmitter<E5>, e6: IBaseEventEmitter<E6>, e7: IBaseEventEmitter<E7>, e8: IBaseEventEmitter<E8>, e9: IBaseEventEmitter<E9>): IBaseEventEmitter<[E1, E2, E3, E4, E5, E6, E7, E8, E9]>
}

class CombineEventEmitterImpl implements IBaseEventEmitter<unknown[]> {

  private readonly combinedEmitter = new EventEmitter<unknown[]>()
  private readonly emitters: IBaseEventEmitter<unknown>[]

  private readonly subscribeNumbers: number[] = []
  private readonly lastValues = new Map<number, unknown>()

  constructor(...args: IBaseEventEmitter<unknown>[]) {
    this.emitters = args
  }


  on(handler: (value: unknown[]) => void): number {
    if (this.getListenersCount() === 0) {
      this.startCombine()
    }
    return this.combinedEmitter.on(handler)
  }

  off(handler: (value: unknown[]) => void): void;
  off(handlerNumber: number): void;
  off(handlerNumber: unknown): void {
    this.combinedEmitter.off(handlerNumber as any)
    if (this.getListenersCount() === 0) {
      this.stopCombine()
    }
  }

  getValue(): unknown[] | null {
    return this.emitters.map(emitter => emitter.getValue())
  }

  getListenersCount(): number {
    return this.combinedEmitter.getListenersCount()
  }

  private startCombine() {
    for (let i = 0; i < this.emitters.length; i++) {
      const emitter = this.emitters[i]
      const value = emitter.getValue()
      this.lastValues.set(i, value)
      const subscribeNumber = emitter.on(value => {
        this.lastValues.set(i, value)
        this.combineEmit()
      })
      this.subscribeNumbers.push(subscribeNumber)
    }
  }

  private stopCombine() {
    for (let i = 0; i < this.emitters.length; i++) {
      const emitter = this.emitters[i]
      const subscribeNumber = this.subscribeNumbers[i]
      emitter.off(subscribeNumber)
    }
    this.lastValues.clear()
  }

  private combineEmit() {
    this.combinedEmitter.emit(Array.from(this.lastValues.values()))
  }

}

export const CombineEventEmitter: ICombineEventEmitterConstructor = CombineEventEmitterImpl as any
