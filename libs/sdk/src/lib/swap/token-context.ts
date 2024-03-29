import { filter, BehaviorSubject, tap } from 'rxjs';
import { IToken } from '@one-inch-community/models';

export class TokenContext {

  private isDirtyAmount = false
  private token: IToken | null = null
  private amount: bigint | null = null

  readonly token$ = new BehaviorSubject<IToken | null>(this.token)
  readonly amount$ = new BehaviorSubject<bigint>(0n)
  readonly amountForView$ = this.amount$.pipe(
    filter(() => this.isDirtyAmount),
    tap(() => this.isDirtyAmount = false)
  )

  setToken(token?: IToken) {
    if (!token) return
    this.token = token
    this.token$.next(token)
  }

  setAmount(amount: bigint) {
    this.amount = amount
    this.amount$.next(amount)
  }

  setAmountAndMarkDirty(amount: bigint) {
    this.isDirtyAmount = true
    this.setAmount(amount)
  }

  getState() {
    return {
      amount: this.amount,
      token: this.token,
      isDirtyAmount: this.isDirtyAmount,
    }
  }

  setState({ amount, isDirtyAmount, token }: { amount: bigint | null, token: IToken | null, isDirtyAmount: boolean }) {
    this.isDirtyAmount = isDirtyAmount
    this.setToken(token ?? undefined)
    this.setAmount(amount ?? 0n)
  }

}