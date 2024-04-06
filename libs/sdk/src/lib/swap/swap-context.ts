import { ChainId, ISwapContext, IToken, ITokenRateProvider, Pair } from '@one-inch-community/models';
import { Address } from 'viem';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  ReplaySubject,
  shareReplay,
  startWith,
  Subject,
  switchMap, takeUntil, tap
} from 'rxjs';
import { buildDefaultTokenRageProvider } from '../tokens/token-rate';
import { TokenContext } from './token-context';
import { BigMath } from '../utils';

export class SwapContext implements ISwapContext {

  private readonly pair = {
    source: new TokenContext(),
    destination: new TokenContext()
  }
  private readonly pairChance$ = new Subject<void>()

  readonly chainId$ = new ReplaySubject<ChainId>(1);
  readonly connectedWalletAddress$ = new ReplaySubject<Address | null>(1);

  private readonly destroy$ = new Subject<void>();

  private readonly rate$ = combineLatest([
    this.chainId$,
    this.getTokenByType('source'),
    this.getTokenByType('destination')
  ]).pipe(
    switchMap(([chainId, sourceToken, destinationToken]) => {
      if (!sourceToken || !destinationToken) return [0n]
      return this.rateProvider.listenRate(chainId, sourceToken, destinationToken)
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  constructor(
    private readonly rateProvider: ITokenRateProvider = buildDefaultTokenRageProvider()
  ) {
  }

  init() {
    combineLatest([
      this.rate$,
      this.getTokenRawAmountByType('source'),
      this.getTokenByType('source'),
      this.getTokenByType('destination')
    ]).pipe(
      tap(([ rate, amount, sourceToken, destinationToken ]) => {
        if (!rate || !destinationToken || !sourceToken) return;
        if (amount === 0n) {
          this.getContextByType('destination')
            .setAmountAndMarkDirty(0n)
          return;
        }
        const destinationTokenAmount = BigMath.dev(
          amount,
          rate,
          sourceToken.decimals,
          destinationToken.decimals,
        )
        console.log(destinationTokenAmount)
        this.getContextByType('destination')
          .setAmountAndMarkDirty(destinationTokenAmount)
      }),
      takeUntil(this.destroy$)
    ).subscribe()
  }

  destroy() {
    this.destroy$.next();
  }

  setChainId(chainId: ChainId): void {
    this.chainId$.next(chainId);
  }

  setPair(pair: Partial<Pair>): void {
    this.pair.source.setToken(pair.srcToken)
    this.pair.destination.setToken(pair.dstToken)
    this.pairChance$.next()
  }

  switchPair() {
    const { source, destination } = this.pair
    this.pair.source = destination
    this.pair.destination = source
    this.pairChance$.next()
  }

  setConnectedWalletAddress(address?: Address) {
    this.connectedWalletAddress$.next(address ?? null);
  }

  getTokenByType(type: 'source' | 'destination'): Observable<IToken | null> {
    return this.getContextByTypeStream(type).pipe(
      switchMap(context => context.token$),
      distinctUntilChanged()
    )
  }

  getTokenAmountByType(type: 'source' | 'destination'): Observable<bigint> {
    return this.getContextByTypeStream(type).pipe(
      switchMap(context => context.amountForView$),
      distinctUntilChanged()
    )
  }

  getTokenRawAmountByType(type: 'source' | 'destination'): Observable<bigint> {
    return this.getContextByTypeStream(type).pipe(
      switchMap(context => context.amount$),
      distinctUntilChanged()
    )
  }

  setTokenAmountByType(type: 'source' | 'destination', value: string): void;
  setTokenAmountByType(type: 'source' | 'destination', value: bigint): void;
  setTokenAmountByType(type: 'source' | 'destination', value: any): void {
    this.getContextByType(type).setAmount(value)
  }

  private getContextByType(type: 'source' | 'destination'): TokenContext {
    if (type === 'source') {
      return this.pair.source;
    }
    if (type === 'destination') {
      return this.pair.destination;
    }
    throw new Error(`invalid token type ${type}`);
  }

  private getContextByTypeStream(type: 'source' | 'destination'): Observable<TokenContext> {
    return this.pairChance$.pipe(
      map(() => this.getContextByType(type)),
      startWith(this.getContextByType(type)),
    )
  }

}