import { contextField } from '../../utils';
import { TokenSchema } from './token.schema';
import { OneInchDevPortalAdapter } from '../../utils/one-inch-dev-portal.adapter';
import { JsonParser, storage } from '../../utils/storage';
import { ChainId } from '@one-inch-community/models';

const lastUpdateTokenDatabaseTimestampStorageKey = `last-update-token-database-timestamp-v${TokenSchema.databaseVersion}`

const week = 6.048e+8 as const

class TokenController {

  private readonly schema = new TokenSchema()
  private readonly oneInchApiAdapter = new OneInchDevPortalAdapter()
  private lastUpdateTokenDatabaseTimestampStorage = storage.get<Record<ChainId, number>>(lastUpdateTokenDatabaseTimestampStorageKey, JsonParser)

  private async getTokenAddresses(chainId: ChainId): Promise<any[]> {
    await this.updateTokenDatabase(chainId)
    return this.schema.getAddresses(chainId)
  }

  async updateTokenDatabase(chainId: ChainId) {
    const lastUpdateTime = this.lastUpdateTokenDatabaseTimestampStorage?.[chainId]
    if (lastUpdateTime && Date.now() - lastUpdateTime < week) return
    const tokens = await this.oneInchApiAdapter.getOneInchWhiteListedTokens(chainId)
    await this.schema.setTokens(chainId, tokens)
    storage.updateEntity(lastUpdateTokenDatabaseTimestampStorageKey, chainId.toString(), Date.now())
    this.lastUpdateTokenDatabaseTimestampStorage = storage.get<Record<ChainId, number>>(lastUpdateTokenDatabaseTimestampStorageKey, JsonParser)
  }

}

export const tokenController = contextField('__token-db_controller', () => new TokenController())