import {DestroyRef, inject, Injectable} from "@angular/core";
import {Token, TokensDb} from "@1inch/v3/core/tokens";
import {Address, formatUnits, parseUnits} from "viem";
import {combineLatest, defer, map, Observable, shareReplay} from "rxjs";
import {liveQuery} from "dexie";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

export interface TokenView {
  token: Token
  balance: string
}

@Injectable()
export class SelectTokenViewState {

  private readonly pendingStorage = new Map<string, Observable<TokenView | null>>()

  private readonly tokenDb = inject(TokensDb)
  private readonly destroyRef = inject(DestroyRef)

  get(id: string, wallet: Address | null | undefined): Observable<TokenView | null> {
    const _id = [id, wallet].join(':').toLowerCase()
    const recordPending = this.pendingStorage.get(_id)
    if (recordPending) {
      return recordPending
    }
    const pending = this.createPending(id, wallet)
    this.pendingStorage.set(_id, pending)
    return pending
  }

  private createPending(id: string, wallet: Address | null | undefined): Observable<TokenView | null> {
    const token$ = defer(() => liveQuery(() => this.tokenDb.getTokenById(id)))
    const balance$: Observable<string> = defer(() => {
      if (!wallet) return ['0']
      return liveQuery(() => this.tokenDb.getBalanceByTokenIdAndWallet(id, wallet))
    }).pipe(
      map(balance => balance ?? '0')
    )

    return combineLatest([
      token$,
      balance$
    ]).pipe(
      map(([token, balanceRaw]) => {
        if (!token) return null
        const balance = formatUnits(BigInt(balanceRaw), token.decimals)
        return { token, balance }
      }),
      takeUntilDestroyed(this.destroyRef),
      shareReplay(1)
    )
  }

}
