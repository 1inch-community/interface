import { EIP6963ProviderDetail } from "@one-inch-community/models";

export function getInjectedProviderSupported() {
  return !!window.ethereum
}

export async function getInjectedProviderDetail(): Promise<EIP6963ProviderDetail> {
  if (!window.ethereum) throw new Error('injected provider not supported');
  return {
    provider: window.ethereum,
    info: {
      walletId: 'injectedWalletId',
      uuid: 'injectedWallet',
      name: 'Browser wallet',
      icon: await getIcon()
    }
  }
}

const icons = {
  default: () => import('./injected-wallet-icons/default-icon').then(m => m.icon)
}

export function getIcon() {
  return icons.default()
}