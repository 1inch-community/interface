import { Observable } from 'rxjs';
import { WalletAdapter } from './wallet-adapter.interface';
import {ChainId} from "./chain-id.enum";

export interface IWalletConnectionInnerHandler {
    currentWalletAdapter$: Observable<WalletAdapter | null>
    appChainId$: Observable<ChainId>
}
