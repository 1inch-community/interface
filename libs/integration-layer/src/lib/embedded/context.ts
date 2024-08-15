import { ApplicationContext } from '@one-inch-community/core/application-context';
import { GlobalEmbeddedContextElement } from './global-embedded-context.element';
import { EmbeddedBootstrapConfig } from '@one-inch-community/models';

export async function bootstrapApplicationContext(config: EmbeddedBootstrapConfig) {
  const embeddedGlobalContext = document.createElement(GlobalEmbeddedContextElement.tagName)

  const GlobalApplicationContext = new ApplicationContext({
    connectWalletControllerFactory: () => import('@one-inch-community/sdk/wallet').then(m => new m.ConnectWalletEmbeddedController(config)),
    tokenControllerFactory: () => import('@one-inch-community/sdk/tokens').then(m => new m.TokenController()),
    notificationsControllerFactory: () => import('@one-inch-community/widgets/notifications').then(m => new m.NotificationsController()),
    i18nControllerFactory: () => import('@one-inch-community/core/lit').then(m => new m.I18nEmbeddedController(config.locale, embeddedGlobalContext)),
    themesControllerFactory: () => import('@one-inch-community/core/theme').then(m => new m.ThemeEmbeddedController()),
    storageControllerFactory: () => import('@one-inch-community/core/storage').then(m => m.storage),
    tokenRateProviderFactory: () => import('@one-inch-community/sdk/tokens').then(m => m.buildDefaultTokenRateProvider()),
    oneInchDevPortalAdapterFactory: () => import('@one-inch-community/sdk/api').then(m => new m.OneInchDevPortalAdapter()),
    swapContextFactory: (context) => import('@one-inch-community/sdk/swap').then(m => {
      const swapContext = new m.SwapContext(context)
      swapContext.init()
      return swapContext
    }),
  }, true)
  await GlobalApplicationContext.init()
  await embeddedGlobalContext.setContext(GlobalApplicationContext)
  return [embeddedGlobalContext, GlobalApplicationContext] as const
}
