import {BehaviorSubject, Observable,} from 'rxjs';
import {Address, ProviderRpcError, WalletClient} from 'viem';
import {ChainId, EIP1193Provider, WalletAdapter} from "../../models";
import {createClientAndSyncChain, getViemChainId, selectAccounts, selectChainId, selectDisconnect} from "../../utils";

export class InjectedWalletAdapter implements WalletAdapter {

    private innerClient?: WalletClient;

    private readonly provider$ = new BehaviorSubject<EIP1193Provider | null>(null);

    readonly addresses$: Observable<Address[]> = selectAccounts(
        this.provider$,
        () => this.innerClient!
    );

    readonly chainId$: Observable<ChainId> = selectChainId(
        this.provider$,
        () => this.innerClient!
    );

    readonly disconnect$: Observable<ProviderRpcError> = selectDisconnect(this.provider$);

    get client(): WalletClient | undefined {
        return this.innerClient;
    }

    async connect(chainId: ChainId): Promise<boolean> {
        try {
            if (this.innerClient) {
                this.disconnect();
            }
            const provider = window.ethereum;
            if (!provider) throw new Error('No provider');
            this.innerClient = await createClientAndSyncChain(chainId, provider);
            this.provider$.next(provider);
            return true;
        } catch (error) {
            return false;
        }
    }

    disconnect(): void {
        if (!this.innerClient) return;
        this.innerClient = undefined;
        this.provider$.next(null);
    }

    async changeChainId(chainId: ChainId): Promise<boolean> {
        if (!this.innerClient) return false;
        try {
            await this.innerClient.switchChain(getViemChainId(chainId));
            return true
        } catch (error) {
            console.warn(error)
            return false
        }

    }

    async isProviderConnected(): Promise<boolean> {
        const provider = window.ethereum;
        if (!provider) return false;
        try {
            const accounts = await provider.request({ method: 'eth_accounts' });
            return accounts.length > 0;
        } catch {
            return false;
        }
    }

    fastReconnectAvailable(): boolean {
        const provider = window.ethereum;
        if (!provider) return false;
        return !isNaN(parseInt(`${provider.chainId}`, 10));
    }

    getMetaInfo() {
        return {
            email: 'injected@wallet.com',
            name: 'injected wallet'
        }
    }

    getNativeProvider(): unknown | null {
        return null
    }
}
