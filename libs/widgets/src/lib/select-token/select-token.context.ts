import {
  ChainId,
  IApplicationContext,
  ISelectTokenContext,
  ISwapContext,
  IToken,
  TokenType
} from '@one-inch-community/models';
import {
  Subject,
  BehaviorSubject,
  combineLatest,
  switchMap,
  mergeMap,
  tap,
  startWith,
  debounceTime, distinctUntilChanged, Observable, defer
} from 'rxjs';
import { type Address } from 'viem';

export class SelectTokenContext implements ISelectTokenContext {

  readonly chainId$: Observable<ChainId | null> = defer(() => this.applicationContext.connectWalletController.data.chainId$);
  readonly connectedWalletAddress$: Observable<Address | null> = defer(() => this.applicationContext.connectWalletController.data.activeAddress$);
  readonly searchToken$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly changeFavoriteTokenState$: Subject<[ChainId, Address]> = new Subject()
  readonly searchInProgress$: Subject<boolean> = new BehaviorSubject(false)



  readonly favoriteTokens$ = this.chainId$.pipe(
    mergeMap(chainId => {
      if (chainId === null) return []
      return this.applicationContext.tokenController.liveQuery( () =>
        this.applicationContext.tokenController.getAllFavoriteTokenAddresses(chainId))
    }),
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
    switchMap( ([ chainId, address, searchToken ]: [ ChainId | null, Address | null, string ]) => {
      if (chainId === null) return []
      return this.applicationContext.tokenController.getSortedByPriorityAndBalanceTokenAddresses(chainId, searchToken, address ?? undefined)
    }),
    tap(() => this.searchInProgress$.next(false))
  )

  constructor(
    private readonly tokenType: TokenType,
    private readonly applicationContext: IApplicationContext,
    private readonly swapContext: ISwapContext
  ) {
  }

  async setFavoriteTokenState(chainId: ChainId, address: Address, state: boolean): Promise<void> {
    await this.applicationContext.tokenController.setFavoriteState(chainId, address, state)
    this.changeFavoriteTokenState$.next([ chainId, address ])
  }

  setSearchToken(state: string): void {
    this.searchInProgress$.next(true)
    this.searchToken$.next(state)
  }

  getSearchTokenValue() {
    return this.searchToken$.value
  }

  onSelectToken(token: IToken) {
    this.swapContext.setToken(this.tokenType, token)
  }
}
