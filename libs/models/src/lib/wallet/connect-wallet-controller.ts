import { ChainId } from '../chain';
import { IWalletAdapter } from './wallet-adapter';
import { Observable } from 'rxjs';
import { EIP6963ProviderInfo } from './provider';
import { IDataAdapter, IGlobalDataAdapter } from './data-adapter';
import type { Address, SignTypedDataParameters, WriteContractParameters, WriteContractReturnType, SignTypedDataReturnType } from 'viem';

export interface IConnectWalletController {
  readonly data: IDataAdapter & IGlobalDataAdapter;
  readonly isConnected: boolean;
  init(): Promise<void>
  getSupportedWallets(): Promise<EIP6963ProviderInfo[]>
  connect(info: EIP6963ProviderInfo): Promise<boolean>
  addConnection(info: EIP6963ProviderInfo): Promise<boolean>
  disconnect(): Promise<boolean>
  changeChain(chainId: ChainId): Promise<boolean>
  getDataAdapter(info: EIP6963ProviderInfo): IDataAdapter
  setActiveAddress(info: EIP6963ProviderInfo, address: Address): Promise<void>
  writeContract(params: WriteContractParameters): Promise<WriteContractReturnType>
  signTypedData(typeData: SignTypedDataParameters): Promise<SignTypedDataReturnType>
}

export interface IConnectWalletControllerInternal {
  readonly currentActiveAdapter: IWalletAdapter | null
  readonly activeAdapters: Map<string, IWalletAdapter>
  readonly update$: Observable<void>
}
