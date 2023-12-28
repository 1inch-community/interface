import {Injectable} from "@angular/core";
import {ChainId} from "@1inch/v3/core/wallet";
import {Address} from "viem";
import {TokensDb} from "@1inch/v3/core/tokens";
import {TokenLoaderService} from "./token-loader.service";

@Injectable({
  providedIn: 'root'
})
export class TokenDataUpdateService {

  constructor(private readonly tokenDb: TokensDb,
              private readonly tokenLoader: TokenLoaderService) {
  }

  async updateTokenList(chainId: ChainId) {
    const lastUpdateTimestamp = this.tokenDb.getLastTokenListUpdateTimestamp(chainId)
    if (lastUpdateTimestamp === null || Date.now() - lastUpdateTimestamp > (3600 * 1000 * 24)) {
      const { tokens } = await this.tokenLoader.loadTokensFromTokenAPI(chainId)
      await this.tokenDb.addManyTokens(tokens)
      this.tokenDb.updateLastTokenListUpdateTimestamp(chainId)
    }
  }

  async updateBalances(chainId: ChainId, walletAddress: Address) {
    const lastBalancesUpdateTimestamp = this.tokenDb.getLastBalancesUpdateTimestamp(chainId, walletAddress)
    if (lastBalancesUpdateTimestamp === null || Date.now() - lastBalancesUpdateTimestamp > (3600 * 1000 * 24)) {
      await this.updateBalancesNow(chainId, walletAddress)
    }
  }

  async updateBalancesNow(chainId: ChainId, walletAddress: Address) {
    console.log('start update now')
    const balanceRecord = await this.tokenLoader.loadBalances(chainId, walletAddress)
    await this.tokenDb.addBalances(balanceRecord, chainId, walletAddress)
    this.tokenDb.updateLastBalancesUpdateTimestamp(chainId, walletAddress)
  }

}
