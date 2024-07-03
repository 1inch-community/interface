import { TokenSchema } from './token.schema';
import { ChainId, ITokenRecord } from '@one-inch-community/models';
import { Address, formatUnits } from 'viem';
import { averageBlockTime } from '../chain/average-block-time';
import { TokenUsdOnChainPriceProvider } from './token-usd-on-chain-price.provider';
import { liveQuery } from 'dexie';
import { OneInchDevPortalAdapter } from '@one-inch-community/core/api';
import { storage, JsonParser } from '@one-inch-community/core/storage';
import { CacheActivePromise } from '@one-inch-community/core/decorators';
import { isSupportedEIP2612 } from '@one-inch-community/sdk/chain';
import { getBalances } from '@one-inch-community/sdk/chain';

const lastUpdateTokenDatabaseTimestampStorageKey = `last-update-token-database-timestamp-v${TokenSchema.databaseVersion}`
const lastUpdateTokenBalanceDatabaseTimestampStorageKey = `last-update-token-balance-database-timestamp-v${TokenSchema.databaseVersion}`

const tokenDatabaseTTL = 6.048e+8 as const // week
const tokenBalanceDatabaseTTL = averageBlockTime

class TokenControllerImpl {

  private readonly schema = new TokenSchema()
  private readonly tokenUsdPriceProvider = new TokenUsdOnChainPriceProvider()
  private readonly oneInchApiAdapter = new OneInchDevPortalAdapter()
  private lastUpdateTokenDatabaseTimestampStorage = storage.get<Record<ChainId, number>>(lastUpdateTokenDatabaseTimestampStorageKey, JsonParser)
  private lastUpdateTokenBalanceDatabaseTimestampStorage = storage.get<Record<string, number>>(lastUpdateTokenBalanceDatabaseTimestampStorageKey, JsonParser)

  /**
   * Retrieves sorted by balances and priority token addresses.
   *
   * @param {ChainId} chainId - The ID of the chain.
   * @param {Address} [walletAddress] - The connected wallet address. (Optional)
   * @returns {Promise<Address[]>} - A promise that resolves to an array of sorted token addresses.
   */
  async getSortedForViewTokenAddresses(chainId: ChainId, filterPattern: string, walletAddress?: Address): Promise<Address[]> {
    await this.updateTokenDatabase(chainId)
    if (walletAddress) {
      await this.updateBalanceDatabase(chainId, walletAddress)
    }
    const result = await this.schema.getSortedForViewTokenAddresses(chainId, filterPattern, walletAddress)
    if (walletAddress) {
      const prices = await this.getTokenUSDPrices(chainId, result.notZero)
      const tokens = await this.getTokenMap(chainId, result.notZero)
      const balances = await this.getTokenBalanceMap(chainId, walletAddress, result.notZero)
      const favoriteTokenList = await this.getAllFavoriteTokenAddresses(chainId)
      const favoriteTokenSet = new Set(favoriteTokenList)
      const tokenAmount: Record<Address, number> = {}
      for (const address of result.notZero) {
        const token = tokens[address]
        const tokenPrice = prices[address]
        const balance = formatUnits(balances[address], token.decimals)
        tokenAmount[address] = Number(balance) * Number(tokenPrice)
      }
      return [
        ...result.notZero.sort((address1, address2) => {
          const isFavoriteToken1 = favoriteTokenSet.has(address1)
          const isFavoriteToken2 = favoriteTokenSet.has(address2)
          if (isFavoriteToken1 === isFavoriteToken2) {
            return tokenAmount[address2] - tokenAmount[address1]
          }
          if (isFavoriteToken1) {
            return -1;
          }
          return 1
        }),
        ...result.zero
      ];
    }
    return [
      ...result.notZero,
      ...result.zero
    ]
  }

  async getToken(chainId: ChainId, address: Address) {
    await this.updateTokenDatabase(chainId)
    return await this.schema.getToken(chainId, address)
  }

  async getNativeToken(chainId: ChainId) {
    await this.updateTokenDatabase(chainId)
    return await this.schema.getNativeToken(chainId)
  }

  async getTokenBySymbol(chainId: ChainId, symbol: string) {
    await this.updateTokenDatabase(chainId)
    return this.schema.getTokenBySymbol(chainId, symbol)
  }

  async getTokenList(chainId: ChainId, addresses: Address[]) {
    await this.updateTokenDatabase(chainId)
    return await this.schema.getTokenList(chainId, addresses)
  }

  async getTokenMap(chainId: ChainId, addresses: Address[]) {
    return await this.schema.getTokenMap(chainId, addresses)
  }

  async getTokenBalanceMap(chainId: ChainId, walletAddress: Address, addresses: Address[]) {
    await this.updateBalanceDatabase(chainId, walletAddress)
    return await this.schema.getTokenBalanceMap(chainId, walletAddress, addresses)
  }

  async getTokenBalance(chainId: ChainId, tokenAddress: Address, walletAddress: Address) {
    await this.updateBalanceDatabase(chainId, walletAddress, tokenAddress)
    return await this.schema.getTokenBalance(chainId, tokenAddress, walletAddress)
  }

  async getTokenUSDPrice(chainId: ChainId, tokenAddress: Address) {
    const result = await this.getTokenUSDPrices(chainId, [tokenAddress])
    return result[tokenAddress]
  }

