import { ChainId } from '../chain';
import { Locale } from '../i18n';
import { EIP1193Provider } from '../wallet';
import { EmbeddedControllerType } from './embedded-controller-type';

export type EmbeddedBootstrapConfig =
  | EmbeddedBootstrapConfigSwapForm

export type ColorHex = `#${string}`

export interface EmbeddedBootstrapConfigBase {
  renderContainer: string | HTMLElement
  primaryColor: ColorHex
  themeType: 'dark' | 'light'
  locale: Locale
  oneInchDevPortal: OneInchDevPortal
  widgetName: keyof EmbeddedControllerType,
  chainId: ChainId
  walletProvider?: EIP1193Provider
}

export interface EmbeddedBootstrapConfigBaseDevPortalApiConfig {
  devPortalHost: `https://${string}`
  devPortalToken: `Bearer ${string}`
}

export type OneInchDevPortal = `https://${string}` | `Bearer ${string}` | EmbeddedBootstrapConfigBaseDevPortalApiConfig

export interface EmbeddedBootstrapConfigSwapForm extends EmbeddedBootstrapConfigBase {
  widgetName: 'swap-from'
  swapFromParams: EmbeddedBootstrapConfigSwapFormParams
}

export interface EmbeddedBootstrapConfigSwapFormParams {
  sourceTokenSymbol: string
  destinationTokenSymbol: string
  disabledTokenChanging?: boolean
}
