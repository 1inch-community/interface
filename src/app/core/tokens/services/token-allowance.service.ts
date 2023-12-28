import {Injectable} from "@angular/core";
import {allowance, ChainId} from "@1inch/v3/core/wallet";
import {Token} from "@1inch/v3/core/tokens";
import {Address} from "viem";
import {distinctUntilChanged, Observable, switchMap} from "rxjs";
import {blockStream} from "../../wallet/utils/block-stream";
import {ContractAddresses, Contracts} from "@1inch/v3/core/shared";

@Injectable({
  providedIn: "root"
})
export class TokenAllowanceService {

  async allowance(chainId: ChainId, token: Token, wallet: Address, contract: Contracts): Promise<bigint> {
    return allowance(chainId, token.address, wallet, ContractAddresses[contract])
  }

  listenAllowance(chainId: ChainId, token: Token, wallet: Address, contract: Contracts): Observable<bigint> {
    return blockStream(chainId).pipe(
      switchMap(() => this.allowance(chainId, token, wallet, contract)),
      distinctUntilChanged()
    )
  }

}
