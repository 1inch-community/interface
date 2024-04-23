import { ChainId, IConnectWalletControllerInternal, IDataAdapter, IGlobalDataAdapterInternal, IGlobalDataAdapter, EIP6963ProviderInfo } from '@one-inch-community/models';
import {
  BehaviorSubject,
  defaultIfEmpty, defer,
  distinctUntilChanged,
  firstValueFrom,
  map,
  Observable,
  of,
  shareReplay, startWith,
  switchMap,
  takeUntil,
  timer,
  combineLatest, tap, subscribeOn, asapScheduler, filter
} from 'rxjs';
import { Address, isAddressEqual, ProviderRpcError } from 'viem';
import { getChainIdFromStorage, setActiveAddress, setChainIdInStorage } from './storage';
import { adapterId } from './adapter-id';

export class GlobalDataAdapter implements IDataAdapter, IGlobalDataAdapterInternal, IGlobalDataAdapter {

  private chainIdInner$ = new BehaviorSubject<ChainId>(getChainIdFromStorage() ?? ChainId.eth);

  private readonly currentActiveAdapter$ = defer(() => this.dataProvider.update$).pipe(
    startWith(null),
    map(() => this.dataProvider.currentActiveAdapter),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private readonly currentActiveAdapterData$ = this.currentActiveAdapter$.pipe(
    map(adapter => adapter?.data ?? null),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly info$ = this.currentActiveAdapterData$.pipe(
    filter(Boolean),
    switchMap(data => data.info$)
  )

  readonly addresses$: Observable<Address[]> = this.currentActiveAdapterData$.pipe(
    switchMap(data => data?.addresses$ ?? of([])),
    tap(a => console.log(a)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly activeAddress$: Observable<Address | null> = this.currentActiveAdapterData$.pipe(
    switchMap(data => data?.activeAddress$ ?? of(null)),
    tap(address => address && setActiveAddress(address)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly chainId$: Observable<ChainId | null> = combineLatest([
    this.currentActiveAdapterData$,
    this.chainIdInner$
  ]).pipe(
    switchMap(([data, chainId]) => data?.chainId$ ?? of(chainId)),
    tap(chainId => chainId && setChainIdInStorage(chainId)),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  readonly disconnect$: Observable<ProviderRpcError> = this.currentActiveAdapterData$.pipe(
    switchMap(data => data?.disconnect$ ?? of()),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly isConnected$: Observable<boolean> = this.currentActiveAdapterData$.pipe(
    switchMap(data => data?.isConnected$ ?? of(false)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(private readonly dataProvider: IConnectWalletControllerInternal) {
    combineLatest([
      this.activeAddress$,
      this.chainId$,
    ]).pipe(
      subscribeOn(asapScheduler)
    ).subscribe()
  }

  getInfo() {
    if (!this.dataProvider.currentActiveAdapter) throw new Error('')
    return this.dataProvider.currentActiveAdapter.data.getInfo()
  }

  async getAddresses(): Promise<Address[]> {
    const data = await this.getProviderDataAdapter()
    if (!data) return []
    return await data.getAddresses()
  }

  async getActiveAddress(): Promise<Address | null> {
    if (!this.dataProvider.currentActiveAdapter) {
      return null
    }
    const data = await this.getProviderDataAdapter()
    if (!data) return null
    return await data.getActiveAddress()
  }

  async getChainId(): Promise<ChainId> {
    if (!this.dataProvider.currentActiveAdapter) {
      return this.chainIdInner$.value
    }
    const data = await this.getProviderDataAdapter()
    if (!data) return this.chainIdInner$.value
    const chainId = await data.getChainId()
    if (!chainId) return this.chainIdInner$.value
    return chainId
  }

  async isConnected(): Promise<boolean> {
    if (!this.dataProvider.currentActiveAdapter) {
      return false
    }
    const data = await this.getProviderDataAdapter()
    if (!data) return false
    return await data.isConnected()
  }

  async isActiveAddress(info: EIP6963ProviderInfo, address: Address): Promise<boolean> {
    const id = adapterId(info)
    const activeAddress = await this.dataProvider.currentActiveAdapter?.data.getActiveAddress() ?? null
    const activeAdapterInfo = this.dataProvider.currentActiveAdapter?.data.getInfo() ?? null
    const activeAdapterId = activeAdapterInfo ? adapterId(activeAdapterInfo) : null
    return !!activeAddress && !!activeAdapterId && id === activeAdapterId && isAddressEqual(activeAddress, address)
  }

  isActiveWallet(info: EIP6963ProviderInfo): boolean {
    const id = adapterId(info)
    const activeAdapterInfo = this.dataProvider.currentActiveAdapter?.data.getInfo() ?? null
    const activeAdapterId = activeAdapterInfo ? adapterId(activeAdapterInfo) : null
    return !!activeAdapterId && activeAdapterId === id
  }

  isActiveAddress$(info: EIP6963ProviderInfo, address: `0x${string}`): Observable<boolean> {
    const id = adapterId(info)
    return combineLatest([
      this.currentActiveAdapter$,
      this.activeAddress$
    ]).pipe(
      map(([ adapter, activeAddress ]) => {
        const activeAdapterId = adapter ? adapterId(adapter.data.getInfo()) : null
        return !!activeAddress && !!activeAdapterId && id === activeAdapterId && isAddressEqual(activeAddress, address)
      })
    )
  }

  isActiveWallet$(info: EIP6963ProviderInfo): Observable<boolean> {
    const id = adapterId(info)
    return this.currentActiveAdapter$.pipe(
      map(adapter => {
        const activeAdapterId = adapter ? adapterId(adapter.data.getInfo()) : null
        return !!activeAdapterId && activeAdapterId === id
      })
    )
  }

  setChainId(chainId: ChainId): void {
    this.chainIdInner$.next(chainId)
  }

  private getProviderDataAdapter() {
    return firstValueFrom(this.currentActiveAdapterData$.pipe(
      takeUntil(timer(0)),
      defaultIfEmpty(null)
    ))
  }


}