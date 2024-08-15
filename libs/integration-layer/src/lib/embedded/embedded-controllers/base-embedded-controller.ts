import {
  ChainId,
  ColorHex,
  IApplicationContext,
  IEmbeddedController,
  IGlobalEmbeddedContextElement,
  Locale
} from '@one-inch-community/models';
import { safeContextMap } from './safe-context';

export abstract class BaseEmbeddedController implements IEmbeddedController {

  isDestroyed = false

  constructor(
    context: IApplicationContext,
    root: IGlobalEmbeddedContextElement
  ) {
    safeContextMap.set(this, { context, root })
  }

  destroy() {
    const safeContext = safeContextMap.get(this)!
    safeContext.root.remove()
    this.isDestroyed = true;
  }

  async setChainId(chainId: ChainId): Promise<void> {
    const safeContext = safeContextMap.get(this)!
    await safeContext.context.connectWalletController.changeChain(chainId)
  }

  async setLocale(localeCode: Locale): Promise<void> {
    const safeContext = safeContextMap.get(this)!
    await safeContext.context.i18nController.changeLocale(localeCode)
  }

  async setThemeType(themeType: 'dark' | 'light'): Promise<void> {
    const safeContext = safeContextMap.get(this)!
    await safeContext.root.setThemeType(themeType)
  }

  async setThemePrimaryColor(primaryColor: ColorHex): Promise<void> {
    const safeContext = safeContextMap.get(this)!
    await safeContext.root.setThemePrimaryColor(primaryColor)
  }
}
