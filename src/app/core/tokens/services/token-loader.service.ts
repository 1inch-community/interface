import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom, map} from "rxjs";
import {ChainId} from "@1inch/v3/core/wallet";
import {TokenDTO} from "../models/token";
import {Address} from "viem";
import {environment} from "@1inch/v3/env";


@Injectable({
  providedIn: 'root'
})
export class TokenLoaderService {

  constructor(private readonly http: HttpClient) {
  }

  async loadTokens(chainId: ChainId) {
    return firstValueFrom(this.http.get<{ tokens: TokenDTO[] }>(`${environment.devPortalHost}/token/v1.2/${chainId}/token-list`))
  }

  async loadTokensFromTokenAPI(chainId: ChainId) {
    return firstValueFrom(this.http.get<Record<Address, TokenDTO>>(`https://tokens.1inch.io/v1.2/${chainId}`).pipe(
        map(response => ({ tokens: Object.values(response).map(item => ({ ...item, chainId })) }))
    ))
  }

  async loadBalances(chainId: ChainId, walletAddress: Address) {
    return firstValueFrom(this.http.get<Record<Address, string>>(`${environment.devPortalHost}/balance/v1.2/${chainId}/balances/${walletAddress}`))
  }
}
