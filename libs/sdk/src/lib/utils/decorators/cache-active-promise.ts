export function CacheActivePromise() {
  const cache = new Map()

  return function (_: any, __: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
    const method = propertyDescriptor.value;
    propertyDescriptor.value = function(...args: unknown[]) {
      const key = JSON.stringify(args);

      if (cache.has(key)) {
        return cache.get(key);
      }

      const result = method.apply(this, args).finally(() => cache.delete(key));
      cache.set(key, result);
      return result;
    }

    return propertyDescriptor
  }
}