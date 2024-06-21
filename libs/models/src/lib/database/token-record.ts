import { IToken } from '../token/token';

export interface ITokenRecord extends IToken {
  readonly id: string,
  readonly tags: string[]
  readonly eip2612: boolean | null
  readonly isFavorite: boolean
  readonly priority: number
  readonly logoURL: string
}
