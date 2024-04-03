import Dexie, { Table } from 'dexie';
import { type Address, isAddressEqual } from 'viem';
import { IBalancesTokenRecord, ChainId, ITokenRecord, ITokenDto } from '@one-inch-community/models';

const TokenPriority: Record<string, number> = {
  'native': 1000,
  'USDT': 100,
  'USDC': 100,
  'WETH': 62,
  '1INCH': 61,
  'PEG:ETH': 60,
  'PEG:USD': 50,
  'PEG:BTC': 40,
  'PEG:EUR': 30,
  'staking': 20,
  'savings': 10,
  'tokens': 0,
}

export class TokenSchema extends Dexie {

  static databaseVersion = 1

  private tokens!: Table<ITokenRecord, string>
  private balances!: Table<IBalancesTokenRecord, string>

  constructor() {
    super('one-inch-token');
    this.version(TokenSchema.databaseVersion).stores({
      tokens: [
        'id', // 'chainId:address'
        'address',
        'decimals',
        'chainId',
        'name',
        'symbol',
        '*tags',
        'eip2612',
        'isFavorite'
      ].join(', '),
      balances: [
        'id', // 'chainId:walletAddress:tokenAddress'
        'chainId',
        'tokenAddress',
        'walletAddress',
        'amount',
      ].join(', ')
    })
  }

  async getToken(chainId: ChainId, address: Address): Promise<ITokenRecord> {
    const records = await this.tokens
      .where('chainId')
      .equals(chainId)
      .and(record => isAddressEqual(record.address, address))
      .toArray();
    return records[0];
  }

  async getTokenBalance(chainId: ChainId, tokenAddress: Address, walletAddress: Address): Promise<IBalancesTokenRecord> {
    const records = await this.balances
      .where('chainId')
      .equals(chainId)
      .and(record => isAddressEqual(record.walletAddress, walletAddress) && isAddressEqual(record.tokenAddress, tokenAddress))
      .toArray()
    return records[0]
  }

  async setTokens(chainId: ChainId, tokens: ITokenDto[]) {
    const tableTokens: ITokenRecord[] = []
    for (const token of tokens) {
      tableTokens.push({
        id: id(chainId, token.address),
        address: token.address,
        decimals: token.decimals,
        eip2612: token.eip2612,
        name: token.name,
        symbol: token.symbol,
        tags: token.tags,
        isFavorite: false,
        chainId,
        priority: calcTokenPriority(token)
      })
    }
    await this.tokens.bulkAdd(tableTokens)
  }

  async getAddresses(chainId: ChainId): Promise<Address[]> {
    const addresses: Address[] = []
    await this.tokens
      .where('chainId')
      .equals(chainId)
      .each(record => addresses.push(record.address))
    return addresses
  }

  async setBalances(chainId: ChainId, walletAddress: Address, balances: Record<Address, string>) {
    const balancesRecords: IBalancesTokenRecord[] = []
    for (const address in balances) {
      const tokenAddress = address as Address
      balancesRecords.push({
        id: id(chainId, walletAddress, tokenAddress),
        chainId,
        tokenAddress: tokenAddress,
        walletAddress,
        amount: balances[tokenAddress],
      })
    }
    await this.balances.bulkPut(balancesRecords)
  }

  async getSortedForViewTokenAddresses(chainId: ChainId, walletAddress?: Address) {
    const result: Address[] = []
    const priority: Record<string, number> = {}
    const balances: Record<string, bigint> = {}

    if (walletAddress) {
      await this.balances
        .where('chainId')
        .equals(chainId)
        .and(record => isAddressEqual(record.walletAddress, walletAddress))
        .each(record => balances[id(record.tokenAddress)] = BigInt(record.amount))
    }

    await this.tokens
      .where('chainId')
      .equals(chainId)
      .each(record => {
        result.push(record.address)
        priority[record.id] = record.priority
      })

    return result.sort((id1, id2) => {
      const balance1: bigint | undefined = balances[id1]
      const balance2: bigint | undefined = balances[id2]

      if (balance1 && balance2) {
        if (balance1 < balance2) {
          return 1
        }
        if (balance1 > balance2) {
          return -1
        }
      }

      const priority1 = priority[id1]
      const priority2 = priority[id2]

      if (priority1 < priority2) {
        return 1
      }
      if (priority1 > priority2) {
        return -1
      }

      return 0
    })
  }

}

function id(...args: unknown[]) {
  return args.join(':')
}

function calcTokenPriority(dto: ITokenDto): number {
  let priority = dto?.providers?.length ?? 0
  priority += TokenPriority[dto.symbol] ?? 0
  for (const tag of dto.tags) {
    priority += (TokenPriority[tag] ?? 0)
  }
  return priority
}
