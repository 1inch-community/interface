import { beforeEach, it, expect, describe } from 'vitest';
import { IBaseEventEmitter, IEventEmitter } from '@one-inch-community/models';
import { CombineEventEmitter } from './combine-event-emitter';
import { EventEmitter } from '@one-inch-community/utils';

describe('CombineEventEmitter', () => {

  let emitter1: IEventEmitter<number>
  let emitter2: IEventEmitter<string>
  let emitter3: IEventEmitter<boolean>

  let combineEventEmitter: IBaseEventEmitter<[number, string, boolean]>

  beforeEach(() => {
    emitter1 = new EventEmitter()
    emitter2 = new EventEmitter()
    emitter3 = new EventEmitter()

    combineEventEmitter = new CombineEventEmitter(emitter1, emitter2, emitter3);
  })

  it('should be create combine emitter', () => {
    expect(combineEventEmitter).toBeDefined();
  })

  it('should be emit combined values', () => {
      let result: [number, string, boolean] | undefined;
      combineEventEmitter.on((value) => {
        result = value;
      });

      emitter1.emit(10);
      emitter2.emit('hello');
      emitter3.emit(true);

      expect(result).toEqual([10, 'hello', true]);
  });

  it('should be give last values', () => {
    emitter1.emit(10);
    emitter2.emit('hello');
    emitter3.emit(true);

    expect(combineEventEmitter.getValue()).toEqual([10, 'hello', true]);
  })

  it('should be give listeners count', () => {
    expect(combineEventEmitter.getListenersCount()).toBe(0);
    combineEventEmitter.on(() => void 0)
    expect(combineEventEmitter.getListenersCount()).toBe(1);
  })

  it('should be emitted several times', () => {
    let result: [number, string, boolean] | undefined;
    combineEventEmitter.on((value) => {
      result = value;
    });
    expect(result).toEqual(undefined)
    expect(combineEventEmitter.getValue()).toEqual([null, null, null])

    emitter1.emit(10);
    emitter2.emit('hello');
    emitter3.emit(true);

    expect(combineEventEmitter.getValue()).toEqual([10, 'hello', true]);
    expect(result).toEqual([10, 'hello', true]);

    emitter1.emit(20);
    emitter2.emit('world');
    emitter3.emit(false);

    expect(combineEventEmitter.getValue()).toEqual([20, 'world', false]);
    expect(result).toEqual([20, 'world', false]);

    emitter1.emit(30);

    expect(combineEventEmitter.getValue()).toEqual([30, 'world', false]);
    expect(result).toEqual([30, 'world', false]);
  })

  it('should be check the unsubscribe', () => {
    let result: [number, string, boolean] | undefined;
    const subscriptionNumber = combineEventEmitter.on((value) => {
      result = value;
    });
    expect(combineEventEmitter.getListenersCount()).toBe(1);

    emitter1.emit(20);
    emitter2.emit('world');
    emitter3.emit(false);

    expect(combineEventEmitter.getValue()).toEqual([20, 'world', false]);
    expect(result).toEqual([20, 'world', false]);

    combineEventEmitter.off(subscriptionNumber)
    expect(combineEventEmitter.getListenersCount()).toBe(0);

    emitter1.emit(30);
    expect(combineEventEmitter.getValue()).toEqual([30, 'world', false]);
    expect(result).toEqual([20, 'world', false]);
  })

})