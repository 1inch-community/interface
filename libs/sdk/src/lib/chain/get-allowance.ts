import { ChainId } from "@one-inch-community/models";
import { Address, parseAbi } from 'viem';
import { BlockTimeCache } from '../cache';
import { getClient } from './chain-client';
import { isNativeToken } from './is-native-token';
import { uint256Max } from './constants';
import { Observable, switchMap } from 'rxjs';
import { getBlockEmitter } from './block-emitter-map';

const abi = parseAbi([
  'function allowance(address owner, address spender) public view returns (uint256)'
])

const cache = new BlockTimeCache<string, bigint>();

export async function getAllowance(chainId: ChainId, contract: Address, owner: Address, spender: Address): Promise<bigint> {
  const id = [chainId, contract, owner, spender].join(':');

  const cachedValue = cache.get(chainId, id);
  if (cachedValue !== null) {
    return cachedValue;
  }

  const client = getClient(chainId);
  if (isNativeToken(contract)) {
    return uint256Max;
  }
  const result = await client.readContract({
    abi,
    functionName: 'allowance',
    args: [owner, spender],
    address: contract
  });

  cache.set(chainId, id, result);

  return result;
}

export function listenAllowance(chainId: ChainId, contract: Address, owner: Address, spender: Address): Observable<bigint> {
  return getBlockEmitter(chainId).pipe(
    switchMap( () => getAllowance(chainId, contract, owner, spender)),
  )
}
