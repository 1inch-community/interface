import { IConnectWalletController } from '@one-inch-community/models';
import { ISwapContextStrategy } from './models/swap-context-strategy.interface';
import { PairHolder } from './pair-holder';
import {
  combineLatest,
  debounceTime,
  defer,
  distinctUntilChanged,
  map, scan,
  shareReplay,
  switchMap,
  withLatestFrom
} from 'rxjs';
import { BigMath, OneInchDevPortalAdapter } from '../utils';
import { SwapContextOnChainStrategy } from './swap-context-onchain.strategy';
import { TokenController } from '../tokens';

export class SwapContextFusionStrategy implements ISwapContextStrategy {

  private readonly sourceTokenAmount$ = combineLatest([
    this.walletController.data.chainId$,
    this.walletController.data.activeAddress$,
    this.pairHolder.streamSnapshot('source')
  ]).pipe(
    switchMap(([chainId, activeAddress, snapshot ]) => {
      const token = snapshot.token
      if (!chainId || !activeAddress || !token) return [0n]
      return TokenController.liveQuery(() => TokenController.getTokenBalance(chainId, token.address, activeAddress).then(record => BigInt(record?.amount ?? '0')))
    })
  )

  private readonly quoteReceive$ = defer(() => combineLatest([
    this.walletController.data.chainId$,
    this.walletController.data.activeAddress$,
    this.pairHolder.streamSnapshot('source'),
    this.pairHolder.streamSnapshot('destination'),
    this.sourceTokenAmount$
  ])).pipe(
    debounceTime(0),
    switchMap(([ chainId, activeAddress, sourceTokenSnapshot, destinationTokenSnapshot, sourceTokenBalance ]) => {
      const sourceToken = sourceTokenSnapshot.token
      const destinationToken = destinationTokenSnapshot.token
      const amount = sourceTokenSnapshot.amountRaw
      if (!amount || !chainId || !activeAddress || !sourceToken || !destinationToken || amount === 0n || sourceTokenBalance === 0n || amount > sourceTokenBalance) return [null]
      return this.devPortalAdapter.getFusionQuoteReceive(
        chainId,
        sourceToken.address,
        destinationToken.address,
        amount,
        activeAddress
      )
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  )

  private readonly recommendedPreset$ = this.quoteReceive$.pipe(
    map(quoteReceive => {
      if (!quoteReceive) return null
      return quoteReceive.presets[quoteReceive.recommended_preset] ?? null
    }),
    distinctUntilChanged()
  )

  private readonly averageDestinationTokenAmount$ = this.recommendedPreset$.pipe(
    map(preset => {
      if (!preset) return 0n
      const auctionStartAmount = BigInt(preset.auctionStartAmount)
      const auctionEndAmount = BigInt(preset.auctionEndAmount)
      return (auctionStartAmount + auctionEndAmount) / 2n
    })
  )

  readonly rate$ = combineLatest([
    this.quoteReceive$,
    this.averageDestinationTokenAmount$
  ]).pipe(
    debounceTime(0),
    withLatestFrom(this.pairHolder.streamSnapshot('source'), this.pairHolder.streamSnapshot('destination')),
    scan((previousValue: null | bigint, [ [ quoteReceive, averageDestinationTokenAmount ], sourceTokenSnapshot, destinationTokenSnapshot ]) => {
      const sourceToken = sourceTokenSnapshot.token
      const destinationToken = destinationTokenSnapshot.token
      if (!quoteReceive || !sourceToken || !destinationToken) return null
      const sourceTokenAmount = BigInt(quoteReceive.fromTokenAmount)
      return BigMath.dev(
        averageDestinationTokenAmount,
        sourceTokenAmount,
        destinationToken.decimals,
        sourceToken.decimals,
      )
    }, null),
    switchMap(rate => {
      if (!rate) return this.fallback.rate$
      return [rate]
    })
  )

  constructor(
    private readonly pairHolder: PairHolder,
    private readonly walletController: IConnectWalletController,
    private readonly devPortalAdapter = new OneInchDevPortalAdapter(),
    private readonly fallback = new SwapContextOnChainStrategy(pairHolder, walletController)
  ) {
  }

  destroy() {
    //
  }

}
