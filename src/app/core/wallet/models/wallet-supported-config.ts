import {WalletAdapter} from "./wallet-adapter.interface";
import {Type} from "@angular/core";

export type WalletSupportedConfig = WalletConfigItem[]

export type WalletConfigItem<Meta = unknown> =
  | WalletConfigItemCustom<Meta>
  | WalletConfigItemInjected<Meta>
  | WalletConfigItemWalletConnectV2<Meta>

export enum WalletConfigItemConnectType {
  custom = 'custom',
  injected = 'injected',
  walletConnectV2 = 'walletConnectV2',
}

export interface WalletConfigItemBase<Meta = unknown> {
  id: string;
  connectType: WalletConfigItemConnectType;
  displayName?: string;
  iconName?: string;
  disabled?: boolean
  showModalWhenWaitingWallet?: boolean
  meta?: Meta
}

interface WalletConfigItemCustom<Meta = unknown> extends WalletConfigItemBase<Meta> {
  connectType: WalletConfigItemConnectType.custom;
  adapter: Type<WalletAdapter>;
}

interface WalletConfigItemInjected<Meta = unknown> extends WalletConfigItemBase<Meta> {
  connectType: WalletConfigItemConnectType.injected;
}

export interface WalletConfigItemWalletConnectV2<Meta = unknown> extends WalletConfigItemBase<Meta> {
  connectType: WalletConfigItemConnectType.walletConnectV2;
  walletMetaName?: string
}
