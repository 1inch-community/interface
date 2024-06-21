import { ChainId } from '@one-inch-community/models';
import type { EthereumProviderOptions } from '@walletconnect/ethereum-provider';
import { getEnvironmentValue } from '../../../environment';

const mobileMediaString = 'screen and (max-width: 600px)' as const
const mobileMatchMedia = matchMedia(mobileMediaString)

export function getMobileMatchMedia() {
  return mobileMatchMedia
}

const optionalChains = Object.keys(ChainId)
  .filter(value => Number(value) && value !== `${ChainId.eth}`)
  .map(chainId => Number(chainId))

export const options = async (): Promise<EthereumProviderOptions> => {
  const mobileMedia = getMobileMatchMedia()
  const htmlElement = document.querySelector('html')
  const themeMode = htmlElement?.getAttribute('theme') ?? 'dark'
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
        '--wcm-z-index': '2000',
        '--wcm-color-fg-1': 'var(--color-content-content-primary)',
      }
    }
  } as EthereumProviderOptions
}
