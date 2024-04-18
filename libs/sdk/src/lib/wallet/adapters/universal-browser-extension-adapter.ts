import { ChainId, EIP6963ProviderDetail, IWalletAdapter } from '@one-inch-community/models';
import { createClient, createClientAndSyncChain } from './create-client-and-sync-chain';
import { Address, WalletClient } from 'viem';
import { ProviderDataAdapter } from '../provider-data-adapter';

export class UniversalBrowserExtensionAdapter implements IWalletAdapter {

  readonly data: ProviderDataAdapter

  client: WalletClient | null = null

  constructor(private readonly providerDetail: EIP6963ProviderDetail) {
    this.data = new ProviderDataAdapter(this.providerDetail.info)
  }

  async connect(chainId: ChainId): Promise<boolean> {
    this.client = await createClientAndSyncChain(chainId, this.providerDetail.provider)
    this.data.setProvider(this.providerDetail.provider)
    return true;
  }

  async restoreConnect(): Promise<boolean> {
    this.data.setProvider(this.providerDetail.provider)
    const addresses = await this.data.getAddresses()
    const chainId = await this.data.getChainId()
    const state = addresses.length > 0 && chainId !== null
    if (!state) {
      this.data.setProvider(null)
    } else {
      this.client = createClient(chainId, this.providerDetail.provider)
    }
    return state
  }

  async disconnect(): Promise<boolean> {
    this.client = null
    this.data.setProvider(null)
    return true;
  }

  async changeChain(chainId: ChainId): Promise<boolean> {
    if (!this.client) return false;
    await this.client.switchChain({ id: chainId })
    return true
  }

  async isConnected() {
    const addresses = await this.client?.getAddresses() ?? []
    return addresses.length > 0
  }

  setActiveAddress(address: Address): void {
    this.data.setActiveAddress(address)
  }

}