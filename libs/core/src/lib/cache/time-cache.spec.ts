import { describe, beforeEach, it, expect } from 'vitest'
import { TimeCache } from './time-cache';

describe('TimeCache', () => {
  let timeCache: TimeCache<string, number>

  beforeEach(() => {
    timeCache = new TimeCache<string, number>(5000) // Cache with entries having 5 seconds Time-to-live (TTL)
  })

  it('set() should set the value for the provided key', async () => {
    timeCache.set('key1', 10)

    await new Promise(resolve => setTimeout(resolve, 100))

    // Use the `get()` method to check if the key-value pair was set correctly
    expect(timeCache.get('key1')).toBe(10)
  })

  it('get() should retrieve the correct value for the provided key', () => {
    timeCache.set('key1', 10)

    expect(timeCache.get('key1')).toBe(10)
  })

  it('get() should return null if the cache does not contain the key', () => {
    expect(timeCache.get('nonexistentKey')).toBe(null)
  })

  it('get() should return null if the key is expired', async () => {
    timeCache = new TimeCache<string, number>(1) // Cache with entries having 1 ms TTL
    timeCache.set('key1', 10)

    // Wait for 5 ms to ensure that the key-value pair has expired
    await new Promise(resolve => setTimeout(resolve, 5))

    expect(timeCache.get('key1')).toBe(null)
  })

  it('has() should return true if the cache contains the provided key', () => {
    timeCache.set('key1', 10)

    expect(timeCache.has('key1')).toBe(true)
  })

  it('has() should return false if the cache does not contain the provided key', () => {
    expect(timeCache.has('nonexistentKey')).toBe(false)
  })

  it('has() should return false if the key is expired', async () => {
    timeCache = new TimeCache<string, number>(1) // Cache with entries having 1 ms TTL
    timeCache.set('key1', 10)

    // Wait for 5 ms to ensure that the key-value pair has expired
    await new Promise(resolve => setTimeout(resolve, 5))

    expect(timeCache.has('key1')).toBe(false)
  })

  it('clear() should delete all entries from the cache', () => {
    timeCache.set('key1', 10)
    timeCache.set('key2', 20)

    timeCache.clear()

    expect(timeCache.has('key1')).toBe(false)
    expect(timeCache.has('key2')).toBe(false)
  })
})