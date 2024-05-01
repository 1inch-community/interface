import { IToken, Pair } from '@one-inch-community/models';
import { TokenContext } from './token-context';
import { startWith, Subject, switchMap } from 'rxjs';

export type TokenType = 'source' | 'destination'

export class PairHolder {
  private source = new TokenContext()
  private destination = new TokenContext()

  private readonly pairChance$ = new Subject<void>()

  switchPair() {
    const { source, destination } = this
    this.source = destination
    this.destination = source
    this.pairChance$.next()
  }

  setPair(pair: Partial<Pair>): void {
    pair.srcToken && this.setToken(pair.srcToken, 'source')
    pair.dstToken && this.setToken(pair.dstToken, 'destination')
    this.pairChance$.next()
  }

  setAmount( tokenType: TokenType, value: bigint, markDirty?: boolean) {
    this.getTokenContext(tokenType).setAmount(value, markDirty)
  }

  streamSnapshot(tokenType: TokenType) {
    return this.pairChance$.pipe(
      startWith(null),
      switchMap(() => this.getTokenContext(tokenType).streamSnapshot())
    )
  }

  getSnapshot(tokenType: TokenType) {
    return this.getTokenContext(tokenType).getSnapshot()
  }

  private setToken(token: IToken, tokenType: TokenType) {
    this.getTokenContext(tokenType).setToken(token)
  }

  private getTokenContext(tokenType: TokenType) {
    if (tokenType === 'source') {
      return this.source;
    }
    if (tokenType === 'destination') {
      return this.destination;
    }
    throw new Error(`invalid token type ${tokenType}`);
  }
}

