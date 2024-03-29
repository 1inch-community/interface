import Dexie, { Table } from 'dexie';
import { type Address } from 'viem';
import { ChainId } from '@one-inch-community/models';

export interface BalancesTable {
  id: string,
  chainId: ChainId
  tokenAddress: Address
  walletAddress: Address
  value: string
}

export class BalancesSchema extends Dexie {

  static databaseVersion = 1

  private balances!: Table<BalancesTable, string>

  constructor() {
    super('one-inch-balances');
    this.version(BalancesSchema.databaseVersion).stores({
      tokens: [
        'id',
        'chainId',
        'tokenAddress',
        'walletAddress',
        'value',
      ].join(', ')
    })
  }

  async setBalance(chainId: ChainId, tokenAddress: Address, walletAddress: Address, value: bigint) {
    this.balances.add({
      id: id({ chainId, walletAddress, tokenAddress }),
      walletAddress,
      tokenAddress,
      chainId,
      value: value.toString()
    })
  }

}

function id(data: { chainId: ChainId, tokenAddress: Address, walletAddress: Address }) {
  return [data.chainId, data.walletAddress, data.tokenAddress].join(':')
}