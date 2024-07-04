import { ChainId, EthereumProvider } from '@one-inch-community/models';
import { Address, createWalletClient, custom, WalletClient } from 'viem';
import { getChainById } from '@one-inch-community/sdk/chain';

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
  await client.requestAddresses()
    .catch((error) => {
      if (
        error.core === 4001
        || error.message?.toLowerCase()?.includes('user reject')
        || error.details === 'Cancelled') throw error;
    });
  const walletChainId: ChainId = await client.getChainId();
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
