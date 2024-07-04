import { ISettingsController } from '@one-inch-community/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { JsonParser, storage } from '@one-inch-community/core/storage';

export class SettingsController<Value> implements ISettingsController<Value> {
  private readonly valueState$ = new BehaviorSubject<Value | null>(getPersistValue(this.name) ?? this.initValue);

  readonly value$: Observable<Value | null> = this.valueState$;

  private originalValue: Value | null = null

  get value(): Value | null {
    return this.valueState$.value;
  }

  constructor(
    readonly name: string,
    readonly initValue: Value | null = null
  ) {}

  setValue(value: Value): void {
    this.valueState$.next(value)
    updatePersist(this.name, value)
  }

  resetValue() {
    this.valueState$.next(this.originalValue)
    updatePersist(this.name, this.originalValue)
  }

  cleanValue() {
    this.valueState$.next(null)
    updatePersist(this.name, null)
  }

  startChangingValue() {
    if (this.originalValue !== null) {
      throw new Error('value changing in progress')
    }
    this.originalValue = this.value
  }

  endChangingValue() {
    this.originalValue = null
  }

}

const persistStorageKey = 'one-inch-settings'

function updatePersist<Value>(name: string, value: Value) {
  const data = storage.get<Record<string, Value>>(persistStorageKey, JsonParser) ?? {}
  storage.set(persistStorageKey, { ...data, [name]: value });
}

function getPersistValue<Value>(name: string): Value | null {
  const data = storage.get<Record<string, Value>>(persistStorageKey, JsonParser)
  if (data === null) return null
  return Reflect.get(data, name)
}
