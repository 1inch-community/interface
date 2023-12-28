import {inject, Injectable} from "@angular/core";
import {Address, formatGwei, formatUnits, Hash, parseGwei, PublicClient, WalletClient} from "viem";
import {WalletConnectionHandler} from "./wallet-connection.handler";
import {ChainId, getViemDefaultClient, WalletDataService} from "@1inch/v3/core/wallet";
import {isEip1559Chain} from "../utils/eip-1559-chains";
import {BigMath} from "@1inch/v3/core/shared";
import {PriorityFeeHolderService} from "./priority-fee-holder.service";

@Injectable({
  providedIn: "root"
})
export class WalletTransactionService {

  private readonly handler = inject(WalletConnectionHandler)
  private readonly walletDataService = inject(WalletDataService)
  private readonly priorityFeeHolderService = inject(PriorityFeeHolderService)

  async execute(txContext: (client: WalletClient) => Promise<Hash>): Promise<Hash> {
    if (!this.handler.client) throw new Error('The transaction cannot be completed because the wallet is not connected')
    return await txContext(this.handler.client)
  }

  async estimate(txContext: (client: PublicClient, account: Address) => Promise<bigint>): Promise<bigint> {
    const chainId = await this.walletDataService.getChainId()
    if (isEip1559Chain(chainId)) {
      return await this.estimateEIP1559(txContext, chainId)
    }
    return this.estimateLegacy(txContext, chainId)
  }

  private async estimateLegacy(txContext: (client: PublicClient, account: Address) => Promise<bigint>, chainId: ChainId): Promise<bigint> {
    const client = getViemDefaultClient(chainId)
    let account: Address = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    if (this.handler.client) {
      const [acc] = await this.handler.client.getAddresses()
      account = acc
    }
    const gasLimit = await txContext(client, account)
    const gasPrice = await client.getGasPrice()
    return gasLimit * gasPrice
  }

  private async estimateEIP1559(txContext: (client: PublicClient, account: Address) => Promise<bigint>, chainId: ChainId): Promise<bigint> {
    const client = getViemDefaultClient(chainId)
    let account: Address = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    if (this.handler.client) {
      const [acc] = await this.handler.client.getAddresses()
      account = acc
    }
    const gasLimit = await txContext(client, account)
    const block = await client.getBlock()
    const baseFee = block.baseFeePerGas ?? 0n
    const gasPrice = BigMath.dev(block.gasUsed, block.gasLimit, 9, 9)
    const lastAvrMaxPriorityFeePerGas = this.priorityFeeHolderService.getLastAvrMaxPriorityFeePerGas()
    const lastAvrMaxPriorityFeePerGasGwie = parseGwei(lastAvrMaxPriorityFeePerGas.toString())
    const priorityFee = ((baseFee * 250n / 100n) + (gasPrice)) + lastAvrMaxPriorityFeePerGasGwie
    return gasLimit * (baseFee + priorityFee)
  }

}
