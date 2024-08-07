import {
  ISwapContext,
  IToken,
  Pair,
  NullableValue,
  SwapSnapshot,
  TokenSnapshot,
  SwapSettings,
  SettingsValue,
  ISwapContextStrategyDataSnapshot,
  TokenType,
  IApplicationContext,
  IOneInchDevPortalAdapter,
  IConnectWalletController,
  ISwapContextStrategy,
  FusionQuoteReceiveDto
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
  BehaviorSubject, firstValueFrom, Subject, subscribeOn, asyncScheduler
} from 'rxjs';
import { PairHolder } from './pair-holder';
import { SwapContextOnChainStrategy } from './swap-context-onchain.strategy';
import { SwapContextFusionStrategy } from './swap-context-fusion.strategy';
import {
  estimateWrap, getApproveSimulation, getBlockEmitter,
  getOneInchRouterV6ContractAddress, getPermit,
  getPermit2TypeData,
  isNativeToken,
  savePermit
} from '@one-inch-community/sdk/chain';
import { SettingsController } from '@one-inch-community/core/settings';
import { Hash, maxUint256 } from 'viem';

type ContextStrategy = {
  onChain: ISwapContextStrategy<unknown>
  fusion: ISwapContextStrategy<FusionQuoteReceiveDto | null>
}


export class SwapContext implements ISwapContext {

  private readonly pairHolder: PairHolder;
  private readonly oneInchApiAdapter: IOneInchDevPortalAdapter;
  private readonly walletController: IConnectWalletController
  private readonly contextStrategy: ContextStrategy

  private readonly subscription = new Subscription();

  private readonly settings: SwapSettings = {
    slippage: new SettingsController('slippage'),
    auctionTime: new SettingsController('auctionTime')
  };

  readonly loading$ = new BehaviorSubject(false);

  readonly chainId$ = defer(() => this.walletController.data.chainId$).pipe(
    distinctUntilChanged()
  );
  readonly connectedWalletAddress$ = defer(() => this.walletController.data.activeAddress$).pipe(
    distinctUntilChanged()
  );
  readonly block$ = this.chainId$.pipe(
    switchMap(chainId => chainId ? getBlockEmitter(chainId) : of(null))
  );

  private readonly updateData$ = new Subject<void>();
  private readonly updateDataComplete$ = new Subject<void>();

