import { Observable } from 'rxjs';

export interface ISwapContextStrategy {
  readonly rate$: Observable<bigint>
  destroy(): void
}