import { IConnectWalletController } from '@one-inch-community/models';
import { ISwapContextStrategy } from './models/swap-context-strategy.interface';
import { PairHolder } from './pair-holder';
import {
  combineLatest,
  debounceTime,
  defer,
  distinctUntilChanged,
  map,
  Observable,
  shareReplay,
  switchMap
} from 'rxjs';
import { buildDefaultTokenRageProvider } from '../tokens';
import { BigMath } from '../utils';

export class SwapContextOnChainStrategy implements ISwapContextStrategy {

  readonly rate$: Observable<bigint> = defer(() => combineLatest([
    this.walletController.data.chainId$,
    this.pairHolder.streamSnapshot('source'),
    this.pairHolder.streamSnapshot('destination')
  ])).pipe(
    debounceTime(0),
    switchMap(([chainId, sourceTokenSnapshot, destinationTokenSnapshot]) => {
      const sourceToken = sourceTokenSnapshot.token
      const destinationToken = destinationTokenSnapshot.token
      if (!sourceToken || !destinationToken || !chainId) return [0n]
      return this.rateProvider.listenOnChainRate(chainId, sourceToken, destinationToken)
    }),
    map(rate => rate ?? 0n),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  readonly revertedRate$: Observable<bigint> = defer(() => combineLatest([
    this.walletController.data.chainId$,
    this.pairHolder.streamSnapshot('source'),
    this.pairHolder.streamSnapshot('destination')
  ])).pipe(
    debounceTime(0),
    switchMap(([chainId, sourceTokenSnapshot, destinationTokenSnapshot]) => {
      const sourceToken = sourceTokenSnapshot.token
      const destinationToken = destinationTokenSnapshot.token
      if (!sourceToken || !destinationToken || !chainId) return [0n]
      return this.rateProvider.listenOnChainRevertedRate(chainId, sourceToken, destinationToken)
    }),
    map(rate => rate ?? 0n),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  readonly destinationTokenAmount$ = combineLatest([
    this.rate$.pipe(distinctUntilChanged()),
    this.pairHolder.streamSnapshot('source'),
    this.pairHolder.streamSnapshot('destination')
  ]).pipe(
    map(([rate, sourceTokenSnapshot, destinationTokenSnapshot]) => {
      const sourceToken = sourceTokenSnapshot.token
      const destinationToken = destinationTokenSnapshot.token
      const sourceTokenAmount = sourceTokenSnapshot.amountRaw
      if (!sourceTokenAmount || sourceTokenAmount === 0n || rate === 0n || !sourceToken || !destinationToken) return 0n
      return BigMath.mul(
        sourceTokenAmount,
        rate,
        sourceToken.decimals,
        sourceToken.decimals,
        destinationToken.decimals
      )
    })
  )

  constructor(
    private readonly pairHolder: PairHolder,
    private readonly walletController: IConnectWalletController,
    private readonly rateProvider = buildDefaultTokenRageProvider()
  ) {
  }

  destroy() {
    //
  }


}
