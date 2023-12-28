import {ChainId, getViemDefaultClient} from "@1inch/v3/core/wallet";
import {Address, parseAbi} from "viem";
import {Int256Max, TimeCache} from "@1inch/v3/core/shared";
import {isNativeTokenContract} from "./is-native-token";

const cache = new TimeCache<string, bigint>(3000)

const abi = parseAbi([
  'function allowance(address _owner, address _spender) public view returns (uint256 remaining)'
])

export async function allowance(chainId: ChainId, contract: Address, owner: Address, spender: Address): Promise<bigint> {
  if (isNativeTokenContract(contract)) {
    return Int256Max
  }
  const id = [chainId, contract, owner, spender].join(':')
  const cacheAllowance = cache.get(id)
  if (cacheAllowance) {
    return cacheAllowance
  }
  const client = getViemDefaultClient(chainId)
  const allowance = await client.readContract({
    abi,
    address: contract,
    functionName: 'allowance',
    args: [ owner, spender ]
  })
  cache.set(id, allowance)
  return allowance
}
