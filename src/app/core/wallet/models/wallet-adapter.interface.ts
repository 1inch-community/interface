import { Observable } from 'rxjs';
import { Address, ProviderRpcError, WalletClient } from 'viem';
import {ChainId} from "./chain-id.enum";

export interface WalletAdapter<P = unknown> {
    readonly client: WalletClient | undefined;
    readonly chainId$: Observable<ChainId>;
    readonly addresses$: Observable<Address[]>;
    readonly disconnect$: Observable<ProviderRpcError>;

    isProviderConnected(chainId: ChainId): Promise<boolean>;

    fastReconnectAvailable(chainId: ChainId): Promise<boolean> | boolean;

    connect(chainId: ChainId): Promise<boolean> | boolean;

    disconnect(): void | Promise<void>;

    changeChainId(chainId: ChainId): Promise<boolean>;

    getNativeProvider(): P | null
}
