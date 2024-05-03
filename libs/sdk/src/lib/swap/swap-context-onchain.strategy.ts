import { IConnectWalletController } from '@one-inch-community/models';
import { ISwapContextStrategy } from './models/swap-context-strategy.interface';
import { PairHolder } from './pair-holder';
import { combineLatest, defer, map, Observable, shareReplay, switchMap } from 'rxjs';
import { buildDefaultTokenRageProvider } from '../tokens';

export class SwapContextOnChainStrategy implements ISwapContextStrategy {

  readonly rate$: Observable<bigint> = defer(() => combineLatest([
    this.walletController.data.chainId$,
    this.pairHolder.streamSnapshot('source'),
    this.pairHolder.streamSnapshot('destination')
  ])).pipe(
    switchMap(([chainId, sourceTokenSnapshot, destinationTokenSnapshot]) => {
      const sourceToken = sourceTokenSnapshot.token
      const destinationToken = destinationTokenSnapshot.token
      if (!sourceToken || !destinationToken || !chainId) return [0n]
      return this.rateProvider.listenRate(chainId, destinationToken, sourceToken)
    }),
    map(rate => rate ?? 0n),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

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