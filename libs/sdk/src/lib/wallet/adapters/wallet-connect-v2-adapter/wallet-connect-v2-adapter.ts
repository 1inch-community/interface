import {
  ChainId,
  EIP6963ProviderDetail,
  IDataAdapter,
  IProviderDataAdapterInternal,
  IWalletAdapter
} from '@one-inch-community/models';
import {
  Address,
  SignTypedDataParameters,
  SignTypedDataReturnType,
  WalletClient,
  WriteContractParameters,
  WriteContractReturnType
} from 'viem';
import { ProviderDataAdapter } from '../../provider-data-adapter';
import { createClientAndSyncChain } from '../create-client-and-sync-chain';
import type { MultiConnectProvider } from './multi-connect-provider';
import { firstValueFrom, switchMap, throwError, timer } from 'rxjs';

export class WalletConnectV2Adapter implements IWalletAdapter {

  readonly data: IDataAdapter & IProviderDataAdapterInternal;

  private provider: MultiConnectProvider | null = null;

  client: WalletClient | null = null;

  constructor(private readonly providerDetail: Omit<EIP6963ProviderDetail, 'provider'>) {
    this.data = new ProviderDataAdapter(this.providerDetail.info);
  }

  async isConnected(): Promise<boolean> {
    return this.provider?.isConnected() ?? false
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
    this.provider?.disconnect()
    return true;
  }

  async changeChain(chainId: ChainId): Promise<boolean> {
    await this.client?.switchChain({ id: chainId })
    return true;
  }

  setActiveAddress(address: Address | null): void {
    this.provider?.setActiveAddress(address)
  }

  async writeContract(params: WriteContractParameters): Promise<WriteContractReturnType> {
    if (!(await this.isConnected()) || !this.client) {
      throw new Error('Wallet not connected')
    }
    return await Promise.any([
      this.client.writeContract(params),
      firstValueFrom(timer(60 * 1000 * 3).pipe( // 3 min
        switchMap(() => throwError(() => new Error('wallet connect request timed out'))),
      ))
    ])
  }

  async signTypedData(typeData: SignTypedDataParameters): Promise<SignTypedDataReturnType> {
    if (!(await this.isConnected()) || !this.client) {
      throw new Error('Wallet not connected')
    }
    return await Promise.race([
      this.client.signTypedData(typeData),
      firstValueFrom(timer(60 * 1000 * 3).pipe( // 3 min
        switchMap(() => throwError(() => new Error('wallet connect request timed out'))),
      ))
    ])
  }
}
