import { Rate } from '@one-inch-community/models';
import { Observable } from 'rxjs';

export interface ISwapContextStrategy {
  readonly rate$: Observable<Rate | null>
  readonly destinationTokenAmount$: Observable<bigint>
  destroy(): void
}
