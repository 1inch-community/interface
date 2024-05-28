import { IConnectWalletController, ISwapContext, IToken, Pair, NullableValue } from '@one-inch-community/models';
import {
  combineLatest,
  defer,
  distinctUntilChanged,
  map,
  merge,
  Observable,
  scan,
  shareReplay,
  Subscription,
  switchMap,
  tap
} from 'rxjs';
import { PairHolder, TokenType } from './pair-holder';
import { SwapContextOnChainStrategy } from './swap-context-onchain.strategy';
import { SwapContextFusionStrategy } from './swap-context-fusion.strategy';
import { ISwapContextStrategy } from './models/swap-context-strategy.interface';
import { BigMath } from '../utils';

export class SwapContext implements ISwapContext {

  private readonly pairHolder = new PairHolder()
  private readonly subscription = new Subscription()

  private lastSwapContextStrategy: ISwapContextStrategy | null = null;

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
    tap(strategy => this.lastSwapContextStrategy = strategy),
    shareReplay({ bufferSize: 1, refCount: true })
  )

  readonly rate$ = this.strategy$.pipe(
    switchMap(strategy => strategy.rate$)
  )

  constructor(
    private readonly walletController: IConnectWalletController
  ) {
    const distinctionTokenAmountSync$ = combineLatest([
      this.rate$.pipe(distinctUntilChanged()),
      this.getTokenRawAmountByType('source').pipe(distinctUntilChanged()),
      this.getTokenByType('source'),
      this.getTokenByType('destination')
    ]).pipe(
      map(([rate, sourceTokenAmount, sourceToken, destinationToken]) => {
        if (!sourceTokenAmount || sourceTokenAmount === 0n || rate === 0n || !sourceToken || !destinationToken) return 0n
        return BigMath.mul(
          sourceTokenAmount,
          rate,
          sourceToken.decimals,
          sourceToken.decimals,
          destinationToken.decimals
        )
      }),
      tap(amount => this.setTokenAmountByType('destination', amount, true))
    )

    this.subscription.add(
      merge(
        distinctionTokenAmountSync$
      ).subscribe()
    )
  }

  destroy() {
    this.subscription.unsubscribe()
    this.lastSwapContextStrategy?.destroy()
  }

  setPair(pair: NullableValue<Pair>): void {
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

  getTokenAmountByType(type: TokenType): Observable<bigint | null> {
    return this.pairHolder.streamSnapshot(type).pipe(
      map(snapshot => {
        return snapshot.amountView
      }),
      distinctUntilChanged(),
    )
  }

  getTokenRawAmountByType(type: TokenType): Observable<bigint | null> {
    return this.pairHolder.streamSnapshot(type).pipe(
      map(snapshot => snapshot.amountRaw),
      distinctUntilChanged(),
    )
  }

  setTokenAmountByType(type: TokenType, value: bigint, markDirty?: boolean): void {
    this.pairHolder.setAmount(type, value, markDirty)
  }

}
