import { getEnvironmentValue } from '@one-inch-community/core/environment';
import { ChainId, IConnectWalletController } from '@one-inch-community/models';
import type { BlockchainProviderConnector, EIP712TypedData, HttpProviderConnector } from '@1inch/fusion-sdk';
import { getClient } from '@one-inch-community/sdk/chain';
import { Address, Hex } from 'viem';

export async function buildFusionSdk(chainId: ChainId, walletController: IConnectWalletController) {
  const { FusionSDK } = await import('@1inch/fusion-sdk');
  return new FusionSDK({
    url: getEnvironmentValue('oneInchDevPortalHost') + '/fusion',
    authKey: getEnvironmentValue('oneInchDevPortalToken'),
    network: chainId as any,
    blockchainProvider: new BlockchainFusionProviderConnector(chainId, walletController),
    httpProvider: new FusionHttpProviderConnector()
  });
}

class BlockchainFusionProviderConnector implements BlockchainProviderConnector {

  private readonly client = getClient(this.chainId)

  constructor(
    private readonly chainId: ChainId,
    private readonly walletController: IConnectWalletController
  ) {
  }

  async signTypedData(_: string, typedData: EIP712TypedData): Promise<string> {
    return await this.walletController.signTypedData(typedData as any)
  }

  async ethCall(contractAddress: string, callData: string): Promise<string> {
    const resp = await this.client.call({
      to: contractAddress as Address,
      data: callData as Hex
    })
    return resp.data ?? ''
  }

}

class FusionHttpProviderConnector implements HttpProviderConnector {
  async get<T>(url: string): Promise<T> {
    const resp = await fetch(url)
    return resp.json()
  }
  async post<T>(url: string, data: unknown): Promise<T> {
    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return resp.json().catch(() => void 0)
  }
}
