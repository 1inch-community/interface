import {Initialized} from "@1inch/v3/core/shared";
import {inject, Injectable} from "@angular/core";
import {getViemWSDefaultClient, WalletDataService} from "@1inch/v3/core/wallet";
import {map, switchMap, tap} from "rxjs";
import {blockStream} from "../utils/block-stream";
import {formatGwei, Hash} from "viem";
import {LocalStorage} from "ngx-webstorage";

@Injectable()
export class PriorityFeeHolderService implements Initialized {

  private readonly walletDataService = inject(WalletDataService)

  @LocalStorage('lastAvrMaxPriorityFeePerGas', 0)
  private lastAvrMaxPriorityFeePerGas!: number

  initialize(): void {
    this.walletDataService.chainId$.pipe(
      switchMap(chainId => blockStream(chainId).pipe(
        switchMap(block => {
          const client = getViemWSDefaultClient(chainId)
          const txs = block.transactions as Hash[]
          return Promise.all(txs.map(hash => client.getTransaction({ hash }).catch(() => null)))
        }),
        map((txs: any[]) => txs.reduce((acc, tx) => acc + +formatGwei(tx?.maxPriorityFeePerGas ?? 0n), 0) / txs.length),
        tap(lastAvrMaxPriorityFeePerGas => this.lastAvrMaxPriorityFeePerGas = lastAvrMaxPriorityFeePerGas),
      ))
    ).subscribe();
  }

  getLastAvrMaxPriorityFeePerGas() {
    return this.lastAvrMaxPriorityFeePerGas
  }

}
