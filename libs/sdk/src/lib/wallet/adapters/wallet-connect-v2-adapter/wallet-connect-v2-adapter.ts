import {
  ChainId,
  EIP6963ProviderDetail,
  IDataAdapter,
  IProviderDataAdapterInternal,
  IWalletAdapter
} from '@one-inch-community/models';
import { Address, WalletClient } from 'viem';
import { ProviderDataAdapter } from '../../provider-data-adapter';
import { createClientAndSyncChain } from '../create-client-and-sync-chain';
import type { MultiConnectProvider } from './multi-connect-provider';

export class WalletConnectV2Adapter implements IWalletAdapter {

  readonly data: IDataAdapter & IProviderDataAdapterInternal;

  private provider: MultiConnectProvider | null = null

  client: WalletClient | null = null;

  constructor(private readonly providerDetail: Omit<EIP6963ProviderDetail, 'provider'>) {
    this.data = new ProviderDataAdapter(this.providerDetail.info);
  }

  async isConnected(): Promise<boolean> {
    return false;
  }

  async connect(chainId: ChainId): Promise<boolean> {
    if (!this.provider) {
      const provider = await import('./multi-connect-provider').then(m => m.MultiConnectProvider.connect())
      this.client = await createClientAndSyncChain(chainId, provider)
      this.data.setProvider(provider)
      this.provider = provider
    } else {
      await this.provider.connect()
    }
    return true
  }

  async restoreConnect(): Promise<boolean> {
    if (!this.provider) {
      const provider = await import('./multi-connect-provider').then(m => m.MultiConnectProvider.restoreConnect())
      this.client = await createClientAndSyncChain(provider.chainId, provider)
      this.data.setProvider(provider)
      this.provider = provider
    } else {
      await this.provider.restoreConnect()
    }
    return true
  }

  async disconnect(): Promise<boolean> {
    return false;
  }

  async changeChain(chainId: ChainId): Promise<boolean> {
    this.client?.switchChain({ id: chainId })
    return true;
  }

  setActiveAddress(address: Address | null): void {
    this.provider?.setActiveAddress(address)
  }

}
