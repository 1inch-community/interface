import {inject, Injectable} from "@angular/core";
import {WalletConnectionHandler} from "./wallet-connection.handler";
import {Initialized} from "../../shared/initialized";
import {WalletSupportedConfigToken} from "../injection-tokens";
import {ChainId} from "../models";
import {LocalStorage} from "ngx-webstorage";
import {WalletEvents, WalletEventsType} from "@1inch/v3/core/wallet";

@Injectable({
    providedIn: "root"
})
export class WalletRestoreConnectController implements Initialized {

    @LocalStorage('lastConnectedWallet', null)
    protected lastConnectedWalletId!: string | null

    @LocalStorage('lastChainId', null)
    protected lastChainId!: string | null

    private readonly wallet = inject(WalletConnectionHandler)
    private readonly events = inject(WalletEvents)
    private readonly config = inject(WalletSupportedConfigToken, { optional: true })

    async initialize(): Promise<void> {
        this.events.listen(WalletEventsType.connectComplete).subscribe(({ chainId, walletItemId }) => {
            this.lastChainId = chainId.toString()
            this.lastConnectedWalletId = walletItemId
        })
      this.events.listen(WalletEventsType.changeChainIdComplete).subscribe(({ chainId }) => {
        this.lastChainId = chainId.toString()
      })
        if (!this.config) {
            throw new Error('For use restore wallet connection you need specify the configuration of supported wallets')
        }
        const walletId = this.lastConnectedWalletId
        if (!walletId) return;
        const chainId = +(this.lastChainId ?? ChainId.ethereumMainnet) as ChainId
        const walletItem = this.config.find(item => item.id === walletId);
        if (!walletItem) return;
        if (await this.wallet.fastReconnectAvailable(walletItem, chainId)) {
            await this.wallet.reconnect(walletItem, chainId)
        } else {
            this.wallet.reconnect(walletItem, chainId).catch(error => console.warn(error))
        }
    }

}
