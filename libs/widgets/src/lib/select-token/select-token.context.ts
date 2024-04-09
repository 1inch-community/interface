import { ChainId, ISelectTokenContext } from '@one-inch-community/models';
import { TokenController } from '@one-inch-community/sdk';
import { ReplaySubject, Subject, BehaviorSubject, combineLatest, switchMap, mergeMap } from 'rxjs';
import { type Address } from 'viem';

export class SelectTokenContext implements ISelectTokenContext {

  readonly chainId$: Subject<ChainId> = new ReplaySubject(1);
  readonly connectedWalletAddress$: Subject<Address | null> = new BehaviorSubject<Address | null>(null);
  readonly changeFavoriteTokenState$: Subject<[ChainId, Address]> = new Subject()

  readonly favoriteTokens$ = this.chainId$.pipe(
    mergeMap(chainId => TokenController.liveQuery( () => TokenController.getAllFavoriteTokenAddresses(chainId))),
  )

  readonly tokenAddressList$ = combineLatest([
    this.chainId$,
    this.connectedWalletAddress$,
  ]).pipe(
    switchMap( ([ chainId, address ]: [ ChainId, Address | null ]) => TokenController.getSortedForViewTokenAddresses(chainId, address ?? undefined))
  )

  setChainId(chainId: ChainId): void {
    this.chainId$.next(chainId)
  }

  setConnectedWalletAddress(address?: Address | undefined): void {
    this.connectedWalletAddress$.next(address ?? null)
  }

  async setFavoriteTokenState(chainId: ChainId, address: Address, state: boolean): Promise<void> {
    await TokenController.setFavoriteState(chainId, address, state)
    this.changeFavoriteTokenState$.next([ chainId, address ])
  }
}