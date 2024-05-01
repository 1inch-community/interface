import { filter, BehaviorSubject, tap, combineLatest, map, Observable, shareReplay } from 'rxjs';
import { IToken } from '@one-inch-community/models';

type TokenAndAmount = {
  amountRaw: bigint,
  amountView: bigint,
  token: IToken | null
}

export class TokenContext {

  private isDirtyAmount = false
  private amountForView = 0n

  readonly token$ = new BehaviorSubject<IToken | null>(null)
  readonly amount$ = new BehaviorSubject<bigint>(0n)
  readonly amountForView$ = this.amount$.pipe(
    filter(() => this.isDirtyAmount),
    tap((value) => {
      this.amountForView = value
      this.isDirtyAmount = false
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  )

  setToken(token?: IToken) {
    if (!token) return
    this.token$.next(token)
  }

  setAmount(amount: bigint, markDirty = false) {
    this.isDirtyAmount = markDirty
    this.amount$.next(amount)
  }

  getSnapshot(): TokenAndAmount {
    return {
      token: this.token$.value,
      amountRaw: this.amount$.value,
      amountView: this.amountForView,
    }
  }

  streamSnapshot(): Observable<TokenAndAmount> {
    return combineLatest([
      this.token$,
      this.amount$
    ]).pipe(
      map(() => this.getSnapshot()),
    )
  }

}