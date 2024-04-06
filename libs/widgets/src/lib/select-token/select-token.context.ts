import { ChainId, ISelectTokenContext } from '@one-inch-community/models';
import { TokenController } from '@one-inch-community/sdk';
import { ReplaySubject, Subject, BehaviorSubject, combineLatest, switchMap, map, tap, defer, mergeMap } from 'rxjs';
import { Address, formatUnits } from 'viem';

export class SelectTokenContext implements ISelectTokenContext {

  readonly chainId$: Subject<ChainId> = new ReplaySubject(1);
  readonly connectedWalletAddress$: Subject<Address | null> = new BehaviorSubject<Address | null>(null);

  readonly favoriteTokens$ = this.chainId$.pipe(
    mergeMap(chainId => {
      return TokenController.liveQuery( () => TokenController.getAllFavoriteTokenAddresses(chainId))
    }),
  )

  readonly tokenAddressList$ = combineLatest([
    this.chainId$.pipe(
      // switchMap(chainId => getBlockEmitter(chainId).pipe(
      //   map(() => chainId)
      // ))
    ),
    this.connectedWalletAddress$,
  ]).pipe(
    switchMap( async ([ chainId, address ]) => {
      console.log('next')
      const result = await TokenController.getSortedForViewTokenAddresses(chainId, address ?? undefined)
      if (address) {
        const prices = await TokenController.getTokenUSDPrices(chainId, result.notZero)
        const tokens = await TokenController.getTokenMap(chainId, result.notZero)
        const balances = await TokenController.getTokenBalanceMap(chainId, address, result.notZero)
        const favoriteTokenList = await TokenController.getAllFavoriteTokenAddresses(chainId)
        const favoriteTokenSet = new Set(favoriteTokenList)
        const tokenAmount: Record<Address, number> = {}
        for (const address of result.notZero) {
          const token = tokens[address]
          const tokenPrice = prices[address]
          const balance = formatUnits(balances[address], token.decimals)
          tokenAmount[address] = Number(balance) * Number(tokenPrice)
        }
        return [
          ...result.notZero.sort((address1, address2) => {
            const isFavoriteToken1 = favoriteTokenSet.has(address1)
            const isFavoriteToken2 = favoriteTokenSet.has(address2)
            if (isFavoriteToken1 === isFavoriteToken2) {
              return tokenAmount[address2] - tokenAmount[address1]
            }
            if (isFavoriteToken1) {
              return -1;
            }
            return 1
          }),
          ...result.zero
        ];
      }
      return [
        ...result.notZero,
        ...result.zero
      ]
    })
  )

  setChainId(chainId: ChainId): void {
    this.chainId$.next(chainId)
  }

  setConnectedWalletAddress(address?: Address | undefined): void {
    this.connectedWalletAddress$.next(address ?? null)
  }



}