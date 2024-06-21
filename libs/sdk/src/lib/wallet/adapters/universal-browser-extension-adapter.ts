import { ChainId, EIP6963ProviderDetail, IWalletAdapter } from '@one-inch-community/models';
import { createClient, createClientAndSyncChain } from './create-client-and-sync-chain';
import {
  Address, Hex,
  SignTypedDataParameters,
  SignTypedDataReturnType,
  WalletClient,
  WriteContractParameters,
  WriteContractReturnType
} from 'viem';
import { ProviderDataAdapter } from '../provider-data-adapter';
import { isUserRejectError, WalletError } from '../wallet-errors';

export class UniversalBrowserExtensionAdapter implements IWalletAdapter {

  readonly data: ProviderDataAdapter;

  client: WalletClient | null = null;

  constructor(private readonly providerDetail: EIP6963ProviderDetail) {
    this.data = new ProviderDataAdapter(this.providerDetail.info);
  }

  async connect(chainId: ChainId): Promise<boolean> {
    this.client = await createClientAndSyncChain(chainId, this.providerDetail.provider)
    this.data.setProvider(this.providerDetail.provider)
    return true;
  }

  async restoreConnect(chainId: ChainId, force: boolean): Promise<boolean> {
    this.data.setProvider(this.providerDetail.provider)
    const addresses = await this.data.getAddresses()
    const state = addresses.length > 0 && chainId !== null
    if (!state) {
      this.data.setProvider(null)
    } else {
      this.client = createClient(chainId, this.providerDetail.provider)
    }
    if (!state && force) {
      return this.connect(chainId)
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

  async writeContract(params: WriteContractParameters): Promise<WriteContractReturnType> {
    if (!(await this.isConnected()) || !this.client) {
      throw new Error('Wallet not connected')
    }
    return await this.client.writeContract(params)
  }

  async signTypedData(typeData: SignTypedDataParameters): Promise<SignTypedDataReturnType> {
    if (!(await this.isConnected()) || !this.client) {
      throw new Error('Wallet not connected')
    }
    try {
      return await this.client.signTypedData(typeData)
    } catch (error: any) {
      if (isUserRejectError(error as WalletError)) {
        throw new error
      }
      console.log(error)
    }
    const address = (await this.data.getActiveAddress())!
    const data = JSON.stringify(typeData, stringifyReplacer)
    return await this.providerDetail.provider.request({
      method: 'eth_signTypedData_v3',
      params: [address, data],
    }) as Hex
  }

}

function stringifyReplacer(_: string, value: unknown) {
  if (typeof value === 'bigint') {
    return value.toString();
  }

  return value
}
