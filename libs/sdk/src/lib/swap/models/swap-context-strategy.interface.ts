import { Observable } from 'rxjs';

export interface ISwapContextStrategy {
  readonly rate$: Observable<bigint>
  readonly revertedRate$: Observable<bigint>
  readonly destinationTokenAmount$: Observable<bigint>
  destroy(): void
}
