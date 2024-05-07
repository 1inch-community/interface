import { default as WcEthereumProvider, EthereumProviderOptions } from '@walletconnect/ethereum-provider';
import { UniversalProvider } from '@walletconnect/universal-provider';
import Dexie, { Table } from 'dexie';


export class EthereumProvider extends WcEthereumProvider {

  static async initProvider(opts: EthereumProviderOptions, persistStorePrefix: string): Promise<EthereumProvider> {
    const provider = new EthereumProvider(persistStorePrefix);
    await provider.initialize(opts, );
    return provider;
  }

  constructor(private readonly persistStorePrefix: string) {
    super();
  }

  protected override async initialize(opts: EthereumProviderOptions) {
    this.rpc = this.getRpcConfig(opts);
    this.chainId = this.rpc.chains.length
      ? getEthereumChainId(this.rpc.chains)
      : getEthereumChainId(this.rpc.optionalChains);
    this.signer = await UniversalProvider.init({
      projectId: this.rpc.projectId,
      metadata: this.rpc.metadata,
      disableProviderPing: opts.disableProviderPing,
      relayUrl: opts.relayUrl,
      storageOptions: opts.storageOptions,
      storage: WalletConnectStorage.init(this.persistStorePrefix)
    });
    this.registerEventListeners();
    await this.loadPersistedSession();
    if (this.rpc.showQrModal) {
      let WalletConnectModalClass;
      try {
        const { WalletConnectModal } = await import("@walletconnect/modal");
        WalletConnectModalClass = WalletConnectModal;
      } catch {
        throw new Error("To use QR modal, please install @walletconnect/modal package");
      }
      if (WalletConnectModalClass) {
        try {
          this.modal = new WalletConnectModalClass({
            projectId: this.rpc.projectId,
            ...this.rpc.qrModalOptions,
          });
        } catch (e) {
          this.signer.logger.error(e);
          throw new Error("Could not generate WalletConnectModal Instance");
        }
      }
    }
  }

  override async disconnect() {
    await super.disconnect();
    await this.dropPersist()
  }

  async dropPersist() {
    return (this.signer.client.core.storage as WalletConnectStorage).dropStorage()
  }

}

export class WalletConnectStorage extends Dexie {

  static async dropStorage(persistStorePrefix: string) {
    const storage = WalletConnectStorage.init(persistStorePrefix)
    await storage.dropStorage()
  }

  static async dropStorageByName(name: string) {
    const storage = new WalletConnectStorage(name)
    await storage.dropStorage()
  }

  static getDatabaseName(persistStorePrefix: string) {
    return `wallet-connect-connection-storage-${persistStorePrefix}`
  }

  static init(persistStorePrefix: string) {
    return new WalletConnectStorage(WalletConnectStorage.getDatabaseName(persistStorePrefix))
  }

  private data!: Table<{key: string, value: unknown}, string>;

  constructor(name: string) {
    super(name)
    this.version(1).stores({
      data: [
        'key',
        'value',
      ].join(', '),
    });
  }

  async dropStorage() {
    this.delete()
  }

  async getKeys(): Promise<string[]> {
    const keys = await this.data.toCollection().keys()
    return keys as string[]
  }

  async getEntries<T = unknown>(): Promise<[string, T][]> {
    const entries: [string, T][] = []
    await this.data.each(data => {
      entries.push([ data.key, data.value as T ])
    })
    return entries
  }

  async getItem<T = unknown>(key: string): Promise<T | undefined> {
    return await this.data.get(key).then(data => data?.value) as T | undefined
  }

  async setItem<T = unknown>(key: string, value: T): Promise<void> {
    await this.data.put({ key, value })
  }

  async removeItem(key: string): Promise<void> {
    await this.data.delete(key)
  }
}

export function getEthereumChainId(chains: string[]): number {
  return Number(chains[0].split(":")[1]);
}
