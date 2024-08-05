import { ChainId } from '@one-inch-community/models';
import { Address, Hash, parseAbi } from 'viem';
import { getClient } from './chain-client';
import { getOneInchRouterV6ContractAddress } from './contracts';

const abi = parseAbi([
  'function cancelOrder(uint256 makerTraits, bytes32 orderHash) public'
])

export async function cancelFusionOrder(chainId: ChainId, owner: Address, makerTraits: string, orderHash: Hash) {
  const client = getClient(chainId);

  const contract = getOneInchRouterV6ContractAddress(chainId)

  return await client.simulateContract({
    abi,
    account: owner,
    functionName: 'cancelOrder',
    args: [BigInt(makerTraits), orderHash],
    address: contract
  })
}
