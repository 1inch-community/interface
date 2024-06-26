import { IToken } from './token';

export interface TokenSnapshot {
  readonly amount: bigint,
  readonly token: IToken
}
