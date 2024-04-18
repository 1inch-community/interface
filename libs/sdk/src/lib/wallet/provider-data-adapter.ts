import {
  ChainId,
  EIP1193Provider,
  EIP6963ProviderInfo,
  IDataAdapter,
  IProviderDataAdapterInternal
} from '@one-inch-community/models';
import { BehaviorSubject, filter, from, map, Observable, of, shareReplay, startWith, switchMap, combineLatest } from 'rxjs';
import { Address, ProviderRpcError } from 'viem';
import { fromEIP1193Event } from './from-eip1193-event';

export class ProviderDataAdapter implements IDataAdapter, IProviderDataAdapterInternal {

  private readonly provider$ = new BehaviorSubject<EIP1193Provider | null>(null)
  private readonly activeAddressInner$ = new BehaviorSubject<Address | null>(null)

  readonly info$: Observable<EIP6963ProviderInfo>

  readonly addresses$: Observable<Address[]> = this.provider$.pipe(
    switchMap(provider => {
      if (!provider) return of([]);
      return from(this.getAddresses()).pipe(
        switchMap(addresses => fromEIP1193Event(provider, 'accountsChanged').pipe(
          startWith(addresses)
        ))
      )
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly activeAddress$: Observable<Address> = combineLatest([
    this.addresses$,
    this.activeAddressInner$
  ]).pipe(
    map(([ addresses, activeAddress ]) => {
      if (activeAddress) return activeAddress
      return addresses[0];
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly chainId$: Observable<ChainId | null> = this.provider$.pipe(
    switchMap(provider => {
      if (!provider) return of(null);
      return from(this.getChainId()).pipe(
        switchMap(chainId => fromEIP1193Event(provider, 'chainChanged').pipe(
          map(chainStr => parseInt(chainStr, 16)),
          startWith(chainId),
        ))
      )
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly disconnect$: Observable<ProviderRpcError> = this.provider$.pipe(
    filter(Boolean),
    switchMap(provider => fromEIP1193Event(provider, 'disconnect'))
  );

  readonly isConnected$ = this.activeAddress$.pipe(
    map(address => !!address),
  )

  constructor(private readonly info: EIP6963ProviderInfo) {
    this.info$ = of(info);
  }

  getInfo() {
    return this.info;
  }

  setProvider(provider: EIP1193Provider | null): void {
    this.provider$.next(provider)
  }

  async getAddresses(): Promise<Address[]> {
    const provider = this.provider$.value
    if (!provider) return []
    return await provider.request({ method: 'eth_accounts' })
  }

  async getActiveAddress(): Promise<Address | null> {
    const activeAddressInner = this.activeAddressInner$.value
    if (activeAddressInner) {
      return activeAddressInner
    }
    const addresses = await this.getAddresses();
    return addresses[0] ?? null;
  }

  async getChainId(): Promise<ChainId | null> {
    const provider = this.provider$.value
    if (!provider) return null
    const chainStr = await provider.request({ method: 'eth_chainId' }).catch(() => null);
    if (!chainStr) return null
    return parseInt(chainStr, 16);
  }

  async isConnected() {
    const address = await this.getActiveAddress()
    return !!address;
  }

  setActiveAddress(address: Address | null): void {
    this.activeAddressInner$.next(address)
  }

}