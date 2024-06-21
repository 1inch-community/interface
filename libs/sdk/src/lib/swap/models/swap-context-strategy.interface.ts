import { Rate } from '@one-inch-community/models';
import { Observable } from 'rxjs';

export interface ISwapContextStrategy {
  readonly rate$: Observable<Rate | null>
  readonly minReceive$: Observable<bigint>
  readonly autoSlippage$: Observable<number | null>
  readonly autoAuctionTime$: Observable<number | null>
  readonly destinationTokenAmount$: Observable<bigint>
  destroy(): void
}