  private readonly dataUpdateEmitter$: Observable<void> = merge(
    this.block$,
    this.chainId$,
    this.connectedWalletAddress$,
    defer(() => this.pairHolder.streamSnapshot('source')),
    defer(() => this.pairHolder.streamSnapshot('destination')),
    this.updateData$
  ).pipe(
    debounceTime(500),
    map(() => void 0),
    startWith(void 0),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private readonly dataSnapshot$: Observable<ISwapContextStrategyDataSnapshot | null> = this.dataUpdateEmitter$.pipe(
    withLatestFrom(this.connectedWalletAddress$),
    switchMap(([_, address]) => {
      this.loading$.next(true);
      return this.getDataSnapshot(address === null);
    }),
    tap(() => {
      this.loading$.next(false);
      this.updateDataComplete$.next();
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly rate$ = this.dataSnapshot$.pipe(
    map(snapshot => snapshot?.rate ?? null)
  );

  readonly minReceive$ = this.dataSnapshot$.pipe(
    map(snapshot => snapshot?.minReceive ?? 0n)
  );

  readonly destinationTokenAmount$ = this.dataSnapshot$.pipe(
    map(snapshot => snapshot?.destinationTokenAmount ?? 0n)
  );

  readonly autoSlippage$ = this.dataSnapshot$.pipe(
    map(snapshot => snapshot?.autoSlippage ?? null)
  );

  readonly autoAuctionTime$ = this.dataSnapshot$.pipe(
    map(snapshot => snapshot?.autoAuctionTime ?? null)
  );

  readonly slippage$: Observable<SettingsValue> = combineLatest([
    this.autoSlippage$,
    this.settings.slippage.value$
  ]).pipe(
    map(([autoSlippage, slippageSettings]) => {
      if (slippageSettings) return { type: slippageSettings[1], value: slippageSettings[0] };
      return { type: 'auto', value: autoSlippage } as const;
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly auctionTime$: Observable<SettingsValue> = combineLatest([
    this.autoAuctionTime$,
    this.settings.auctionTime.value$
  ]).pipe(
    map(([autoAuctionTime, auctionTimeSettings]) => {
      if (auctionTimeSettings) return { type: auctionTimeSettings[1], value: auctionTimeSettings[0] };
      return { type: 'auto', value: autoAuctionTime } as const;
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(
    private readonly applicationContext: IApplicationContext
  ) {
    this.pairHolder = new PairHolder(this.applicationContext)
    this.oneInchApiAdapter = this.applicationContext.oneInchDevPortalAdapter
    this.walletController = this.applicationContext.connectWalletController
    this.contextStrategy = {
      onChain: new SwapContextOnChainStrategy(this.pairHolder, this.walletController, this.applicationContext.tokenRateProvider),
      fusion: new SwapContextFusionStrategy(this, this.pairHolder, this.walletController, this.settings, this.oneInchApiAdapter)
    }
  }

  init() {
    this.pairHolder.init()

    this.subscription.add(
      merge(
        this.destinationTokenAmount$.pipe(
          distinctUntilChanged(),
          tap(amount => {
            this.setTokenAmountByType('destination', amount);
          }),
          subscribeOn(asyncScheduler)
        )
      ).subscribe()
    );
  }

  wrapNativeToken(amount: bigint): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getApprove(): Promise<Hash> {
    const chainId = await this.applicationContext.connectWalletController.data.getChainId()
    const sourceTokenSnapshot = this.pairHolder.getSnapshot('source')
    const owner = await this.applicationContext.connectWalletController.data.getActiveAddress()
    if (!chainId || !sourceTokenSnapshot || !sourceTokenSnapshot.token || !owner) throw new Error('');
    const spender = getOneInchRouterV6ContractAddress(chainId)
    const result = await getApproveSimulation(chainId, sourceTokenSnapshot.token.address, owner, spender, maxUint256)
    return await this.applicationContext.connectWalletController.writeContract(result.request)
  }

  getSettingsController<V extends keyof SwapSettings>(name: V): SwapSettings[V] {
    const controller = this.settings[name];
    if (!controller) throw new Error('');
    return controller;
  }

  async getPermit(): Promise<void> {
    const chainId = await this.walletController.data.getChainId();
    const walletAddress = await this.walletController.data.getActiveAddress();
    const tokenSnapshot = this.pairHolder.getSnapshot('source');
    if (!chainId || !walletAddress || !isTokenSnapshotNotNullable(tokenSnapshot)) {
      throw new Error('');
    }
    const signFromStorage = await getPermit(
      chainId,
      tokenSnapshot.token.address,
      walletAddress,
      getOneInchRouterV6ContractAddress(chainId)
    );
    if (signFromStorage !== null) return;
    const typeData = await getPermit2TypeData(
      chainId,
      tokenSnapshot.token.address,
      walletAddress,
      getOneInchRouterV6ContractAddress(chainId)
    );
    const sign = await this.walletController.signTypedData(typeData);
    await savePermit(
      chainId,
      tokenSnapshot.token.address,
      walletAddress,
      getOneInchRouterV6ContractAddress(chainId),
      sign,
      typeData.message as any
    );
  }

  destroy() {
    this.pairHolder.destroy()
    this.subscription.unsubscribe();
  }

  setPair(pair: NullableValue<Pair>): void {
    this.pairHolder.setPair(pair);
  }

  setToken(tokenType: TokenType, token: IToken) {
    this.pairHolder.setToken(token, tokenType)
  }

  switchPair() {
    this.pairHolder.switchPair();
  }

  async getSnapshot(): Promise<SwapSnapshot> {
    this.updateData$.next();
    await firstValueFrom(this.updateDataComplete$);
    const [swapSnapshot, slippage, auctionTime] = await Promise.all([
      firstValueFrom(this.dataSnapshot$),
      firstValueFrom(this.slippage$),
      firstValueFrom(this.auctionTime$)
    ]);
    return {
      ...swapSnapshot,
      slippage,
      auctionTime
    } as SwapSnapshot;
  }

  async swap(swapSnapshot: SwapSnapshot): Promise<Hash> {
    const strategy = await this.getActiveStrategy()
    return await strategy.swap(swapSnapshot)
  }

  async getMaxAmount() {
    const snapshot = this.pairHolder.getSnapshot('source');
    const sourceToken = snapshot.token;
    const connectedWalletAddress = await this.walletController.data.getActiveAddress();
    if (!sourceToken || !connectedWalletAddress) return 0n;
    const balance = await this.applicationContext.tokenController.getTokenBalance(sourceToken.chainId, sourceToken.address, connectedWalletAddress);
    let amount = BigInt(balance?.amount ?? 0);
    if (isNativeToken(sourceToken.address)) {
      const chainId = await this.walletController.data.getChainId();
      if (!chainId) return 0n;
      const [gasUnits, gasPriceDTO] = await Promise.all([
        estimateWrap(chainId, amount),
        this.oneInchApiAdapter.getGasPrice(chainId)
      ]);
      if (!gasPriceDTO) return 0n;
      const gasPrice = gasPriceDTO.high;
      const fee = gasUnits * (BigInt(gasPrice.maxFeePerGas) + BigInt(gasPrice.maxPriorityFeePerGas));
      amount = amount - fee;
      if (amount < 0n) {
        amount = 0n;
      }
    }
    return amount;
  }

  async setMaxAmount() {
    const amount = await this.getMaxAmount();
    this.setTokenAmountByType('source', amount);
  }

  getTokenByType(type: TokenType): Observable<IToken | null> {
    return this.pairHolder.streamSnapshot(type).pipe(
      map(snapshot => snapshot.token),
      distinctUntilChanged()
    );
  }

  getTokenAmountByType(type: TokenType): Observable<bigint | null> {
    return this.pairHolder.streamSnapshot(type).pipe(
      map(snapshot => {
        return snapshot.amount;
      }),
      distinctUntilChanged()
    );
  }

  getTokenRawAmountByType(type: TokenType): Observable<bigint | null> {
    return this.pairHolder.streamSnapshot(type).pipe(
      map(snapshot => snapshot.amount),
      distinctUntilChanged()
    );
  }

  setTokenAmountByType(type: TokenType, value: bigint): void {
    this.pairHolder.setAmount(type, value);
  }

  private async getActiveStrategy(): Promise<ISwapContextStrategy<unknown>> {
    const address = await this.walletController.data.getActiveAddress()
    if (address === null) {
      return this.contextStrategy.onChain
    }
    return this.contextStrategy.fusion
  }

  private async getDataSnapshot(useOnChainStrategy: boolean): Promise<ISwapContextStrategyDataSnapshot | null> {
    if (!useOnChainStrategy) {
      try {
        return await this.contextStrategy.fusion.getDataSnapshot();
      } catch (error) {
        return this.getDataSnapshot(true);
      }
    }
    try {
      return await this.contextStrategy.onChain.getDataSnapshot();
    } catch (error) {
      return null;
    }
  }

}

function isTokenSnapshotNotNullable(snapshot: NullableValue<TokenSnapshot>): snapshot is TokenSnapshot {
  return snapshot.token !== null && snapshot.amount !== null;
}
