import type { Address } from 'viem';
import { ChainId } from '../chain/chain-id';

export interface ITokenRecord {
  id: string,
  address: Address
  chainId: ChainId
  decimals: number
  name: string
  symbol: string
  tags: string[]
  eip2612: boolean
  isFavorite: boolean
  priority: number
}