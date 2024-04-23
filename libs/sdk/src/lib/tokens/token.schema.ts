import Dexie, { Table } from 'dexie';
import { type Address, isAddressEqual } from 'viem';
import { IBalancesTokenRecord, ChainId, ITokenRecord, ITokenDto } from '@one-inch-community/models';
import { QueueCache } from '../cache';

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
  'tokens': 0
};

export class TokenSchema extends Dexie {

  static databaseVersion = 3;

  private tokens!: Table<ITokenRecord, string>;
  private balances!: Table<IBalancesTokenRecord, string>;

  private readonly tokenCache = new QueueCache<string, ITokenRecord>(50)

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
        'logoURL',
        'isFavorite',
        'priority'
      ].join(', '),
      balances: [
        'id', // 'chainId:walletAddress:tokenAddress'
        'chainId',
        'tokenAddress',
        'walletAddress',
        'amount'
      ].join(', ')
    });
  }

  async getToken(chainId: ChainId, address: Address): Promise<ITokenRecord> {
    const recordId = getId(chainId, address);
    if (this.tokenCache.has(recordId)) {
      return this.tokenCache.get(recordId)!
    }
    const records = await this.tokens
      .where('id')
      .equals(recordId)
      .toArray();
    this.tokenCache.set(recordId, records[0])
    return records[0];
  }

  getTokenBySymbol(chainId: ChainId, symbol: string) {
    return this.tokens
      .where('chainId')
      .equals(chainId)
      .filter(record => record.symbol === symbol)
      .toArray()
  }

  async getTokenMap(chainId: ChainId, addresses: Address[]): Promise<Record<Address, ITokenRecord>> {
    const addressesSet = new Set(addresses)
    const result: Record<Address, ITokenRecord> = {}
    await this.tokens
      .each(record => {
        if (record.chainId === chainId && addressesSet.has(record.address)) {
          result[record.address] = record
        }
      })

    return result
  }

  getTokenList(chainId: ChainId, addresses: Address[]): Promise<ITokenRecord[]> {
    const addressesSet = new Set(addresses)
    return this.tokens
      .filter(record => record.chainId === chainId && addressesSet.has(record.address))
      .toArray();
  }

  async getTokenBalanceMap(chainId: ChainId, walletAddress: Address, addresses: Address[]): Promise<Record<Address, bigint>> {
    const addressesSet = new Set(addresses)
    const result: Record<Address, bigint> = {}

    await this.balances
      .each(record => {
        if (record.chainId === chainId && record.walletAddress === walletAddress && addressesSet.has(record.tokenAddress)) {
          result[record.tokenAddress] = BigInt(record.amount)
        }
      })

    return result
  }

  async getTokens(chainId: ChainId, addresses: Address[]): Promise<ITokenRecord[]> {
    const addressesSet = new Set(addresses)
    return this.tokens
      .filter(record => record.chainId === chainId && addressesSet.has(record.address))
      .toArray()
  }

  async getAllTokenAddresses(chainId: ChainId) {
    const result: Address[] = []
    await this.tokens
      .where('chainId')
      .equals(chainId)
      .each(record => result.push(record.address))

    return result
  }

  async getTokenBalance(chainId: ChainId, tokenAddress: Address, walletAddress: Address): Promise<IBalancesTokenRecord> {
    const recordId = getId(chainId, walletAddress, tokenAddress);
    const records = await this.balances
      .where('id')
      .equals(recordId)
      .toArray();
    return records[0];
  }

  async setTokens(chainId: ChainId, tokens: ITokenDto[]) {
    const tableTokens: ITokenRecord[] = [];
    for (const token of tokens) {
      tableTokens.push({
        id: getId(chainId, token.address),
        address: token.address,
        decimals: token.decimals,
        eip2612: token.extensions?.eip2612 ?? false,
        name: token.name,
        symbol: token.symbol,
        tags: token.tags,
        logoURL: token.logoURI,
        isFavorite: false,
        chainId,
        priority: calcTokenPriority(token)
      });
    }
    this.tokenCache.clear()
    await this.tokens.bulkAdd(tableTokens);
  }

  async setBalances(chainId: ChainId, walletAddress: Address, balances: Record<Address, string>) {
    const balancesRecords: IBalancesTokenRecord[] = [];
    for (const address in balances) {
      const tokenAddress = address as Address;
      balancesRecords.push({
        id: getId(chainId, walletAddress, tokenAddress),
        chainId,
        tokenAddress: tokenAddress,
        walletAddress,
        amount: balances[tokenAddress]
      });
    }
    await this.balances.bulkPut(balancesRecords);
  }

  async getAllFavoriteTokenAddresses(chainId: ChainId) {
    const result: Address[] = []
    await this.tokens
      .where('chainId')
      .equals(chainId)
      .each(record => {
        if (!record.isFavorite) return
        result.push(record.address)
      })

    return result
  }

  async getSortedForViewTokenAddresses(chainId: ChainId, walletAddress?: Address): Promise<{
    notZero: Address[],
    zero: Address[]
  }> {
    const balances: Record<Address, bigint> = {};
    const priority: Record<Address, number> = {};
    const favoriteTokenSet = new Set<Address>()
    const notZero: Address[] = [];
    const zero: Address[] = [];

    if (walletAddress) {
      await this.balances
        .where('chainId')
        .equals(chainId)
        .and(record => isAddressEqual(record.walletAddress, walletAddress))
        .each(record => balances[record.tokenAddress] = BigInt(record.amount));
    }

    await this.tokens
      .where('chainId')
      .equals(chainId)
      .each(record => {
        if (balances[record.address] && balances[record.address] > 0n) {
          notZero.push(record.address);
          return;
        }
        priority[record.address] = record.priority;
        zero.push(record.address);
        record.isFavorite && favoriteTokenSet.add(record.address)
      });

    return {
      notZero,
      zero: zero.sort((address1, address2) => {
        const priority1 = priority[address1];
        const priority2 = priority[address2];
        const isFavoriteToken1 = favoriteTokenSet.has(address1)
        const isFavoriteToken2 = favoriteTokenSet.has(address2)
        if (isFavoriteToken1 === isFavoriteToken2) {
          if (priority1 < priority2) {
            return 1;
          }
          if (priority1 > priority2) {
            return -1;
          }
          return 0;
        }
        if (isFavoriteToken1) {
          return -1;
        }
        if (isFavoriteToken2) {
          return 1;
        }
        return 0
      })
    };
  }

  async setFavoriteState(chainId: ChainId, tokenAddress: Address, state: boolean) {
    const recordId = getId(chainId, tokenAddress);
    this.tokenCache.delete(recordId)
    await this.tokens.update(recordId, { isFavorite: state })
  }

}

function getId(...args: unknown[]) {
  return args.join(':');
}

function calcTokenPriority(dto: ITokenDto): number {
  let priority = dto?.providers?.length ?? 0;
  priority += TokenPriority[dto.symbol] ?? 0;
  for (const tag of dto.tags) {
    priority += (TokenPriority[tag] ?? 0);
  }
  return priority;
}
