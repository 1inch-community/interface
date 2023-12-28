import {inject, Injectable} from "@angular/core";
import {combineLatest, distinctUntilChanged, shareReplay, switchMap} from "rxjs";
import {WalletDataService} from "@1inch/v3/core/wallet";
import {TokensDb} from "@1inch/v3/core/tokens";
import {liveQuery} from "dexie";
import {Initialized} from "@1inch/v3/core/shared";

@Injectable()
export class SelectTokenService implements Initialized {

    private readonly tokenDb = inject(TokensDb)
    private readonly walletDataService = inject(WalletDataService)

    readonly tokensIdList$ = combineLatest([
        this.walletDataService.chainId$.pipe(distinctUntilChanged()),
        this.walletDataService.currentAddress$.pipe(distinctUntilChanged())
    ]).pipe(
        switchMap(([chainId, wallet]) => {
            if (!wallet) {
                return liveQuery(() => this.tokenDb.getAllTokenIdsWithOrderByPriority(chainId))
            }
            return liveQuery(() => this.tokenDb.getAllTokenIdsWithOrderByBalanceAndPriority(chainId, wallet))
        }),
        shareReplay({ bufferSize: 1, refCount: true })
    )

    initialize(): void {
        this.tokensIdList$.subscribe(ids => this.tokenDb.addToCache(ids.slice(0, 100)))
    }

}
