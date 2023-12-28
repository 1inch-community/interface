import { inject, NgZone } from '@angular/core';
import { filter, from, map, Observable, of, shareReplay, startWith, switchMap, take } from 'rxjs';
import { Address, ProviderRpcError, WalletClient } from 'viem';
import {fromEIP1193Event} from "./from-eip1193-event";
import {ChainId, Provider} from "../models";

export function selectAccounts(
    provider$: Observable<Provider | null>,
    clientGetter: () => WalletClient
): Observable<Address[]> {
    const zone = inject(NgZone);
    return provider$.pipe(
        switchMap((provider) => {
            if (provider === null) return of([] as Address[]);
            const client = clientGetter();
            return from(client.getAddresses()).pipe(
                switchMap(currentAddresses => fromEIP1193Event(provider, 'accountsChanged', zone).pipe(
                    startWith(currentAddresses)
                ))
            );
        }),
        shareReplay({ bufferSize: 1, refCount: true })
    );
}

export function selectChainId(
    provider$: Observable<Provider | null>,
    clientGetter: () => WalletClient
): Observable<ChainId> {
    const zone = inject(NgZone);
    return provider$.pipe(
        filter(Boolean),
        switchMap(provider => {
            const client = clientGetter();
            return from(client.getChainId()).pipe(
                switchMap(chainId => fromEIP1193Event(provider, 'chainChanged', zone).pipe(
                    map(chainStr => parseInt(chainStr, 16)),
                    startWith(chainId),
                ))
            )
        }),
        shareReplay({ bufferSize: 1, refCount: true })
    );
}

export function selectDisconnect(provider$: Observable<Provider | null>): Observable<ProviderRpcError> {
    const zone = inject(NgZone);
    return provider$.pipe(
        filter(Boolean),
        switchMap(provider => fromEIP1193Event(provider, 'disconnect', zone).pipe(
            take(1)
        ))
    );
}
