import { ChainId, ISelectTokenContext } from '@one-inch-community/models';
import { TokenController } from '@one-inch-community/sdk';
import { ReplaySubject, Subject, BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import { Address } from 'viem';

export class SelectTokenContext implements ISelectTokenContext {

  readonly chainId$: Subject<ChainId> = new ReplaySubject(1);
  readonly connectedWalletAddress$: Subject<Address | null> = new BehaviorSubject<Address | null>(null);

  readonly tokenAddressList$ = combineLatest([
    this.chainId$,
    this.connectedWalletAddress$,
  ]).pipe(
    switchMap(([ chainId, address ]) => TokenController.getSortedForViewTokenAddresses(chainId, address ?? undefined))
  )

  setChainId(chainId: ChainId): void {
    this.chainId$.next(chainId)
  }

  setConnectedWalletAddress(address?: Address | undefined): void {
    this.connectedWalletAddress$.next(address ?? null)
  }



}