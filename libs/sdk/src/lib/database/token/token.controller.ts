import { contextField, OneInchDevPortalAdapter, JsonParser, storage } from '../../utils';
import { TokenSchema } from './token.schema';
import { ChainId } from '@one-inch-community/models';
import { Address } from 'viem';
import { averageBlockTime } from '../../chain/average-block-time';

const lastUpdateTokenDatabaseTimestampStorageKey = `last-update-token-database-timestamp-v${TokenSchema.databaseVersion}`
const lastUpdateTokenBalanceDatabaseTimestampStorageKey = `last-update-token-balance-database-timestamp-v${TokenSchema.databaseVersion}`

const tokenDatabaseTTL = 6.048e+8 as const // week
const tokenBalanceDatabaseTTL = averageBlockTime

class TokenControllerImpl {

  private readonly schema = new TokenSchema()
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
  async getSortedForViewTokenAddresses(chainId: ChainId, walletAddress?: Address): Promise<Address[]> {
    await this.updateTokenDatabase(chainId)
    if (walletAddress) {
      await this.updateBalanceDatabase(chainId, walletAddress)
    }
    return await this.schema.getSortedForViewTokenAddresses(chainId, walletAddress)
  }

  async getToken(chainId: ChainId, address: Address) {
    return await this.schema.getToken(chainId, address)
  }

  async getTokenBalance(chainId: ChainId, tokenAddress: Address, walletAddress: Address) {
    return await this.schema.getTokenBalance(chainId, tokenAddress, walletAddress)
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
   *
   * @return {Promise<void>} - A Promise that resolves once the balance database is updated.
   */
  async updateBalanceDatabase(chainId: ChainId, walletAddress: Address): Promise<void> {
    const id = [chainId, walletAddress].join(':')
    const lastUpdateTime = this.lastUpdateTokenBalanceDatabaseTimestampStorage?.[id]
    if (lastUpdateTime && Date.now() - lastUpdateTime < tokenBalanceDatabaseTTL[chainId]) return
    const balances = await this.oneInchApiAdapter.getBalancesByWalletAddress(chainId, walletAddress)
    await this.schema.setBalances(chainId, walletAddress, balances)
    storage.updateEntity(lastUpdateTokenBalanceDatabaseTimestampStorageKey, id, Date.now())
    this.lastUpdateTokenBalanceDatabaseTimestampStorage = storage.get<Record<string, number>>(lastUpdateTokenBalanceDatabaseTimestampStorageKey, JsonParser)
  }
}

export const TokenController = contextField('__token-db_controller', () => new TokenControllerImpl())