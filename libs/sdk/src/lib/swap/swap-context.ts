import {
  IConnectWalletController,
  ISwapContext,
  IToken,
  Pair,
  NullableValue,
  SwapSnapshot,
  TokenSnapshot,
  SwapSettings,
  SettingsValue,
  ISwapContextStrategyDataSnapshot
} from '@one-inch-community/models';
import {
  defer,
  distinctUntilChanged,
  map,
  merge,
  Observable,
  Subscription,
  switchMap,
  tap,
  combineLatest,
  withLatestFrom,
  debounceTime,
  of,
  startWith,
  shareReplay,
  BehaviorSubject, firstValueFrom, Subject, skip
} from 'rxjs';
import { PairHolder, TokenType } from './pair-holder';
import { SwapContextOnChainStrategy } from './swap-context-onchain.strategy';
import { SwapContextFusionStrategy } from './swap-context-fusion.strategy';
import { TokenController } from '../tokens';
import {
  estimateWrap, getBlockEmitter,
  getOneInchRouterV6ContractAddress, getPermit,
  getPermit2TypeData,
  isNativeToken,
  savePermit
} from '../chain';
import { OneInchDevPortalAdapter } from '../utils';
import { SettingsController } from '../settings';


export class SwapContext implements ISwapContext {

  private readonly pairHolder = new PairHolder()
  private readonly subscription = new Subscription()
  private readonly oneInchApiAdapter = new OneInchDevPortalAdapter()

  private readonly settings: SwapSettings = {
    slippage: new SettingsController('slippage'),
    auctionTime: new SettingsController('auctionTime')
  }

  private readonly contextStrategy = {
    onChain: new SwapContextOnChainStrategy(this.pairHolder, this.walletController),
    fusion: new SwapContextFusionStrategy(this, this.pairHolder, this.walletController, this.settings, this.oneInchApiAdapter)
  }

  readonly loading$ = new BehaviorSubject(false)

  readonly chainId$ = defer(() => this.walletController.data.chainId$).pipe(
    distinctUntilChanged()
  );
  readonly connectedWalletAddress$ = defer(() => this.walletController.data.activeAddress$).pipe(
    distinctUntilChanged()
  );
  readonly block$ = this.chainId$.pipe(
    switchMap(chainId => chainId ? getBlockEmitter(chainId) : of(null))
  )

  private readonly updateData$ = new Subject<void>()
  private readonly updateDataComplete$ = new Subject<void>()

  private readonly dataUpdateEmitter$: Observable<void> = merge(
    this.block$,
    this.chainId$,
    this.connectedWalletAddress$,
    this.pairHolder.streamSnapshot('source'),
    this.pairHolder.streamSnapshot('destination'),
    this.updateData$
  ).pipe(
    debounceTime(500),
    map(() => void 0),
    startWith(void 0),
    shareReplay({ bufferSize: 1, refCount: true })
  )

