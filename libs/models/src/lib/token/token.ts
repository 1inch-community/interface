import type { Address } from 'viem';
import { ChainId } from '@one-inch-community/models';

export interface IToken {
  readonly address: Address
  readonly chainId: ChainId
  readonly symbol: string
  readonly decimals: number
  readonly name: string
}