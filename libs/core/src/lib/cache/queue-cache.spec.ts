import { describe, it, beforeEach, expect } from 'vitest';
import { QueueCache } from './queue-cache';

describe('QueueCache', () => {
  let qCache: QueueCache<string, number>;

  beforeEach(() => {
    // Fresh instance before each test
    qCache = new QueueCache<string, number>(5);
  });

  it('tests the set method', () => {
    qCache.set('one', 1);      

    // Check that set method works properly
    expect(qCache.get('one')).toBe(1);
    
    // Check that least recent item is removed when buffer is full
    for(let i=2;i<=6;i++)
      qCache.set(`key${i}`, i);
    expect(qCache.get('one')).toBeNull();
  });

  it('tests the get method', () => {
    qCache.set('one', 1);
    qCache.set('two', 2);

    // Check get method retrieves the correct value
    expect(qCache.get('two')).toBe(2);
    expect(qCache.get('one')).toBe(1);

    // Check get method returns null for non-existing keys
    expect(qCache.get('notExist')).toBeNull();
  });

  it('tests the has method', () => {
    qCache.set('one', 1);

    // Verify that existing key is found by has method
    expect(qCache.has('one')).toBe(true);

    // Verify that non-existing key is not found by has method
    expect(qCache.has('notExist')).toBe(false);
  });

  it('tests the clear method', () => {
    qCache.set('one', 1);
    qCache.clear();

    // Verify cache is cleared
    expect(qCache.get('one')).toBeNull();
  });
});