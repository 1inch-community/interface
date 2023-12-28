import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ButtonComponent, ModalService, PrettyHashPipe} from "@1inch/v3/view/shared";
import {WalletConnectionComponent} from "../../modal-components/wallet-connection/wallet-connection.component";
import {WalletConnectionHandler, WalletDataService} from "@1inch/v3/core/wallet";
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'inch-connect-wallet',
    standalone: true,
    imports: [
        ButtonComponent,
        AsyncPipe,
        NgIf,
        NgOptimizedImage,
        PrettyHashPipe
    ],
    templateUrl: './connect-wallet.component.html',
    styleUrl: './connect-wallet.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectWalletComponent {

    private modal = inject(ModalService)
    protected walletData = inject(WalletDataService)
    protected walletConnectionHandler = inject(WalletConnectionHandler)

    protected readonly currentWalletConfigItem$ = this.walletConnectionHandler.currentWalletConfigItem$;

    protected readonly currentAddress$ = this.walletData.currentAddress$;

    protected onOpenConnectWalletModal() {
        this.modal.open(WalletConnectionComponent, 'Wallet connect')
    }

}
