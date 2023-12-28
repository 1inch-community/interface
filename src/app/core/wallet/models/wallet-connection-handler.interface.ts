import { WalletConfigItem } from "./wallet-supported-config";
import {ChainId} from "./chain-id.enum";

export interface IWalletConnectionHandler {
    connect(id: string, chainId?: ChainId): Promise<boolean>
    connect(walletItem: WalletConfigItem, chainId?: ChainId): Promise<boolean>
    reconnect(walletItem: WalletConfigItem, chainId?: ChainId): Promise<boolean>
    fastReconnectAvailable(walletItem: WalletConfigItem, chainId: ChainId): Promise<boolean>
    disconnect(): Promise<boolean>
    setChainId(chainId: ChainId): Promise<boolean>
}
