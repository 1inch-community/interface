import {inject, Injectable} from "@angular/core";
import {Initialized, RouteHelperService} from "@1inch/v3/core/shared";
import {WalletDataService} from "@1inch/v3/core/wallet";
import {filter, switchMap} from "rxjs";

const startTime = Date.now()

@Injectable()
export class WalletSyncChainFromWalletService implements Initialized {

  private readonly walletData = inject(WalletDataService)
  private readonly routeHelperService = inject(RouteHelperService)

  initialize() {
    this.walletData.isConnected$.pipe(
      switchMap((isConnected) => {
        if (!isConnected) return []
        return this.walletData.chainId$.pipe(
          filter(() => Date.now() - startTime > 3000),
          switchMap(chainId => this.routeHelperService.updatePathAndRedirect({ chainId }))
        )
      })
    ).subscribe()
  }

}
