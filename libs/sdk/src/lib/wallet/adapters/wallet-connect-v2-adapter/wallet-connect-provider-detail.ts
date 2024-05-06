import { EIP6963ProviderDetail } from "@one-inch-community/models";

export async function getWalletConnectProviderDetail(): Promise<Omit<EIP6963ProviderDetail, 'provider'>> {
  return {
    info: {
      walletId: 'walletConnectId',
      uuid: 'walletConnect',
      name: 'Wallet Connect',
      icon: await getIcon()
    }
  }
}

const icons = {
  default: () => import('./wallet-connect-icon').then(m => m.icon),
}

export function getIcon() {
  return icons.default()
}
