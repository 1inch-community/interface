import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {ModalRef, refModalToken } from '../../../shared/services/modal';
import {
    WalletConfigItem,
    WalletConnectionHandler,
    WalletSupportedConfig,
    WalletSupportedConfigToken
} from "@1inch/v3/core/wallet";
import {ButtonComponent} from "@1inch/v3/view/shared";


@Component({
    selector: 'inch-wallet-connection',
    standalone: true,
  imports: [CommonModule, NgOptimizedImage, ButtonComponent],
    templateUrl: './wallet-connection.component.html',
    styleUrls: ['./wallet-connection.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletConnectionComponent {

    constructor(
        @Inject(refModalToken) private readonly ref: ModalRef,
        @Inject(WalletSupportedConfigToken) protected readonly config: WalletSupportedConfig,
        private readonly wallet: WalletConnectionHandler
    ) {}

    protected async onConnect(item: WalletConfigItem) {
        try {
            const isConnectComplete = await this.wallet.connect(item);
            isConnectComplete && this.ref.close();
        } catch (error) {
            console.warn(error);
        }
    }

}
