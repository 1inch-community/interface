import { Injectable } from '@angular/core';
import {
    combineLatest,
    distinctUntilChanged,
    firstValueFrom,
    map,
    Observable,
    of,
    shareReplay,
    switchMap,
} from 'rxjs';
import { Address } from 'viem';
import { WalletConnectionHandler } from './wallet-connection.handler';
import {ChainId, WalletAdapter} from "../models";

@Injectable({
    providedIn: "root"
})
export class WalletDataService {

    private readonly currentWalletAdapter$ = this.handler.currentWalletAdapter$;
    private readonly appChainId$ = this.handler.appChainId$;

    readonly addresses$: Observable<Address[]> = this.buildAddressesStream().pipe(
        shareReplay({ bufferSize: 1, refCount: true })
    )

    readonly currentAddress$: Observable<Address | null> = this.buildCurrentAddressStream().pipe(
        distinctUntilChanged(),
        shareReplay(1)
    )

    readonly isConnected$: Observable<boolean> = this.buildIsConnectedStream().pipe(
        distinctUntilChanged(),
    )

    readonly chainId$: Observable<ChainId> = this.buildChainIdStream().pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    )

    constructor(private readonly handler: WalletConnectionHandler) {
    }

    async getAccounts() {
        return await firstValueFrom(this.buildAddressesStream())
    }

    async getCurrentAddress() {
        return await firstValueFrom(this.buildCurrentAddressStream())
    }

    async isConnected() {
        return await firstValueFrom(this.buildIsConnectedStream())
    }

    async getChainId() {
        return await firstValueFrom(this.buildChainIdStream())
    }

    async getNativeProvider<P>(): Promise<P | null> {
        const currentWalletAdapter = await firstValueFrom(this.currentWalletAdapter$) as WalletAdapter<P> | null
        if (!currentWalletAdapter) {
            return null;
        }
        return currentWalletAdapter.getNativeProvider()
    }

    private buildAddressesStream(): Observable<Address[]> {
        return this.currentWalletAdapter$.pipe(
            switchMap(adapter => {
                if (adapter === null) return of([])
                return adapter.addresses$
            }),
        )
    }

    private buildCurrentAddressStream(): Observable<Address | null> {
        return this.buildAddressesStream().pipe(
            map(accounts => accounts[0] ?? null),
        )
    }

    private buildIsConnectedStream(): Observable<boolean> {
        return this.buildAddressesStream().pipe(
            map(accounts => accounts.length > 0)
        )
    }

    private buildChainIdStream(): Observable<ChainId> {
        return combineLatest([
            this.currentWalletAdapter$,
            this.appChainId$,
            this.buildIsConnectedStream()
        ]).pipe(
            switchMap(([adapter, appChainId, isConnected]) => {
                if (adapter !== null && isConnected) {
                    return adapter.chainId$;
                }
                return of(appChainId);
            })
        )
    }

}
