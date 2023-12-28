import {
    Address,
    ProviderConnectInfo,
    ProviderMessage,
    ProviderRpcError,
} from 'viem';

export type EventMap = {
    accountsChanged: Address[]
    chainChanged: string
    connect: ProviderConnectInfo
    disconnect: ProviderRpcError
    message: ProviderMessage
};

export type EthereumProvider = {
    request(...args: any): Promise<any>
    enable(): Promise<unknown>
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

export type Provider = EIP1193Provider | EthereumProvider;
