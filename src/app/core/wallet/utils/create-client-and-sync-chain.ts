import { createWalletClient, custom, WalletClient } from 'viem';
import {getViemChainId} from "./viem-chain-id";
import {ChainId, EthereumProvider} from "../models";

export async function createClientAndSyncChain(
    chainId: ChainId,
    provider: EthereumProvider
): Promise<WalletClient> {
    const client = createWalletClient({
        chain: getViemChainId(chainId),
        transport: custom(provider),
    });
    await client.requestAddresses()
        .catch(() => provider.enable());
    const walletChainId: ChainId = await client.getChainId();
    if (chainId !== walletChainId) {
        await client.switchChain(getViemChainId(chainId));
    }
    return client;
}
