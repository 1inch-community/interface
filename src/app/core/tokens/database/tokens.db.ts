import {Injectable} from "@angular/core";
import Dexie, {Table} from "dexie";
import {Token, TokenDTO} from "../models/token";
import {LocalStorage} from "ngx-webstorage";
import {ChainId} from "@1inch/v3/core/wallet";
import {TokenBalance} from "../models/token-balance";
import {Address, isAddressEqual} from "viem";
import {QueueCache} from "@1inch/v3/core/shared";

const TokenPriority: Record<string, number> = {
  'native': 10000,
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

const dbVersion = 2

@Injectable({
  providedIn: "root"
})
export class TokensDb extends Dexie {

  @LocalStorage(`lastTokenListUpdateTimestampV${dbVersion}`, null)
  protected lastTokenListUpdateTimestamp!: Record<string, number> | null

  @LocalStorage(`lastBalancesUpdateTimestampV${dbVersion}`, null)
  protected lastBalancesUpdateTimestamp!: Record<string, number> | null

  tokens!: Table<Token, string>
  balances!: Table<TokenBalance, string>

  private readonly tokenCache = new QueueCache<string, Token>(100)

  constructor() {
    super('tokens');
    this.version(dbVersion).stores({
      tokens: [
        'id',
        'chainId',
        'address',
        'name',
        'decimals',
        'symbol',
        'logoURI',
        'priority',
        '*tags',
      ].join(', '),
      balances: [
        'id',
        'tokenAddress',
        'walletAddress',
        'chainId',
        'currency',
        'amount',
      ].join(', ')
    });
  }

  async addToCache(id: string[]) {
    const tokens = await this.tokens.bulkGet(id)
    for (const token of tokens) {
      if (!token) continue
      this.tokenCache.set(token.id, token)
    }
  }

  async getTokenById(id: string) {
    if (this.tokenCache.has(id)) {
      return this.tokenCache.get(id)
    }
    return await this.tokens
        .filter(record => record.id === id)
        .first() ?? null
  }

  async getAllTokenIdsWithOrderByPriority(chainId: ChainId): Promise<string[]> {
    const result: string[] = []
    await this.tokens
        .orderBy('priority')
        .filter(record => record.chainId === chainId)
        .reverse()
        .each(record => result.push(record.id))
    return result
  }

  async getAllTokenIdsWithOrderByBalanceAndPriority(chainId: ChainId, wallet: Address): Promise<string[]> {
    const result: string[] = []
    const priority: Record<string, number> = {}
    const balances: Record<string, number> = {}
    await this.balances
        .toCollection()
        .filter(record =>
            record.chainId === chainId
            && isAddressEqual(record.walletAddress, wallet))
        .reverse()
        .each(record => balances[this.buildId([ chainId, record.tokenAddress ])] = +record.amount)
    await this.tokens
        .toCollection()
        .filter(record => record.chainId === chainId)
        .each(record => {
          result.push(record.id)
          priority[record.id] = record.priority
        })

    return result.sort((id1, id2) => {
      const balance1 = balances[id1]
      const balance2 = balances[id2]

      if (balance1 < balance2) {
        return 1
      }
      if (balance1 > balance2) {
        return -1
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

  async getBalanceByTokenIdAndWallet(id: string, wallet: Address): Promise<string | null> {
    const recordId = this.buildId([id, wallet])
    const balanceRecord = await this.balances.filter(record => record.id === recordId).first()
    return balanceRecord?.amount ?? null
  }

  getLastTokenListUpdateTimestamp(chainId: ChainId): number | null {
    return this.lastTokenListUpdateTimestamp?.[chainId] ?? null
  }

  updateLastTokenListUpdateTimestamp(chainId: ChainId) {
    this.lastTokenListUpdateTimestamp = {
      ...this.lastTokenListUpdateTimestamp,
      [chainId]: Date.now()
    }
  }

  getLastBalancesUpdateTimestamp(chainId: ChainId, walletAddress: Address): number | null {
    const id = this.buildId([chainId, walletAddress])
    return this.lastBalancesUpdateTimestamp?.[id] ?? null
  }

  updateLastBalancesUpdateTimestamp(chainId: ChainId, walletAddress: Address) {
    const id = this.buildId([chainId, walletAddress])
    this.lastBalancesUpdateTimestamp = {
      ...this.lastBalancesUpdateTimestamp,
      [id]: Date.now()
    }
  }

  async addManyTokens(tokenDTOList: TokenDTO[]) {
    const tokens: Token[] = []
    for (const dto of tokenDTOList) {
      const id = this.buildId([dto.chainId, dto.address])
      tokens.push({
        id,
        priority: this.calcTokenPriority(dto),
        ...dto
      })
    }
    await this.tokens.bulkPut(tokens)
  }

  async findBySymbol(chainId: ChainId, symbol: string): Promise<Token | null> {
    return (await this.tokens.filter(token => token.chainId === chainId && token.symbol === symbol).first()) ?? null
  }

  async findByAddress(chainId: ChainId, address: Address): Promise<Token | null> {
    return (await this.tokens.filter(token => token.chainId === chainId && isAddressEqual(token.address, address)).first()) ?? null
  }

  async addBalances(balanceRecord: Record<Address, string>, chainId: ChainId, walletAddress: Address): Promise<void> {
    const balances: TokenBalance[] = []
    const addresses = Object.keys(balanceRecord) as Address[]
    for (const tokenAddress of addresses) {
      const id = this.buildId([chainId, tokenAddress, walletAddress])
      balances.push({
        id,
        tokenAddress,
        walletAddress,
        chainId,
        amount: balanceRecord[tokenAddress]
      })
    }
    await this.balances.bulkPut(balances)
  }

  private buildId(items: (string | number)[]): string {
    return items.join(':').toLowerCase()
  }

  private calcTokenPriority(dto: TokenDTO): number {
    let priority = dto?.providers?.length ?? 0
    priority += TokenPriority[dto.symbol] ?? 0
    for (const tag of dto.tags) {
      priority += (TokenPriority[tag] ?? 0)
    }
    return priority
  }
}
