import { IConnectWalletController, Rate, SwapSettings } from '@one-inch-community/models';
import { ISwapContextStrategy } from './models/swap-context-strategy.interface';
import { PairHolder } from './pair-holder';
import {
  combineLatest,
  debounceTime,
  defer,
  distinctUntilChanged,
  map, Observable,
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
    switchMap(([chainId, activeAddress, snapshot]) => {
      const token = snapshot.token;
      if (!chainId || !activeAddress || !token) return [0n];
      return TokenController.liveQuery(() => TokenController.getTokenBalance(chainId, token.address, activeAddress).then(record => BigInt(record?.amount ?? '0')));
    })
  );

  private readonly quoteReceive$ = defer(() => combineLatest([
    this.walletController.data.chainId$,
    this.walletController.data.activeAddress$,
    this.pairHolder.streamSnapshot('source'),
    this.pairHolder.streamSnapshot('destination'),
    this.sourceTokenAmount$,
  ])).pipe(
    debounceTime(300),
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
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private readonly recommendedPreset$ = this.quoteReceive$.pipe(
    map(quoteReceive => {
      if (!quoteReceive) return null;
      return quoteReceive.presets[quoteReceive.recommended_preset] ?? null;
    }),
    distinctUntilChanged()
  );

  private readonly averageDestinationTokenAmount$ = this.recommendedPreset$.pipe(
    map(preset => {
      if (!preset) return 0n;
      const auctionStartAmount = BigInt(preset.auctionStartAmount);
      const auctionEndAmount = BigInt(preset.auctionEndAmount);
      return (auctionStartAmount + auctionEndAmount) / 2n;
    })
  );

  readonly minReceive$ = combineLatest([
    this.recommendedPreset$,
    this.settings.slippage.value$.pipe(map(value => value?.[0] ?? null), distinctUntilChanged())
  ]).pipe(
    withLatestFrom(this.quoteReceive$),
    switchMap(([[preset, slippage], quoteReceive]) => {
      if (!preset || !quoteReceive) return this.fallback.minReceive$;
      const auctionEndAmount = BigInt(preset.auctionEndAmount)
      if (slippage === null) return [auctionEndAmount]
      const marketPrice = BigInt(quoteReceive.toTokenAmount)
      const percentAmount = BigMath.calculatePercentage(marketPrice, slippage)
      return [marketPrice - percentAmount];
    })
  );

  readonly rate$: Observable<Rate | null> = combineLatest([
    this.quoteReceive$,
    this.averageDestinationTokenAmount$
  ]).pipe(
    debounceTime(0),
    withLatestFrom(
      this.walletController.data.chainId$,
      this.pairHolder.streamSnapshot('source'),
      this.pairHolder.streamSnapshot('destination')
    ),
    map(([[quoteReceive, averageDestinationTokenAmount], chainId, sourceTokenSnapshot, destinationTokenSnapshot]) => {
      const sourceToken = sourceTokenSnapshot.token;
      const destinationToken = destinationTokenSnapshot.token;
      if (!quoteReceive || !sourceToken || !destinationToken || !chainId) return null;
      const sourceTokenAmount = BigInt(quoteReceive.fromTokenAmount);
      const rate = BigMath.div(
        averageDestinationTokenAmount,
        sourceTokenAmount,
        destinationToken.decimals,
        sourceToken.decimals
      );
      const revertedRate = BigMath.div(
        sourceTokenAmount,
        averageDestinationTokenAmount,
        sourceToken.decimals,
        destinationToken.decimals
      );
      return {
        chainId,
        rate,
        revertedRate,
        sourceToken,
        destinationToken,
        isReverted: false
      } as Rate;
    }),
    distinctUntilChanged(),
    switchMap(rate => {
      if (!rate) return this.fallback.rate$;
      return [rate];
    })
  );

  readonly destinationTokenAmount$ = this.quoteReceive$.pipe(
    switchMap(data => {
      if (!data) return this.fallback.destinationTokenAmount$;
      return [BigInt(data.toTokenAmount)];
    })
  );

  readonly autoSlippage$ = this.quoteReceive$.pipe(
    switchMap(data => {
      if (!data) return this.fallback.autoSlippage$;
      return [data.autoK];
    })
  );

  readonly autoAuctionTime$ = this.recommendedPreset$.pipe(
    switchMap(data => {
      if (!data) return this.fallback.autoAuctionTime$;
      return [data.auctionDuration];
    })
  );

  constructor(
    private readonly pairHolder: PairHolder,
    private readonly walletController: IConnectWalletController,
    private readonly settings: SwapSettings,
    private readonly devPortalAdapter = new OneInchDevPortalAdapter(),
    private readonly fallback = new SwapContextOnChainStrategy(pairHolder, walletController, settings)
  ) {
  }

  destroy() {
    //
  }

}
