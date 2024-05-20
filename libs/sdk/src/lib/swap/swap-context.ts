import { IConnectWalletController, ISwapContext, IToken, Pair } from '@one-inch-community/models';
import {
  defer,
  distinctUntilChanged,
  map, merge,
  Observable, scan, shareReplay, Subscription, switchMap
} from 'rxjs';
import { PairHolder, TokenType } from './pair-holder';
import { SwapContextOnChainStrategy } from './swap-context-onchain.strategy';
import { SwapContextFusionStrategy } from './swap-context-fusion.strategy';
import { ISwapContextStrategy } from './models/swap-context-strategy.interface';

export class SwapContext implements ISwapContext {

  private readonly pairHolder = new PairHolder()
  private readonly subscription = new Subscription()

  readonly chainId$ = defer(() => this.walletController.data.chainId$);
  readonly connectedWalletAddress$ = defer(() => this.walletController.data.activeAddress$);

  private readonly strategy$: Observable<ISwapContextStrategy> = this.connectedWalletAddress$.pipe(
    map(address => address === null),
    distinctUntilChanged(),
    scan<boolean, ISwapContextStrategy, ISwapContextStrategy | null>((previousStrategy, useOneChainStrategy) => {
      if (previousStrategy) {
        previousStrategy.destroy()
      }
      return useOneChainStrategy
        ? new SwapContextOnChainStrategy(this.pairHolder, this.walletController)
        : new SwapContextFusionStrategy(this.pairHolder, this.walletController)
    }, null),
    shareReplay({ bufferSize: 1, refCount: true })
  )

  readonly rate$ = this.strategy$.pipe(
    switchMap(strategy => strategy.rate$)
  )

  constructor(
    private readonly walletController: IConnectWalletController
  ) {
    this.subscription.add(
      merge(
        this.strategy$
      ).subscribe()
    )
  }

  destroy() {
    this.subscription.unsubscribe()
  }

  setPair(pair: Partial<Pair>): void {
    this.pairHolder.setPair(pair);
  }

  switchPair() {
    this.pairHolder.switchPair();
  }

  getTokenByType(type: TokenType): Observable<IToken | null> {
    return this.pairHolder.streamSnapshot(type).pipe(
      map(snapshot => snapshot.token),
      distinctUntilChanged(),
    )
  }

  getTokenAmountByType(type: TokenType): Observable<bigint> {
    return this.pairHolder.streamSnapshot(type).pipe(
      map(snapshot => snapshot.amountView),
      distinctUntilChanged(),
    )
  }

  getTokenRawAmountByType(type: TokenType): Observable<bigint> {
    return this.pairHolder.streamSnapshot(type).pipe(
      map(snapshot => snapshot.amountRaw),
      distinctUntilChanged(),
    )
  }

  setTokenAmountByType(type: TokenType, value: bigint, markDirty?: boolean): void {
    this.pairHolder.setAmount(type, value, markDirty)
  }

}
