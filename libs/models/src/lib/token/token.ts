import type { Address } from 'viem';
import { ChainId } from '../chain/chain-id';

export interface IToken {
  readonly address: Address
  readonly chainId: ChainId
  readonly symbol: string
  readonly decimals: number
  readonly name: string
}