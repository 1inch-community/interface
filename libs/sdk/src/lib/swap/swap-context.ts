import { IConnectWalletController, ISwapContext, IToken, ITokenRateProvider, Pair } from '@one-inch-community/models';
import {
  defer,
  distinctUntilChanged,
  map, merge,
  Observable, Subscription
} from 'rxjs';
import { buildDefaultTokenRageProvider } from '../tokens';
import { PairHolder, TokenType } from './pair-holder';

export class SwapContext implements ISwapContext {

  private readonly pairHolder = new PairHolder()
  private readonly subscription = new Subscription()

  readonly chainId$ = defer(() => this.walletController.data.chainId$);
  readonly connectedWalletAddress$ = defer(() => this.walletController.data.activeAddress$);

  constructor(
    private readonly walletController: IConnectWalletController,
    private readonly rateProvider: ITokenRateProvider = buildDefaultTokenRageProvider()
  ) {
    this.subscription.add(
      merge(

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