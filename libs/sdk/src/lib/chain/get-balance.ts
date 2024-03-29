import { Address, parseAbi } from 'viem';
import { ChainId } from '@one-inch-community/models';
import { isNativeToken } from './is-native-token';
import { getClient } from './chain-client';

const abi = parseAbi([
  'function balanceOf(address _owner) public view returns (uint256 balance)'
])

export async function getBalance(chainId: ChainId, wallet: Address, contract: Address): Promise<bigint> {
  const client = getClient(chainId)
  if (isNativeToken(contract)) {
    return await client.getBalance({ address: wallet })
  }
  return await client.readContract({
    abi,
    functionName: 'balanceOf',
    args: [wallet],
    address: contract,
  })
}