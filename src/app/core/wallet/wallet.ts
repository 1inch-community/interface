import {WalletSupportedConfig} from "./models";
import {WalletSupportedConfigToken} from "./injection-tokens";
import {initializedProvider} from "@1inch/v3/core/shared";
import {WalletRestoreConnectController} from "./services/wallet-restore-connect.controller";
import {WalletSyncChainFromWalletService} from "./services/wallet-sync-chain-from-wallet.service";
import {PriorityFeeHolderService} from "./services/priority-fee-holder.service";

export function provideWallet(config: WalletSupportedConfig) {
  return [
    {
      provide: WalletSupportedConfigToken,
      useValue: config
    },
    initializedProvider([
      WalletRestoreConnectController,
      WalletSyncChainFromWalletService,
      PriorityFeeHolderService
    ])
  ]
}
