export function contextField<T>(fieldName: string, factory: () => T): T {
  if (!Reflect.has(window, fieldName)) {
    Reflect.set(window, fieldName, factory())
  }
  return Reflect.get(window, fieldName)
}