import { ChainId } from '@one-inch-community/models';
import { isDarkTheme } from '@one-inch-community/ui-components/theme';
import { getMobileMatchMedia } from '@one-inch-community/ui-components/lit';
import type { EthereumProviderOptions } from '@walletconnect/ethereum-provider';
import { getEnvironmentValue } from '../../../environment';

const optionalChains = Object.keys(ChainId)
  .filter(value => Number(value) && value !== `${ChainId.eth}`)
  .map(chainId => Number(chainId))

export const options = async (): Promise<EthereumProviderOptions> => {
  const mobileMedia = getMobileMatchMedia()
  const themeMode = isDarkTheme() ? 'dark' : 'light'
  return {
    projectId: getEnvironmentValue('walletConnectProjectId'),
    showQrModal: true,
    chains: [ ChainId.eth ],
    optionalChains,
    events: ['chainChanged', 'accountsChanged'],
    methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign'],
    optionalMethods: [
      'eth_signTypedData_v4',
      'wallet_switchEthereumChain',
      'wallet_addEthereumChain',
      'eth_getCode',
      'personal_ecRecover',
    ],
    qrModalOptions: {
      themeMode,
      enableExplorer: mobileMedia.matches,
      mobileWallets: [
        {
          id: 'mobileInchWallet',
          name: '1inch Wallet',
          links: {
            native: 'oneinch://',
            universal: 'https://wallet.1inch.io/',
          },
        },
      ],
      walletImages: {
        mobileInchWallet: await import('./inch-wallet-icon').then(m => m.icon)
      },
      themeVariables: {
        '--wcm-background-color': 'var(--primary)',
        '--wcm-accent-color': 'var(--primary)',
        '--wcm-color-bg-2': 'none',
        '--wcm-color-bg-1': 'var(--color-background-bg-primary)',
        '--wcm-color-fg-1': 'var(--color-content-content-primary)'
      }
    }
  } as EthereumProviderOptions
}
