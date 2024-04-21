import { ChainId, EthereumProvider } from '@one-inch-community/models';
import { Address, createWalletClient, custom, WalletClient } from 'viem';
import { getChainById } from '../../chain';

export async function createClientAndSyncChain(
  chainId: ChainId,
  provider: EthereumProvider,
  address?: Address
): Promise<WalletClient> {
  const client = createClient(
    chainId,
    provider,
    address
  )
  console.log('[ios debug]', 'start deep connect')
  const addresses = await client.requestAddresses()
    .catch((error) => {
      if (
        error.core === 4001
        || error.message?.toLowerCase()?.includes('user reject')
        || error.details === 'Cancelled') throw error;
    });
  const walletChainId: ChainId = await client.getChainId();
  console.log('[ios debug]', 'connect complete', walletChainId, addresses)
  if (chainId !== walletChainId) {
    await client.switchChain(getChainById(chainId));
  }
  return client;
}

export function createClient(
  chainId: ChainId,
  provider: EthereumProvider,
  address?: Address
) {
  return createWalletClient({
    chain: getChainById(chainId),
    transport: custom(provider),
    account: address
  });
}