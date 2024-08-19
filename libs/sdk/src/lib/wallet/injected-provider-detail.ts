import { EIP6963ProviderDetail } from "@one-inch-community/models";

export function getInjectedProviderSupported() {
  return !!window.ethereum
}

export async function getInjectedProviderDetail(provider = window.ethereum): Promise<EIP6963ProviderDetail> {
  if (!provider) throw new Error('injected provider not supported');
  return {
    provider: provider,
    info: {
      walletId: 'injectedWalletId',
      uuid: 'injectedWallet',
      name: getName(),
      icon: await getIcon()
    }
  }
}

const icons = {
  default: () => import('./injected-wallet-icons/default-icon').then(m => m.icon),
  oneInchWallet: () => import('./injected-wallet-icons/one-inch-wallet-icon').then(m => m.icon)
}

export function getIcon() {
  if (window.ethereum?.isOneInchWallet) {
    return icons.oneInchWallet()
  }
  return icons.default()
}

function getName() {
  if (window.ethereum?.isOneInchWallet) {
    return '1inch wallet'
  }
  return 'Browser wallet'
}
