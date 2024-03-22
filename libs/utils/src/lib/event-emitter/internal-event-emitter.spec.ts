import { beforeEach, describe, it, expect } from 'vitest';
import { InternalEventEmitter } from './internal-event-emitter';

describe('InternalEventEmitter class', () => {
  let eventEmitter: InternalEventEmitter<any>;

  beforeEach(() => {
    eventEmitter = new InternalEventEmitter<number>((emitter) => () => void 0);
  });

  it('should throw an error using the emit function', () => {
    expect(() => eventEmitter.emit).toThrow();
  });

  it('should return index when using the on function', () => {
    expect(eventEmitter.on((value) => void 0)).toBeGreaterThanOrEqual(0);
  });

  it('should remove listeners successfully after using the off function', () => {
    const handlerIndex = eventEmitter.on((value) => void 0);
    void eventEmitter.off(handlerIndex);
    expect(eventEmitter.getListenersCount()).toEqual(0); 
  });

  it('should return null for the getValue function', () => {
    expect(eventEmitter.getValue()).toBeNull();
  });

  it('should return correct listener counts', () => {
    expect(eventEmitter.getListenersCount()).toEqual(0);
  });
});