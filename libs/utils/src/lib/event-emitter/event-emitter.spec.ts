import { beforeEach, it, expect, describe } from "vitest";
import { EventEmitter } from "./event-emitter";

describe('EventEmitter class', () => {
  let eventEmitter: EventEmitter<string>;
  let res: string;

  beforeEach(() => {
    eventEmitter = new EventEmitter<string>();
    res = '';
  });

  describe('on and emit methods', () => {
    it('emit should call handlers added by on', () => {
      eventEmitter.on(value => res = value);
      eventEmitter.emit('test');
      expect(res).toBe('test');
    });
  });

  describe('off method', () => {
    it('off should remove handler', () => {
      const handler = (value: string) => res = value;
      eventEmitter.on(handler);
      eventEmitter.off(handler);
      eventEmitter.emit('test2');
      expect(res).toBe('');
    });

    it('off should remove handler by id', () => {
      const handlerId = eventEmitter.on(value => res = value);
      eventEmitter.off(handlerId);
      eventEmitter.emit('test3');
      expect(res).toBe('');
    });
  });

  describe('getValue method', () => {
    it('getValue should return last emitted value', () => {
      eventEmitter.emit('test4');
      expect(eventEmitter.getValue()).toBe('test4');
    });
  });

  describe('getListenersCount method', () => {
    it('getListenersCount returns number of active listeners', () => {
      eventEmitter.on(() => void 0);
      eventEmitter.on(() => void 0);
      expect(eventEmitter.getListenersCount()).toBe(2);
    });
  });
});
