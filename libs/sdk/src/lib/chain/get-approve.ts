import { Address, parseAbi } from 'viem';
import { ChainId } from '@one-inch-community/models';
import { getClient } from './chain-client';
import { isNativeToken } from './is-native-token';

const abi = parseAbi([
  'function approve(address _spender, uint256 _value) public returns (bool success)'
])

export async function getApproveSimulation(chainId: ChainId, contract: Address, owner: Address, spender: Address, value: bigint) {
  const client = getClient(chainId);

  if (isNativeToken(contract)) {
    throw new Error('')
  }

  return await client.simulateContract({
    abi,
    account: owner,
    functionName: 'approve',
    args: [spender, value],
    address: contract
  })
}
