import { ChainId } from '../chain';
import { Address, WalletClient } from 'viem';
import { IDataAdapter, IProviderDataAdapterInternal } from './data-adapter';

export interface IWalletAdapter {
  readonly data: IDataAdapter & IProviderDataAdapterInternal
  readonly client: WalletClient | null
  isConnected(): Promise<boolean>
  connect(chainId: ChainId): Promise<boolean>
  restoreConnect(chainId: ChainId, force?: boolean): Promise<boolean>
  disconnect(): Promise<boolean>
  changeChain(chainId: ChainId): Promise<boolean>
  setActiveAddress(address: Address | null): void
}
