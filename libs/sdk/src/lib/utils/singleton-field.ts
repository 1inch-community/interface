export function singletonField<T>(fieldName: string, factory: () => T): T {
  console.log(fieldName)
  if (!Reflect.has(window, fieldName)) {
    Reflect.set(window, fieldName, factory())
  }
  return Reflect.get(window, fieldName)
}