import {Injectable} from "@angular/core";
import {ChainId} from "../models";
import {filter, map, Observable, Subject} from "rxjs";

export enum WalletEventsType {
    connectStart,
    connectComplete,
    connectError,
    reconnectStart,
    reconnectComplete,
    reconnectError,
    changeChainIdStart,
    changeChainIdComplete,
    changeChainIdError,
    disconnectStart,
    disconnectComplete,
    disconnectError,
}

export type WalletEventsTypePayload = {
    [WalletEventsType.connectStart]: { chainId: ChainId }
    [WalletEventsType.connectComplete]: { walletItemId: string, chainId: ChainId }
    [WalletEventsType.connectError]: { chainId: ChainId }
    [WalletEventsType.reconnectStart]: { chainId: ChainId }
    [WalletEventsType.reconnectComplete]: { walletItemId: string, chainId: ChainId }
    [WalletEventsType.reconnectError]: { chainId: ChainId }
    [WalletEventsType.changeChainIdStart]: { chainId: ChainId }
    [WalletEventsType.changeChainIdComplete]: { chainId: ChainId }
    [WalletEventsType.changeChainIdError]: { chainId: ChainId }
    [WalletEventsType.disconnectStart]: null
    [WalletEventsType.disconnectComplete]: null
    [WalletEventsType.disconnectError]: null
}

@Injectable({
    providedIn: "root"
})
export class WalletEvents {

    private readonly emitter$: Subject<{type: WalletEventsType, payload: unknown}> = new Subject()

    listen<E extends WalletEventsType>(type: E): Observable<WalletEventsTypePayload[E]> {
        return this.emitter$.pipe(
            filter((event) => event.type === type),
            map(event => event.payload as WalletEventsTypePayload[E])
        )
    }

    emit<E extends WalletEventsType>(type: E, payload: WalletEventsTypePayload[E]): void {
        this.emitter$.next({ type, payload })
    }

}
