import Dexie, { Table } from 'dexie';
import { type Address } from 'viem';
import { ChainId } from '@one-inch-community/models';

export interface TokenTable {
  id: string,
  address: Address
  chainId: ChainId
  decimals: number
  name: string
  symbol: string
  tags: string[]
  eip2612: boolean
  isFavorite: boolean
}

export class TokenSchema extends Dexie {

  static databaseVersion = 1

  private tokens!: Table<TokenTable, string>

  constructor() {
    super('one-inch-token');
    this.version(TokenSchema.databaseVersion).stores({
      tokens: [
        'id',
        'address',
        'decimals',
        'chainId',
        'name',
        'symbol',
        'tags',
        'eip2612',
        'isFavorite'
      ].join(', ')
    })
  }

  async setTokens(chainId: ChainId, tokens: Omit<TokenTable, 'id' | 'isFavorite'>[]) {
    const tableTokens: TokenTable[] = []
    for (const token of tokens) {
      tableTokens.push({
        id: id({ chainId, address: token.address }),
        address: token.address,
        decimals: token.decimals,
        eip2612: token.eip2612,
        name: token.name,
        symbol: token.symbol,
        tags: token.tags,
        isFavorite: false,
        chainId,
      })
    }
    await this.tokens.bulkAdd(tableTokens)
  }

  async getAddresses(chainId: ChainId) {
    const addresses: Address[] = []
    await this.tokens
      .where('chainId')
      .equals(chainId)
      .each(record => addresses.push(record.address))
    return addresses
  }

}

function id(data: { chainId: ChainId, address: Address }) {
  return [data.chainId, data.address].join(':')
}