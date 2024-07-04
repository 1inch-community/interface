import { distinctUntilChanged, map, Observable, shareReplay, startWith, Subject } from 'rxjs';
import { IToken, NullableValue, TokenSnapshot } from '@one-inch-community/models';
import { isTokensEqual } from '@one-inch-community/sdk/tokens';

export class TokenContext {

  private lastSnapshot: NullableValue<TokenSnapshot> = { token: null, amount: null }
  private readonly signalChange$ = new Subject<void>()

  setToken(token: IToken | null) {
    const { token: tokenFromSnap } = this.lastSnapshot
    if (tokenFromSnap && token && isTokensEqual(tokenFromSnap, token)) {
      return
    }
    this.lastSnapshot = { ...this.lastSnapshot, token, amount: 0n }
    this.signalChange$.next()
  }

  setAmount(amount: bigint) {
    const { amount: amountFromSnap } = this.lastSnapshot
    if (amountFromSnap === amount) {
      return
    }
    this.lastSnapshot = { ...this.lastSnapshot, amount }
    this.signalChange$.next()
  }

  getSnapshot(): NullableValue<TokenSnapshot> {
    return this.lastSnapshot
  }

  streamSnapshot(): Observable<NullableValue<TokenSnapshot>> {
    return this.signalChange$.pipe(
      map(() => this.lastSnapshot),
      startWith(this.lastSnapshot),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: true })
    )
  }

}
