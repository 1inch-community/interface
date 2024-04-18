import { Observable } from 'rxjs';
import { Address, ProviderRpcError } from 'viem';
import { ChainId } from '../chain';
import { EIP1193Provider, EIP6963ProviderInfo } from './provider';

export interface IDataAdapter {
  readonly info$: Observable<EIP6963ProviderInfo>
  readonly addresses$: Observable<Address[]>
  readonly activeAddress$: Observable<Address | null>
  readonly chainId$: Observable<ChainId | null>
  readonly disconnect$: Observable<ProviderRpcError>
  readonly isConnected$: Observable<boolean>

  getInfo(): EIP6963ProviderInfo
  getAddresses(): Promise<Address[]>
  getActiveAddress(): Promise<Address | null>
  getChainId(): Promise<ChainId | null>
  isConnected(): Promise<boolean>
}

export interface IProviderDataAdapterInternal {
  setProvider(provider: EIP1193Provider | null): void
  setActiveAddress(address: Address | null): void
}

export interface IGlobalDataAdapter {
  isActiveAddress(info: EIP6963ProviderInfo, address: Address): Promise<boolean>
  isActiveWallet(info: EIP6963ProviderInfo): boolean
  isActiveAddress$(info: EIP6963ProviderInfo, address: Address): Observable<boolean>
  isActiveWallet$(info: EIP6963ProviderInfo): Observable<boolean>
}

export interface IGlobalDataAdapterInternal {
  setChainId(chainId: ChainId): void
}