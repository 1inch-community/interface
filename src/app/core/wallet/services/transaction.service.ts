import {inject, Injectable} from "@angular/core";
import {WalletTransactionService} from "./wallet-transaction.service";
import {Address, Hash, parseAbi} from "viem";
import {Token} from "@1inch/v3/core/tokens";
import {getViemChainId, getViemDefaultClient, isNativeTokenContract, WalletDataService} from "@1inch/v3/core/wallet";
import {Int256Max} from "@1inch/v3/core/shared";
import {wrapperNativeTokenMap} from "../../tokens/wrapper-native-token-map";

const abi = parseAbi([
  'function approve(address _spender, uint256 _value) public returns (bool success)',
  'function deposit() public payable',
])

@Injectable({
  providedIn: "root"
})
export class TransactionService {

  private readonly transaction = inject(WalletTransactionService)
  private readonly walletDataService = inject(WalletDataService)

  async approve(token: Token, spender: Address, value: bigint = Int256Max): Promise<Hash> {
    if (isNativeTokenContract(token.address)) {
      throw new Error('request approve for native token not supported')
    }
    return await this.transaction.execute(async (client) => {
      const [account] = await client.getAddresses()
      const chainId = await this.walletDataService.getChainId()
      return await client.writeContract({
        abi,
        address: token.address,
        functionName: 'approve',
        args: [spender, value],
        account: account,
        chain: getViemChainId(chainId)
      })
    })
  }

  async wrapNativeToken(value: bigint): Promise<Hash> {
    const chainId = await this.walletDataService.getChainId()
    const chain = getViemChainId(chainId)
    const tokenAddress = wrapperNativeTokenMap[chainId]
    const publicClient = getViemDefaultClient(chainId)
    return await this.transaction.execute(async (client) => {
      const [account] = await client.getAddresses()
      const gas = await publicClient.estimateContractGas({
        abi,
        account,
        value,
        address: tokenAddress,
        functionName: 'deposit',
      })
      const { request } = await publicClient.simulateContract({
        abi,
        address: tokenAddress,
        functionName: 'deposit',
        account: account,
        chain,
        value,
        gas
      })
      return await client.writeContract(request)
    })
  }

  async estimateWrapNativeToken(value: bigint) {
    const chainId = await this.walletDataService.getChainId()
    const tokenAddress = wrapperNativeTokenMap[chainId]
    return await this.transaction.estimate(async (client, account) => {
      return await client.estimateContractGas({
        abi,
        account,
        value,
        address: tokenAddress,
        functionName: 'deposit',
      })
    })
  }
}
