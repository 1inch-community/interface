import { ChainId, ISelectTokenContext } from '@one-inch-community/models';
import { TokenController } from '@one-inch-community/sdk/tokens';
import {
  ReplaySubject,
  Subject,
  BehaviorSubject,
  combineLatest,
  switchMap,
  mergeMap,
  tap,
  startWith,
  debounceTime, distinctUntilChanged
} from 'rxjs';
import { type Address } from 'viem';

export class SelectTokenContext implements ISelectTokenContext {

  readonly chainId$: Subject<ChainId> = new ReplaySubject(1);
  readonly connectedWalletAddress$: Subject<Address | null> = new BehaviorSubject<Address | null>(null);
  readonly searchToken$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly changeFavoriteTokenState$: Subject<[ChainId, Address]> = new Subject()
  readonly searchInProgress$: Subject<boolean> = new BehaviorSubject(false)

  readonly favoriteTokens$ = this.chainId$.pipe(
    mergeMap(chainId => TokenController.liveQuery( () => TokenController.getAllFavoriteTokenAddresses(chainId))),
  )

  readonly tokenAddressList$ = combineLatest([
    this.chainId$,
    this.connectedWalletAddress$,
    this.searchToken$.pipe(
      debounceTime(300),
      startWith(''),
      distinctUntilChanged()
    )
  ]).pipe(
    switchMap( ([ chainId, address, searchToken ]: [ ChainId, Address | null, string ]) => TokenController.getSortedForViewTokenAddresses(chainId, searchToken, address ?? undefined)),
    tap(() => this.searchInProgress$.next(false))
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

  setSearchToken(state: string): void {
    this.searchInProgress$.next(true)
    this.searchToken$.next(state)
  }

  getSearchTokenValue() {
    return this.searchToken$.value
  }
}
