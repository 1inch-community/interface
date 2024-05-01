import { ChainId, IConnectWalletController, IConnectWalletControllerInternal, IWalletAdapter, EIP6963ProviderDetail, EIP6963ProviderInfo, IDataAdapter } from "@one-inch-community/models"
import { debounceTime, defaultIfEmpty, fromEvent, Subject, take, takeUntil, tap, timer } from 'rxjs';
import { UniversalBrowserExtensionAdapter } from './adapters/universal-browser-extension-adapter';
import { Address } from 'viem';
import { GlobalDataAdapter } from './global-data-adapter';
import {
  addConnectedWallet, getActiveAddress,
  getActiveWallet,
  getChainIdFromStorage,
  getConnectedWallet,
  removeConnectedWallet,
  setActiveWallet
} from './storage';
import { adapterId } from './adapter-id';
import { getInjectedProviderDetail, getInjectedProviderSupported } from './injected-provider-detail';

export class WalletControllerImpl implements IConnectWalletController, IConnectWalletControllerInternal {

  readonly data = new GlobalDataAdapter(this)

  readonly activeAdapters = new Map<string, IWalletAdapter>()
  readonly update$ = new Subject<void>()

  private currentActiveAdapterId: string | null = null
  private readonly adapters = new Map<string, IWalletAdapter>()

  get isConnected(): boolean {
    return this.currentActiveAdapter !== null
  }

  get currentActiveAdapter(): IWalletAdapter | null {
    if (!this.currentActiveAdapterId) return null
    return this.activeAdapters.get(this.currentActiveAdapterId) ?? null
  }

  async init(): Promise<void> {
    await this.initWallets()
    await this.restoreChainId()
    await this.restoreWalletConnection()
    this.update$.next()
  }

  async getSupportedWallets() {
    const info: EIP6963ProviderInfo[] = []
    this.adapters.forEach(adapter => info.push(adapter.data.getInfo()))
    return info.sort((info1, info2) => {
      const id1 = adapterId(info1)
      const id2 = adapterId(info2)
      if (id1 === this.currentActiveAdapterId && id2 !== this.currentActiveAdapterId) {
        return -1
      }
      if (id1 !== this.currentActiveAdapterId && id2 === this.currentActiveAdapterId) {
        return 1
      }
      if (this.activeAdapters.has(id1) && this.activeAdapters.has(id2)) {
        return 0
      }
      if (this.activeAdapters.has(id1) && !this.activeAdapters.has(id2)) {
        return -1
      }
      if (!this.activeAdapters.has(id1) && this.activeAdapters.has(id2)) {
        return 1
      }

      return 0
    })
  }

  async connect(info: EIP6963ProviderInfo) {
    const chainId = await this.data.getChainId()
    const id = adapterId(info)
    if (!this.adapters.has(id)) {
      throw new Error(`Invalid wallet info ${info.name} not exist`)
    }
    const connectState = await this.connectInner(chainId, id)
    this.afterConnectWallet(connectState, id)
    this.update$.next()
    return connectState
  }

