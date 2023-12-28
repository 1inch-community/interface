import {injectedProviderAvailable, WalletConfigItemConnectType, WalletSupportedConfig} from "@1inch/v3/core/wallet";

export const config: WalletSupportedConfig = [
  {
    id: 'inchWallet',
    displayName: '1inch Wallet',
    iconName: '1inch-wallet',
    connectType: WalletConfigItemConnectType.walletConnectV2,
    walletMetaName: '1inch Wallet',
    showModalWhenWaitingWallet: true,
  },
  {
    id: 'injected',
    displayName: 'Metamask',
    iconName: 'metamask',
    disabled: !injectedProviderAvailable(),
    connectType: WalletConfigItemConnectType.injected,
    showModalWhenWaitingWallet: true,
  },
  {
    id: 'wc2',
    displayName: 'WalletConnect',
    iconName: 'wallet-connect-v2',
    connectType: WalletConfigItemConnectType.walletConnectV2,
    showModalWhenWaitingWallet: true,
  },
]
