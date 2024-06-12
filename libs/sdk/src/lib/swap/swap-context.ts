import { IConnectWalletController, ISwapContext, IToken, Pair, NullableValue, SwapSnapshot, TokenSnapshot } from '@one-inch-community/models';
import {
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
import { TokenController } from '../tokens';
import { estimateWrap, isNativeToken } from '../chain';
import { OneInchDevPortalAdapter } from '../utils';


export class SwapContext implements ISwapContext {

  private readonly pairHolder = new PairHolder()
  private readonly subscription = new Subscription()
  private readonly oneInchApiAdapter = new OneInchDevPortalAdapter()

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
    switchMap(strategy => strategy.rate$),
  )

  readonly minReceive$ = this.strategy$.pipe(
    switchMap(strategy => strategy.minReceive$),
  )

  readonly destinationTokenAmount$ = this.strategy$.pipe(
    switchMap(strategy => strategy.destinationTokenAmount$)
  )

  constructor(
    private readonly walletController: IConnectWalletController
  ) {
    this.subscription.add(
      merge(
        this.destinationTokenAmount$.pipe(
          distinctUntilChanged(),
          tap(amount => {
            this.setTokenAmountByType('destination', amount, true)
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

  getPermit(): Promise<void> {
    throw new Error('Method not implemented.');
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

  async getSnapshot(): Promise<SwapSnapshot> {
    const sourceToken = this.pairHolder.getSnapshot('source')
    const destinationToken = this.pairHolder.getSnapshot('destination')
    const chainId = await this.walletController.data.getChainId()

    if (!isTokenSnapshotNotNullable(sourceToken)) {
      throw new Error('')
    }

    if (!isTokenSnapshotNotNullable(destinationToken)) {
      throw new Error('')
    }

    if (chainId === null) {
      throw new Error('')
    }

    return {
      chainId,
      sourceToken,
      destinationToken
    }
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
    this.setTokenAmountByType('source', amount, true)
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

function isTokenSnapshotNotNullable(snapshot: NullableValue<TokenSnapshot>): snapshot is TokenSnapshot {
  return snapshot.token !== null && snapshot.amountRaw !== null && snapshot.amountView !== null
}
