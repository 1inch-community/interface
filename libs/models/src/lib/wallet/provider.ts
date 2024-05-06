import {
    Address,
    ProviderConnectInfo,
    ProviderMessage,
    ProviderRpcError,
} from 'viem';

declare global {
    interface Window {
        ethereum?: EIP1193Provider;
    }
}

declare global {
    interface WindowEventMap {
        "eip6963:announceProvider": CustomEvent<EIP6963ProviderDetail>;
    }
}

export type EventMap = {
    accountsChanged: Address[]
    chainChanged: string
    connect: ProviderConnectInfo
    disconnect: ProviderRpcError
    message: ProviderMessage
};

export interface RequestArguments {
    method: string;
    params?: unknown[] | Record<string, unknown> | object | undefined;
}

export type EthereumProvider = {
    request(args: RequestArguments): Promise<unknown>
    enable(): Promise<Address[]>
    chainId?: number | string
    isOneInchIOSWallet?: true
    isOneInchWallet?: true
    isTrust?: true
};

export type EIP1193Provider = EthereumProvider & {
    on<TEvent extends keyof EventMap>(
        event: TEvent,
        listener: (result: EventMap[TEvent]) => void,
    ): void
    removeListener<TEvent extends keyof EventMap>(
        event: TEvent,
        listener: (result: EventMap[TEvent]) => void,
    ): void
};

export interface EIP6963ProviderInfo {
    walletId: string
    name: string
    icon: string
    rdns?: string
    uuid?: string
}

export interface EIP6963ProviderDetail {
    info: EIP6963ProviderInfo
    provider: EIP1193Provider
}

export type Provider = EIP1193Provider | EthereumProvider;
