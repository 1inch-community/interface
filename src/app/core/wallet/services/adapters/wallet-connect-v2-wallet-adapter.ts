import { inject } from '@angular/core';
import type {
    ConnectOps,
    EthereumProvider,
    EthereumProviderOptions,
} from '@walletconnect/ethereum-provider/dist/types/EthereumProvider';
import { BehaviorSubject, Observable } from 'rxjs';
import { Address, ProviderRpcError, WalletClient } from 'viem';

import {createClientAndSyncChain, getViemChainId, selectAccounts, selectChainId, selectDisconnect} from '../../utils';
import {ChainId, WalletAdapter, WalletConfigItemWalletConnectV2} from '../../models';
import {WalletConfigItemToken} from "@1inch/v3/core/wallet";

const projectId = 'b861faab3c79d104aca95bf92ce62e4e';

export const walletConnectClientMeta: any = {
    name: '1inch | Address NFT',
    // eslint-disable-next-line max-len
    description: '',
    url: 'https://address-nft-staging.1inch.io',
    icons: [
        'https://address-nft-staging.1inch.io/assets/images/logo.svg',
        'https://app.1inch.io/assets/images/1inch_logo_without_text.svg',
        'https://app.1inch.io/assets/images/logo.png',
    ],
};

export interface ChainConfigItem {
    chainId: ChainId;
    displayName: string
}

export const chainConfig: ChainConfigItem[] = [
    {
        chainId: ChainId.ethereumMainnet,
        displayName: 'Ethereum',
    },
    {
        chainId: ChainId.polygonMainnet,
        displayName: 'Polygon',
    },
    {
        chainId: ChainId.binanceMainnet,
        displayName: 'BSC',
    },
];

const optionalChains = chainConfig
    .filter(item => item.chainId !== ChainId.ethereumMainnet)
    .map(item => item.chainId);

export class WalletConnectV2WalletAdapter implements WalletAdapter {

    private innerClient?: WalletClient;

    private readonly provider$ = new BehaviorSubject<EthereumProvider | null>(null);

    private readonly config = inject<WalletConfigItemWalletConnectV2>(WalletConfigItemToken);

    readonly addresses$: Observable<Address[]> = selectAccounts(
        this.provider$,
        () => this.innerClient!
    );

    readonly chainId$: Observable<ChainId> = selectChainId(
        this.provider$,
        () => this.innerClient!
    );

    private get provider() {
        return this.provider$.value;
    }

    readonly disconnect$: Observable<ProviderRpcError> = selectDisconnect(this.provider$);

    get client() {
        return this.innerClient;
    }

    async connect(chainId: ChainId): Promise<boolean> {
        try {
            const WalletConnectProvider = await WalletConnectV2WalletAdapter.getModule();
            const provider = await WalletConnectProvider.init(this.getProviderOptions());
            if (provider.session === undefined) {
                await provider.connect(this.getProviderConnectParams());
            }
            if (this.config.walletMetaName && this.config.walletMetaName !== getWalletMetaName(provider)) {
                await this.disconnect();
                return false;
            }
            this.innerClient = await createClientAndSyncChain(chainId, provider);
            this.provider$.next(provider);
            return true;
        } catch (error) {
            return false;
        }
    }

    async disconnect(): Promise<void> {
        if (this.provider) {
            await this.provider.disconnect();
            this.provider$.next(null);
        }
        if (this.innerClient) {
            this.innerClient = undefined;
        }
    }

    async changeChainId(chainId: ChainId): Promise<boolean> {
        if (!this.innerClient) throw new Error('No client');
        await this.innerClient.switchChain(getViemChainId(chainId));
        return true
    }

    async isProviderConnected(): Promise<boolean> {
        const WalletConnectProvider = await WalletConnectV2WalletAdapter.getModule();
        const provider = await WalletConnectProvider.init(this.getProviderOptions());
        return provider.session !== undefined;
    }

    async chainIdFromProvider(): Promise<number | null> {
        const WalletConnectProvider = await WalletConnectV2WalletAdapter.getModule();
        const provider = await WalletConnectProvider.init(this.getProviderOptions());
        return provider.chainId;
    }

    protected getProviderConnectParams(): ConnectOps {
        return {
            chains: [ChainId.ethereumMainnet],
            optionalChains: [...optionalChains],
            rpcMap: {}, // TODO
        };
    }

    protected getProviderOptions(): EthereumProviderOptions {
        return {
            showQrModal: true,
            projectId,
            chains: [ChainId.ethereumMainnet],
            optionalChains: [...optionalChains],
            rpcMap: {}, // TODO
            metadata: walletConnectClientMeta,
            qrModalOptions: {
                themeMode: 'light',
                themeVariables: {
                    '--wcm-z-index': '1000',
                } as any,
                mobileWallets: [
                    {
                        id: 'customInchWallet',
                        name: '1inch Wallet',
                        links: {
                            native: 'oneinch://',
                            universal: 'https://wallet.1inch.io/',
                        },
                    },
                ],
                walletImages: {
                    'customInchWallet': 'assets/images/inch-wc2-logo.webp',
                },
            },
            methods: [
                'eth_sendTransaction',
                'eth_signTransaction',
                'eth_sign',
                'personal_sign',
            ],
            events: ['accountsChanged'],
        };
    }

    static getModule(): Promise<typeof EthereumProvider> {
        return import('@walletconnect/ethereum-provider').then(m => m.default);
    }

    fastReconnectAvailable(chainId: ChainId): Promise<boolean> | boolean {
        return false;
    }

    getNativeProvider(): unknown | null {
        return undefined;
    }
}

export function getWalletMetaName(currentProvider: EthereumProvider): string {
    return currentProvider?.session?.peer?.metadata?.name ?? '';
}
