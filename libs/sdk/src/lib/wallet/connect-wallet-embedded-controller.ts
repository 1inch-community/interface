import {
  ChainId, EIP6963ProviderInfo, EmbeddedBootstrapConfig,
  IConnectWalletController,
  IConnectWalletControllerInternal,
  IDataAdapter,
  IWalletAdapter
} from '@one-inch-community/models';
import { Subject } from 'rxjs';
import {
  Address,
  WriteContractParameters,
  WriteContractReturnType,
  SignTypedDataParameters,
  SignTypedDataReturnType
} from 'viem';
import { GlobalDataAdapter } from './global-data-adapter';
import { getInjectedProviderDetail } from './injected-provider-detail';
import { adapterId } from './adapter-id';
import { UniversalBrowserExtensionAdapter } from './adapters/universal-browser-extension-adapter';

export class ConnectWalletEmbeddedController implements IConnectWalletController, IConnectWalletControllerInternal {

  currentActiveAdapter: IWalletAdapter | null = null;
  activeAdapters: Map<string, IWalletAdapter> = new Map();

  readonly data = new GlobalDataAdapter(this)
  readonly update$: Subject<void> = new Subject<void>()

  get isConnected(): boolean {
    return true
  }

  get connectedWalletInfo() {
    return this.currentActiveAdapter?.info ?? null
  }

  constructor(private readonly config: EmbeddedBootstrapConfig) {
  }

  async init(): Promise<void> {
    if (!this.config.walletProvider) return
    const injectedProviderDetail = await getInjectedProviderDetail(this.config.walletProvider)
    const id = adapterId(injectedProviderDetail.info)
    const adapter = new UniversalBrowserExtensionAdapter(injectedProviderDetail)
    this.activeAdapters.set(id, adapter)
    await adapter.connect(this.config.chainId)
    this.currentActiveAdapter = adapter
    this.update$.next()
  }

  async getSupportedWallets(): Promise<EIP6963ProviderInfo[]> {
    const injectedProviderDetail = await getInjectedProviderDetail(this.config.walletProvider)
    return [injectedProviderDetail.info]
  }

  async writeContract(params: WriteContractParameters): Promise<WriteContractReturnType> {
    if (!this.currentActiveAdapter || !this.currentActiveAdapter.client) {
      throw new Error('Wallet not connected')
    }
    return await this.currentActiveAdapter.writeContract(params)
  }

  async signTypedData(typeData: SignTypedDataParameters) {
    if (!this.currentActiveAdapter || !this.currentActiveAdapter.client) {
      throw new Error('Wallet not connected')
    }
    return await this.currentActiveAdapter.signTypedData(typeData)
  }

  async changeChain(chainId: ChainId): Promise<boolean> {
    if (!this.currentActiveAdapter || !this.currentActiveAdapter.client) {
      throw new Error('Wallet not connected')
    }
    return await this.currentActiveAdapter.changeChain(chainId)
  }

  connect(info: EIP6963ProviderInfo): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  addConnection(info: EIP6963ProviderInfo): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  disconnect(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  getDataAdapter(info: EIP6963ProviderInfo): IDataAdapter {
    throw new Error('Method not implemented.');
  }

  setActiveAddress(info: EIP6963ProviderInfo, address: Address): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
