import { Address, parseAbi } from 'viem';
import { ChainId } from '@one-inch-community/models';
import { isNativeToken } from './is-native-token';
import { getClient } from './chain-client';
import { BlockTimeCache } from './block-time-cache';

const abi = parseAbi([
  'function balanceOf(address _owner) public view returns (uint256 balance)'
]);

const cache = new BlockTimeCache<string, bigint>();

export async function getBalance(chainId: ChainId, wallet: Address, contract: Address): Promise<bigint> {
  const id = [wallet, contract].join(':');

  const cachedValue = cache.get(chainId, id);
  if (cachedValue !== null) {
    return cachedValue;
  }

  const client = getClient(chainId);
  if (isNativeToken(contract)) {
    return await client.getBalance({ address: wallet });
  }
  const result = await client.readContract({
    abi,
    functionName: 'balanceOf',
    args: [wallet],
    address: contract
  });

  cache.set(chainId, id, result);

  return result;
}

export async function getBalances(chainId: ChainId, walletAddress: Address, addresses: Address[]): Promise<Record<Address, string>> {
  const result: Record<Address, string> = {};

  await Promise.all(addresses
    .map(address => getBalance(chainId, walletAddress, address)
      .then(balance => result[address] = balance.toString())));

  return result;
}
