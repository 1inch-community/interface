import {auditTime, catchError, combineLatest, defer, Observable, of, startWith, Subscription, switchMap} from "rxjs";
import {Injectable} from "@angular/core";
import {ChainId, getBalance, isNativeTokenContract, WalletDataService} from "@1inch/v3/core/wallet";
import {blockStream} from "../../wallet/utils/block-stream";
import {TokenDataUpdateService} from "./token-data-update.service";
import {Token} from "../models/token";
import {Address} from "viem";
import {TransactionService} from "../../wallet/services/transaction.service";

@Injectable({
  providedIn: 'root'
})
export class TokenBalancesService {
  private subscription: Subscription | null = null

  constructor(private readonly walletData: WalletDataService,
              private readonly transactionService: TransactionService,
              private readonly tokenDataUpdateService: TokenDataUpdateService) {
  }

  private readonly update$ = combineLatest([
    this.walletData.chainId$,
    this.walletData.currentAddress$,
    this.walletData.chainId$.pipe(switchMap(chainId => blockStream(chainId).pipe(auditTime(15000))), startWith(null)),
  ]).pipe(
    switchMap(([chainId, wallet]) => {
      if (!wallet) return []
      return blockStream(chainId).pipe(
        switchMap(() => defer(() => this.tokenDataUpdateService.updateBalancesNow(chainId, wallet)).pipe(
          catchError(err => of(console.error(err)))
        )),
      )
    })
  )

  startUpdateBalances() {
    if (this.subscription) return
    this.subscription = this.update$.subscribe()
  }

  stopUpdateBalances() {
    this.subscription?.unsubscribe()
    this.subscription = null
  }

  listenTokenBalance(chainId: ChainId, token: Token | null, wallet: Address | null): Observable<bigint> {
    return blockStream(chainId).pipe(
      switchMap(async () => {
        if (!wallet || !token) return 0n
        return await getBalance(chainId, wallet, token.address).catch(() => 0n)
      })
    )
  }

  listenAvailableTokenBalanceForFusion(chainId: ChainId, token: Token | null, wallet: Address | null): Observable<bigint> {
    return this.listenTokenBalance(chainId, token, wallet).pipe(
      switchMap(async (balance) => {
        if (balance === 0n || token && !isNativeTokenContract(token.address)) return balance
        const gas = await this.transactionService.estimateWrapNativeToken(balance)
        const result = balance - gas
        return result < 0n ? 0n : result
      })
    )
  }

}
