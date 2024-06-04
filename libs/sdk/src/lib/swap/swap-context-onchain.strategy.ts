import { IConnectWalletController, Rate } from '@one-inch-community/models';
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

  private readonly sourceTokenSnapshot$ = this.pairHolder.streamSnapshot('source')
  private readonly destinationTokenSnapshot$ = this.pairHolder.streamSnapshot('destination')
  private readonly sourceTokenAmount$ = this.sourceTokenSnapshot$.pipe(map(snapshot => snapshot.amountRaw), distinctUntilChanged())

  readonly rate$: Observable<Rate | null> = defer(() => combineLatest([
    this.walletController.data.chainId$,
    this.sourceTokenSnapshot$,
    this.destinationTokenSnapshot$,
  ])).pipe(
    debounceTime(0),
    switchMap(([chainId, sourceTokenSnapshot, destinationTokenSnapshot]) => {
      const sourceToken = sourceTokenSnapshot.token
      const destinationToken = destinationTokenSnapshot.token
      if (!sourceToken || !destinationToken || !chainId) return [null]
      return this.rateProvider.listenOnChainRate(chainId, sourceToken, destinationToken)
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  readonly destinationTokenAmount$ = combineLatest([
    this.rate$,
    this.sourceTokenAmount$.pipe(distinctUntilChanged())
  ]).pipe(
    map(([rate, sourceTokenAmount]) => {
      if (!rate || !sourceTokenAmount) return 0n
      const sourceToken = rate.sourceToken
      const destinationToken = rate.destinationToken
      if (rate.isReverted) {
        return BigMath.div(
          sourceTokenAmount,
          rate.revertedRate,
          sourceToken.decimals,
          destinationToken.decimals,
          destinationToken.decimals
        )
      }
      return BigMath.mul(
        sourceTokenAmount,
        rate.rate,
        sourceToken.decimals,
        sourceToken.decimals,
        destinationToken.decimals
      )
    })
  )

  readonly autoSlippage$ = combineLatest([

  ]).pipe(

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
