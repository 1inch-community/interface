import {Injectable} from "@angular/core";
import {Initialized} from "@1inch/v3/core/shared";
import {WalletDataService} from "@1inch/v3/core/wallet";
import {catchError, debounceTime, distinctUntilChanged, switchMap, combineLatest, filter} from "rxjs";
import {TokenDataUpdateService} from "./token-data-update.service";

@Injectable()
export class TokenUpdateHandler implements Initialized {

  constructor(private readonly walletData: WalletDataService,
              private readonly tokenDataUpdateService: TokenDataUpdateService) {
  }

  initialize(): void {
    this.walletData.chainId$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap(chainId => this.tokenDataUpdateService.updateTokenList(chainId)),
      catchError((error) => [console.error(error)])
    ).subscribe()
    combineLatest([
      this.walletData.chainId$,
      this.walletData.currentAddress$.pipe(filter(Boolean))
    ]).pipe(
        debounceTime(100),
        distinctUntilChanged(),
        switchMap(([ chainId, walletAddress ]) => this.tokenDataUpdateService.updateBalances(chainId, walletAddress)),
        catchError((error) => [console.error(error)])
    ).subscribe()
  }

}