  async disconnect() {
    if (this.currentActiveAdapter === null) return true
    try {
      const state = await this.currentActiveAdapter.disconnect()
      this.currentActiveAdapterId && this.activeAdapters.delete(this.currentActiveAdapterId)
      this.currentActiveAdapterId && removeConnectedWallet(this.currentActiveAdapterId)
      this.currentActiveAdapterId = null
      this.update$.next()
      return state
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async changeChain(chainId: ChainId) {
    let state = true
    if (this.currentActiveAdapter) {
      try {
        state = await this.currentActiveAdapter.changeChain(chainId)
      } catch (error) {
        state = false
      }
    }
    if (state) {
      this.data.setChainId(chainId)
    }
    return state
  }

  getDataAdapter(info: EIP6963ProviderInfo): IDataAdapter {
    const id = adapterId(info)
    const adapter: IWalletAdapter | undefined = this.adapters.get(id)
    if (!adapter) {
      throw new Error(`Invalid wallet info ${info.name} not exist`)
    }
    return adapter.data
  }

  async setActiveAddress(info: EIP6963ProviderInfo, address: Address) {
    const id = adapterId(info)
    return await this.setActiveAddressInner(id, address)
  }

  private async setActiveAddressInner(id: string, address: Address) {
    let state = true
    if (this.currentActiveAdapterId !== id) {
      const chainId = await this.data.getChainId()
      if (!this.adapters.has(id)) {
        throw new Error(`Invalid wallet not exist`)
      }
      state = await this.connectInner(chainId, id)
      this.afterConnectWallet(state, id)
    }
    if (state) {
      this.currentActiveAdapter?.setActiveAddress(address)
    }
    this.update$.next()
  }

  private async connectInner(chainId: ChainId, walletId: string, retry = false): Promise<boolean> {
    const adapter: IWalletAdapter | undefined = this.adapters.get(walletId)
    if (!adapter) {
      throw new Error(`Invalid wallet id`)
    }
    let connectState: boolean
    if (!this.activeAdapters.has(walletId) || retry) {
      try {
        connectState = await adapter.connect(chainId);
      } catch (error) {
        connectState = false
      }
      connectState && this.activeAdapters.set(walletId, adapter)
    } else {
      connectState = await adapter.isConnected()
      if (!retry) {
        connectState = await this.connectInner(chainId, walletId, true)
      }
    }
    return connectState
  }

  private async restoreConnectInner(walletId: string): Promise<boolean> {
    const adapter: IWalletAdapter | undefined = this.adapters.get(walletId)
    if (!adapter) {
      throw new Error(`Invalid wallet id`)
    }
    let connectState: boolean
    if (!this.activeAdapters.has(walletId)) {
      try {
        connectState = await adapter.restoreConnect();
      } catch (error) {
        connectState = false
      }
      connectState && this.activeAdapters.set(walletId, adapter)
    } else {
      connectState = await adapter.isConnected()
    }
    return connectState
  }

  private async restoreChainId() {
    const chainId = getChainIdFromStorage()
    if (!chainId) return
    await this.changeChain(chainId)
  }

  private async restoreWalletConnection() {
    const activeWalletId = getActiveWallet()
    const connectedWallet: string[] | null = getConnectedWallet()
    if (!connectedWallet) return
    await this.getSupportedWallets()
    const chainId = await this.data.getChainId()
    for (const id of connectedWallet) {
      if (id === activeWalletId) continue
      if (!this.adapters.has(id)) continue
      const connectState = await this.restoreConnectInner(id).catch(() => false)
      this.afterConnectWallet(connectState, id)
    }
    if (!activeWalletId || !this.adapters.has(activeWalletId)) return
    const connectState = await this.connectInner(chainId, activeWalletId)
    this.afterConnectWallet(connectState, activeWalletId)
    if (!connectState) return
    const activeAddressFromStore = getActiveAddress()
    if (!activeAddressFromStore || !this.currentActiveAdapter) return
    const addresses = await this.currentActiveAdapter.data.getAddresses()
    if (!addresses.includes(activeAddressFromStore)) return
    await this.setActiveAddressInner(activeWalletId, activeAddressFromStore)
  }

  private initWallets() {
    return new Promise<void>(resolve => {
      let skipInjectedProvider = false
      fromEvent<CustomEvent<EIP6963ProviderDetail>>(window, 'eip6963:announceProvider').pipe(
        tap((event) => {
          skipInjectedProvider = isEqualsProviders(window.ethereum, event.detail.provider)
          const id = adapterId(event.detail.info)
          if (!this.adapters.has(id)) {
            this.adapters.set(id, new UniversalBrowserExtensionAdapter(event.detail))
          }
        }),
        debounceTime(100),
        take(1),
        takeUntil(timer(100)),
        defaultIfEmpty(null),
        tap(async () => {
          if (!skipInjectedProvider && getInjectedProviderSupported()) {
            const injectedProviderDetail = await getInjectedProviderDetail()
            const id = adapterId(injectedProviderDetail.info)
            if (!this.adapters.has(id)) {
              this.adapters.set(id, new UniversalBrowserExtensionAdapter(injectedProviderDetail))
            }
          }
          resolve()
        }),
      ).subscribe()
      window.dispatchEvent(new Event("eip6963:requestProvider"))
    })
  }

  private afterConnectWallet(connectState: boolean, id: string) {
    if (connectState) {
      this.currentActiveAdapterId = id;
      addConnectedWallet(id)
      setActiveWallet(id)
    } else {
      removeConnectedWallet(id)
      const currentActiveWalletIdFromStore = getActiveWallet()
      if (currentActiveWalletIdFromStore === id) {
        setActiveWallet(null)
      }
      if (this.currentActiveAdapterId === id) {
        this.currentActiveAdapterId = null;
      }
      if (this.activeAdapters.has(id)) {
        const adapter = this.adapters.get(id)!
        adapter.disconnect().catch()
        this.activeAdapters.delete(id)
      }
    }
  }
}

function isEqualsProviders(provider1: any, provider2: any): boolean {
  if (provider1 === provider2) return true
  const keys1 = Object.keys(provider1)
  const keys2 = Object.keys(provider2)
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (provider1[key] !== provider2[key]) {
      return false;
    }
  }
  return true
}

export function createConnectWalletController(): IConnectWalletController {
  return new WalletControllerImpl()
}