
export function CacheActivePromise<Ctx extends object, T extends Array<unknown>>(keyExtractor?: (ctx: Ctx, ...args: T) => string) {
  const cacheStorage = new WeakMap<object, Map<string, Promise<unknown>>>()

  const getCache = (ctx: Ctx): Map<string, Promise<unknown>> => {
    let cache = cacheStorage.get(ctx)
    if (!cache) {
      cache = new Map<string, Promise<unknown>>()
      cacheStorage.set(ctx, cache);
    }
    return cache
  }

  return function (_: unknown, fieldName: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
    const method: ((...args: T) => Promise<unknown>) = propertyDescriptor.value;
    propertyDescriptor.value = function(...args: T) {
      const cache = getCache(this as Ctx)
      const key = keyExtractor ? keyExtractor(...[this as Ctx, ...args]) : JSON.stringify(args);

      if (cache.has(key)) {
        return cache.get(key);
      }

      const result: Promise<unknown> = method.apply(this, args).finally(() => cache.delete(key));
      cache.set(key, result);
      return result;
    }

    return propertyDescriptor
  }
}