  async getPriorityToken(chainId: ChainId, addresses: Address[]) {
    const tokens = await this.getTokenList(chainId, addresses)
    const isStable = (token: ITokenRecord) => token.tags.includes('PEG:USD') || token.tags.includes('PEG:EUR')
    return tokens.sort((record1, record2) => {
      const isStable1 = isStable(record1)
      const isStable2 = isStable(record2)
      if (isStable1 && isStable2) {
        return record1.priority - record2.priority
      }
      if (isStable1 && !isStable2) {
        return -1
      }
      if (!isStable1 && isStable2) {
        return 1
      }

      return record1.priority - record2.priority
    })[0]
  }

  async setFavoriteState(chainId: ChainId, tokenAddress: Address, state: boolean) {
    await this.schema.setFavoriteState(chainId, tokenAddress, state)
  }

  async getAllFavoriteTokenAddresses(chainId: ChainId) {
    return await this.schema.getAllFavoriteTokenAddresses(chainId)
  }

  async getTokenUSDPrices(chainId: ChainId, tokenAddressList: Address[]): Promise<Record<Address, string>> {
    const result: Record<Address, string> = {}
    const prices = await this.oneInchApiAdapter.getTokenPrices(chainId).catch(() => null)
    if (prices === null) {
      /**
       * on chain fallback
       * */
      const tokens = await this.schema.getTokens(chainId, tokenAddressList)
      await Promise.all(
        tokens
          .map(token => this.tokenUsdPriceProvider.getPrice(chainId, token)
            .catch(() => '0')
            .then(price => result[token.address] = price))
      )
      return result
    }
    for (const address of tokenAddressList) {
      result[address] = prices[address] ?? '0'
    }
    return result
  }

  async isSupportedTokenPermit(chainId: ChainId, tokenAddress: Address): Promise<boolean> {
    const token = await this.schema.getToken(chainId, tokenAddress)
    if (!token) return false
    if (token.eip2612 === null) {
      const state = await isSupportedEIP2612(chainId, tokenAddress)
      await this.schema.setEip2612Support(chainId, tokenAddress, state)
      return state
    }
    return token.eip2612
  }

  /**
   * Updates the token database for the given chain ID.
   * If the last update time is within the token database TTL, no update is performed.
   * Otherwise, retrieves a list of whitelisted tokens from the 1inch dev portal
   * and sets the tokens using the schema. Updates the last update time in the storage.
   *
   * @param {ChainId} chainId - The chain ID for which the token database should be updated.
   * @return {Promise<void>} - A Promise that resolves when the token database has been updated.
   */
  @CacheActivePromise()
  async updateTokenDatabase(chainId: ChainId): Promise<void> {
    const lastUpdateTime = this.lastUpdateTokenDatabaseTimestampStorage?.[chainId]
    if (lastUpdateTime && Date.now() - lastUpdateTime < tokenDatabaseTTL) return
    const tokens = await this.oneInchApiAdapter.getWhiteListedTokens(chainId)
    await this.schema.setTokens(chainId, tokens)
    storage.updateEntity(lastUpdateTokenDatabaseTimestampStorageKey, chainId.toString(), Date.now())
    this.lastUpdateTokenDatabaseTimestampStorage = storage.get<Record<ChainId, number>>(lastUpdateTokenDatabaseTimestampStorageKey, JsonParser)
  }

  /**
   * Updates the balance database for a given chain and wallet address.
   *
   * @param {ChainId} chainId - The ID of the chain.
   * @param {Address} walletAddress - The wallet address.
   * @param {Address} tokenAddress - The token address.
   *
   * @return {Promise<void>} - A Promise that resolves once the balance database is updated.
   */
  @CacheActivePromise()
  async updateBalanceDatabase(chainId: ChainId, walletAddress: Address, tokenAddress?: Address): Promise<void> {
    const id = [chainId, walletAddress].join(':')
    const lastUpdateTime = this.lastUpdateTokenBalanceDatabaseTimestampStorage?.[id]
    if (lastUpdateTime && Date.now() - lastUpdateTime < tokenBalanceDatabaseTTL[chainId]) return

    const update = async () => {
      let balances = await this.oneInchApiAdapter.getBalancesByWalletAddress(chainId, walletAddress).catch(() => null)
      if (balances === null) {
        balances = await this.getBalancesOnChain(chainId, walletAddress)
      }
      await this.schema.setBalances(chainId, walletAddress, balances)
      storage.updateEntity(lastUpdateTokenBalanceDatabaseTimestampStorageKey, id, Date.now())
      this.lastUpdateTokenBalanceDatabaseTimestampStorage = storage.get<Record<string, number>>(lastUpdateTokenBalanceDatabaseTimestampStorageKey, JsonParser)
    }

    if (tokenAddress) {
      const tokenBalances = await this.schema.getTokenBalance(chainId, tokenAddress, walletAddress)
      if (tokenBalances === null) return await update()
    } else if (await this.schema.isEmptyTokenBalanceStorage(chainId, walletAddress)) {
      return await update()
    }
    update().catch(error => console.error(error))
  }

  liveQuery<T>(querier: () => T | Promise<T>) {
    return liveQuery(querier)
  }

  private async getBalancesOnChain(chainId: ChainId, walletAddress: Address): Promise<Record<Address, string>> {
    const tokens = await this.schema.getAllTokenAddresses(chainId)
    return getBalances(chainId, walletAddress, tokens)
  }
}

export const TokenController = new TokenControllerImpl()
