import {Inject, Injectable, Injector, Optional, runInInjectionContext, Type} from "@angular/core";
import {WalletClient} from "viem";
import {BehaviorSubject, catchError, Observable, of, switchMap,} from "rxjs";
import {
  ChainId,
  IWalletConnectionHandler,
  IWalletConnectionInnerHandler,
  WalletAdapter,
  WalletConfigItem,
  WalletConfigItemBase,
  WalletConfigItemConnectType,
  WalletSupportedConfig
} from "../models";
import {InjectedWalletAdapter} from "./adapters/injected-wallet.adapter";
import {WalletConfigItemToken, WalletSupportedConfigToken} from "../injection-tokens";
import {WalletEvents, WalletEventsType} from "./wallet-events";
import {WalletConnectV2WalletAdapter} from "./adapters/wallet-connect-v2-wallet-adapter";

@Injectable({
  providedIn: "root"
})
export class WalletConnectionHandler implements IWalletConnectionHandler, IWalletConnectionInnerHandler {

  readonly appChainId$ = new BehaviorSubject<ChainId>(ChainId.ethereumMainnet);

  readonly currentWalletAdapter$ = new BehaviorSubject<WalletAdapter | null>(null);

  private readonly innerCurrentWalletConfigItem$ = new BehaviorSubject<WalletConfigItem | null>(null);

  private get currentWalletAdapter() {
    return this.currentWalletAdapter$.value;
  }

  get client(): WalletClient | undefined {
    return this.currentWalletAdapter?.client;
  }

  get currentWalletConfigItem$(): Observable<WalletConfigItem | null> {
    return this.innerCurrentWalletConfigItem$
  }

  protected readonly disconnectHandler$ = this.currentWalletAdapter$.pipe(
    switchMap((adapter) => {
      if (adapter === null) return of(null);
      return adapter.disconnect$.pipe(
        switchMap(() => this.disconnect())
      );
    }),
    catchError((error) => {
      console.warn(error);
      return of(null);
    })
  );

  constructor(
    private readonly injector: Injector,
    private readonly events: WalletEvents,
    @Optional() @Inject(WalletSupportedConfigToken) private readonly config: WalletSupportedConfig,
  ) {
    this.disconnectHandler$.subscribe()
  }

  async connect(id: string, chainId?: ChainId): Promise<boolean>
  async connect(walletItem: WalletConfigItem, chainId?: ChainId): Promise<boolean>
  async connect(walletItemOrId: WalletConfigItem | string, chainId?: ChainId): Promise<boolean> {
    const innerChainId = (chainId ?? this.appChainId$.value)
    this.events.emit(WalletEventsType.connectStart, {chainId: innerChainId})
    const walletItem = typeof walletItemOrId === "string"
      ? this.config.find(item => item.id === walletItemOrId)
      : walletItemOrId
    if (!walletItem) {
      console.warn(`wallet config ${walletItemOrId} not found`)
      this.events.emit(WalletEventsType.connectError, {chainId: innerChainId})
      return false;
    }
    const walletAdapter = this.resolveAdapter(walletItem);
    const state = await this.createConnection(walletItem, innerChainId, walletAdapter);
    if (state) {
      this.events.emit(WalletEventsType.connectComplete, {chainId: innerChainId, walletItemId: walletItem.id})
    } else {
      this.events.emit(WalletEventsType.connectError, {chainId: innerChainId})
    }
    return state
  }

  async reconnect(walletItem: WalletConfigItem, chainId?: ChainId): Promise<boolean> {
    const innerChainId = chainId ?? this.appChainId$.value
    this.events.emit(WalletEventsType.reconnectStart, {chainId: innerChainId})
    const walletAdapter = this.resolveAdapter(walletItem);
    if (await walletAdapter.isProviderConnected(chainId ?? this.appChainId$.value)) {
      const isConnectComplete = await this.createConnection(walletItem, innerChainId, walletAdapter);
      if (!isConnectComplete) {
        this.events.emit(WalletEventsType.reconnectError, {chainId: innerChainId})
        return false;
      }
    } else {
      await this.disconnect();
      this.events.emit(WalletEventsType.reconnectError, {chainId: innerChainId})
      return false
    }
    this.currentWalletAdapter$.next(walletAdapter);
    this.events.emit(WalletEventsType.reconnectComplete, {chainId: innerChainId, walletItemId: walletItem.id})
    return true;
  }

  async fastReconnectAvailable(walletItem: WalletConfigItem, chainId: ChainId): Promise<boolean> {
    const walletAdapter = this.resolveAdapter(walletItem);
    return walletAdapter.fastReconnectAvailable(chainId);
  }

  async disconnect(): Promise<boolean> {
    this.events.emit(WalletEventsType.disconnectStart, null)
    if (!this.currentWalletAdapter) {
      this.events.emit(WalletEventsType.disconnectError, null)
      return false;
    }
    try {
      await this.currentWalletAdapter.disconnect();
    } catch (error) {
      console.warn(error)
      this.events.emit(WalletEventsType.disconnectError, null)
      return false
    }
    this.currentWalletAdapter$.next(null);
    this.events.emit(WalletEventsType.disconnectComplete, null)
    return true
  }

  async setChainId(chainId: ChainId): Promise<boolean> {
    this.events.emit(WalletEventsType.changeChainIdStart, { chainId })
    if (this.currentWalletAdapter) {
      try {
        const status = await this.currentWalletAdapter.changeChainId(chainId);
        if (status) {
          this.events.emit(WalletEventsType.changeChainIdComplete, { chainId })
        } else {
          this.events.emit(WalletEventsType.changeChainIdError, { chainId })
        }
        return status
      } catch (error) {
        console.warn(error)
        this.events.emit(WalletEventsType.changeChainIdError, { chainId })
        return false
      }
    }
    this.appChainId$.next(chainId);
    this.events.emit(WalletEventsType.changeChainIdComplete, { chainId })
    return true
  }

  private async createConnection(
    item: WalletConfigItem,
    chainId: ChainId,
    walletAdapter: WalletAdapter,
  ): Promise<boolean> {
    if (!walletAdapter) {
      throw new Error(`Wallet adapter not found: ${item.connectType}`);
    }
    try {
      const isConnectComplete = await walletAdapter.connect(chainId);
      if (!isConnectComplete) {
        return false;
      }
      this.currentWalletAdapter$.next(walletAdapter);
      this.innerCurrentWalletConfigItem$.next(item);
      return true;
    } catch (error) {
      console.warn(error);
      return false;
    }
  }

  private getAdapter(item: WalletConfigItem): Type<WalletAdapter> {
    switch (item.connectType) {
      case WalletConfigItemConnectType.injected:
        return InjectedWalletAdapter;
      case WalletConfigItemConnectType.walletConnectV2:
        return WalletConnectV2WalletAdapter;
      case WalletConfigItemConnectType.custom:
        return item.adapter;
      default:
        throw new Error(`Unknown wallet adapter type: ${(item as WalletConfigItemBase).connectType}`);
    }
  }

  private resolveAdapter(item: WalletConfigItem): WalletAdapter {
    const adapterType = this.getAdapter(item);
    const injector = Injector.create({
      parent: this.injector,
      providers: [{provide: WalletConfigItemToken, useValue: item}],
    });
    return runInInjectionContext(injector, () => new adapterType());
  }

}
