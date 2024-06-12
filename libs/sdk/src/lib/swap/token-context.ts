import { map, Observable, startWith, Subject } from 'rxjs';
import { IToken, NullableValue, TokenSnapshot } from '@one-inch-community/models';
import { isTokensEqual } from '../tokens';

export class TokenContext {

  private amountForView: bigint | null = null
  private amount: bigint | null = null
  private token: IToken | null = null
  private readonly signalChange$ = new Subject<void>()

  setToken(token: IToken | null) {
    if (this.token && token && isTokensEqual(this.token, token)) {
      return
    }
    this.token = token ?? null
    this.amount = 0n
    this.amountForView = 0n
    this.signalChange$.next()
  }

  setAmount(amount: bigint, markDirty = false) {
    if (this.amount === amount && !markDirty) {
      return
    }
    this.amount = amount
    if (markDirty) {
      this.amountForView = amount
    }
    this.signalChange$.next()
  }

  getSnapshot(): NullableValue<TokenSnapshot> {
    return {
      token: this.token,
      amountRaw: this.amount,
      amountView: this.amountForView,
    }
  }

  streamSnapshot(): Observable<NullableValue<TokenSnapshot>> {
    return this.signalChange$.pipe(
      map(() => this.getSnapshot()),
      startWith(this.getSnapshot())
    )
  }

}
