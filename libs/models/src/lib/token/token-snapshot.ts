import { IToken } from './token';

export interface TokenSnapshot {
  readonly amountRaw: bigint,
  readonly amountView: bigint,
  readonly token: IToken
}
