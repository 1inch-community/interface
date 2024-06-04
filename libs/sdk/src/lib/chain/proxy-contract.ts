import { Address } from 'viem';
import { LongTimeCache } from '../cache';
import { getClient } from './chain-client';
import { ChainId } from '@one-inch-community/models';
import detectProxy from 'evm-proxy-detection';

const implementationAddressCache = new LongTimeCache<string, Address>('proxy-to-impl', 2)
export async function getImplementationAddress(chainId: ChainId, contract: Address): Promise<Address> {
  const id = [chainId, contract].join(':')
  if (implementationAddressCache.has(id)) {
    return implementationAddressCache.get(id)!
  }

  const client = getClient(chainId)
  const result = await detectProxy(contract, client.request as any)
  if (!result) {
    throw new Error(`Proxy not detected`)
  }

  implementationAddressCache.set(id, result.target)
  return result.target
}


