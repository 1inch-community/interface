import { ChainId } from "../models/chain-id.enum";
import {Address, parseAbi} from "viem";
import { getViemDefaultClient } from "./viem-clients";
import {TimeCache} from "@1inch/v3/core/shared";
import {isNativeTokenContract} from "./is-native-token";

const cache = new TimeCache<string, bigint>(3000)

const abi = parseAbi([
  'function balanceOf(address _owner) public view returns (uint256 balance)'
])

export async function getBalance(chainId: ChainId, wallet: Address, contract: Address): Promise<bigint> {
    const id = [chainId, wallet, contract].join(':')
    const cacheBalance = cache.get(id)
    if (cacheBalance) {
        return cacheBalance
    }

    const client = getViemDefaultClient(chainId)
    if (isNativeTokenContract(contract)) {
        const balance = await client.getBalance({ address: wallet })
        cache.set(id, balance)
        return balance
    }
    const balance = await client.readContract({
        abi,
        functionName: 'balanceOf',
        args: [wallet],
        address: contract,
    })
    cache.set(id, balance)
    return balance
}
