import { Observable } from 'rxjs';

export interface ISettingsController<Value> {
  readonly name: string
  readonly value: Value | null
  readonly value$: Observable<Value | null>
  setValue(value: Value): void
  resetValue(): void
  cleanValue(): void
  startChangingValue(): void
  endChangingValue(): void
}
