import { ChainId } from '../chain';
import type {
  Address,
  SignTypedDataParameters,
  SignTypedDataReturnType,
  WalletClient,
  WriteContractParameters,
  WriteContractReturnType
} from 'viem';
import { IDataAdapter, IProviderDataAdapterInternal } from './data-adapter';
import { EIP6963ProviderInfo } from './provider';

export interface IWalletAdapter {
  readonly data: IDataAdapter & IProviderDataAdapterInternal
  readonly client: WalletClient | null
  readonly info: EIP6963ProviderInfo
  isConnected(): Promise<boolean>
  connect(chainId: ChainId): Promise<boolean>
  restoreConnect(chainId: ChainId, force?: boolean): Promise<boolean>
  disconnect(): Promise<boolean>
  changeChain(chainId: ChainId): Promise<boolean>
  setActiveAddress(address: Address | null): void
  writeContract(params: WriteContractParameters): Promise<WriteContractReturnType>
  signTypedData(typeData: SignTypedDataParameters): Promise<SignTypedDataReturnType>
}