  private readonly dataSnapshot$: Observable<ISwapContextStrategyDataSnapshot | null> = this.dataUpdateEmitter$.pipe(
    withLatestFrom(this.connectedWalletAddress$),
    switchMap(([ _, address ]) => {
      this.loading$.next(true)
      return this.getDataSnapshot(address === null)
    }),
    tap(() => {
      this.loading$.next(false)
      this.updateDataComplete$.next()
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  )

  readonly rate$ = this.dataSnapshot$.pipe(
    map(snapshot => snapshot?.rate ?? null),
  )

  readonly minReceive$ = this.dataSnapshot$.pipe(
    map(snapshot => snapshot?.minReceive ?? 0n),
  )

  readonly destinationTokenAmount$ = this.dataSnapshot$.pipe(
    map(snapshot => snapshot?.destinationTokenAmount ?? 0n),
  )

  readonly autoSlippage$ = this.dataSnapshot$.pipe(
    map(snapshot => snapshot?.autoSlippage ?? null),
  )

  readonly autoAuctionTime$ = this.dataSnapshot$.pipe(
    map(snapshot => snapshot?.autoAuctionTime ?? null),
  )

  readonly slippage$: Observable<SettingsValue> = combineLatest([
    this.autoSlippage$,
    this.settings.slippage.value$
  ]).pipe(
    map(([ autoSlippage, slippageSettings ]) => {
      if (slippageSettings) return { type: slippageSettings[1], value: slippageSettings[0] }
      return { type: 'auto', value: autoSlippage } as const
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  )

  readonly auctionTime$: Observable<SettingsValue> = combineLatest([
    this.autoAuctionTime$,
    this.settings.auctionTime.value$
  ]).pipe(
    map(([ autoAuctionTime, auctionTimeSettings ]) => {
      if (auctionTimeSettings) return { type: auctionTimeSettings[1], value: auctionTimeSettings[0] }
      return { type: 'auto', value: autoAuctionTime } as const
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  )

  constructor(
    private readonly walletController: IConnectWalletController
  ) {
    this.subscription.add(
      merge(
        this.destinationTokenAmount$.pipe(
          distinctUntilChanged(),
          tap(amount => {
            this.setTokenAmountByType('destination', amount)
          })
        )
      ).subscribe()
    )
  }

  wrapNativeToken(amount: bigint): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getApprove(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getSettingsController<V extends keyof SwapSettings>(name: V): SwapSettings[V] {
    const controller = this.settings[name]
    if (!controller) throw new Error('')
    return controller
  }

  async getPermit(): Promise<void> {
    const chainId = await this.walletController.data.getChainId()
    const walletAddress = await this.walletController.data.getActiveAddress()
    const tokenSnapshot = this.pairHolder.getSnapshot('source')
    if (!chainId || !walletAddress || !isTokenSnapshotNotNullable(tokenSnapshot)) {
      throw new Error('')
    }
    const signFromStorage = await getPermit(
      chainId,
      tokenSnapshot.token.address,
      walletAddress,
      getOneInchRouterV6ContractAddress(chainId),
    )
    if (signFromStorage !== null) return
    const typeData = await getPermit2TypeData(
      chainId,
      tokenSnapshot.token.address,
      walletAddress,
      getOneInchRouterV6ContractAddress(chainId)
    )
    const sign = await this.walletController.signTypedData(typeData)
    await savePermit(
      chainId,
      tokenSnapshot.token.address,
      walletAddress,
      getOneInchRouterV6ContractAddress(chainId),
      sign
    )
  }

  destroy() {
    this.subscription.unsubscribe()
  }

  setPair(pair: NullableValue<Pair>): void {
    this.pairHolder.setPair(pair);
  }

  switchPair() {
    this.pairHolder.switchPair();
  }

  async getSnapshot(): Promise<SwapSnapshot> {
    this.updateData$.next()
    await firstValueFrom(this.updateDataComplete$)
    const [ swapSnapshot, slippage, auctionTime ] = await Promise.all([
      firstValueFrom(this.dataSnapshot$),
      firstValueFrom(this.slippage$),
      firstValueFrom(this.auctionTime$)
    ])
    return {
      ...swapSnapshot,
      slippage,
      auctionTime
    } as SwapSnapshot
  }

  async getMaxAmount() {
    const snapshot = this.pairHolder.getSnapshot('source')
    const sourceToken = snapshot.token
    const connectedWalletAddress = await this.walletController.data.getActiveAddress()
    if (!sourceToken || !connectedWalletAddress) return 0n;
    const balance = await TokenController.getTokenBalance(sourceToken.chainId, sourceToken.address, connectedWalletAddress);
    let amount = BigInt(balance?.amount ?? 0)
    if (isNativeToken(sourceToken.address)) {
      const chainId = await this.walletController.data.getChainId()
      if (!chainId) return 0n
      const [gasUnits, gasPriceDTO] = await Promise.all([
        estimateWrap(chainId, amount),
        this.oneInchApiAdapter.getGasPrice(chainId)
      ])
      if (!gasPriceDTO) return 0n
      const gasPrice = gasPriceDTO.high
      const fee = gasUnits * (BigInt(gasPrice.maxFeePerGas) + BigInt(gasPrice.maxPriorityFeePerGas))
      amount = amount - fee
      if (amount < 0n) {
        amount = 0n
      }
    }
    return amount
  }

  async setMaxAmount() {
    const amount = await this.getMaxAmount()
    this.setTokenAmountByType('source', amount)
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
        return snapshot.amount
      }),
      distinctUntilChanged(),
    )
  }

  getTokenRawAmountByType(type: TokenType): Observable<bigint | null> {
    return this.pairHolder.streamSnapshot(type).pipe(
      map(snapshot => snapshot.amount),
      distinctUntilChanged(),
    )
  }

  setTokenAmountByType(type: TokenType, value: bigint): void {
    this.pairHolder.setAmount(type, value)
  }

  private async getDataSnapshot(useOnChainStrategy: boolean): Promise<ISwapContextStrategyDataSnapshot | null> {
    if (!useOnChainStrategy) {
      try {
        return await this.contextStrategy.fusion.getDataSnapshot()
      } catch (error) {
        return this.getDataSnapshot(true)
      }
    }
    try {
      return await this.contextStrategy.onChain.getDataSnapshot()
    } catch (error) {
      return null
    }
  }

}

function isTokenSnapshotNotNullable(snapshot: NullableValue<TokenSnapshot>): snapshot is TokenSnapshot {
  return snapshot.token !== null && snapshot.amount !== null
}
