import type { Address } from 'viem';
import { ChainId } from '../chain';

export interface IBalancesTokenRecord {
  id: string,
  chainId: ChainId
  tokenAddress: Address
  walletAddress: Address
  amount: string
}
