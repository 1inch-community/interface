import { ApplicationContext } from '@one-inch-community/core/application-context';

let GlobalApplicationContext: ApplicationContext;

export async function bootstrapApplicationContext() {
  GlobalApplicationContext = new ApplicationContext({
    connectWalletControllerFactory: () => import('@one-inch-community/sdk/wallet').then(m => m.createConnectWalletController()),
    tokenControllerFactory: () => import('@one-inch-community/sdk/tokens').then(m => new m.TokenController()),
    notificationsControllerFactory: () => import('@one-inch-community/widgets/notifications').then(m => new m.NotificationsController()),
    i18nControllerFactory: () => import('@one-inch-community/core/lit').then(m => new m.I18nController()),
    themesControllerFactory: () => import('@one-inch-community/core/theme').then(m => new m.ThemeController()),
    storageControllerFactory: () => import('@one-inch-community/core/storage').then(m => m.storage),
    tokenRateProviderFactory: () => import('@one-inch-community/sdk/tokens').then(m => m.buildDefaultTokenRateProvider()),
    oneInchDevPortalAdapterFactory: () => import('@one-inch-community/sdk/api').then(m => new m.OneInchDevPortalAdapter()),
    swapContextFactory: (context) => import('@one-inch-community/sdk/swap').then(m => {
      const swapContext = new m.SwapContext(context)
      swapContext.init()
      return swapContext
    }),
  })
  await GlobalApplicationContext.init()
}

export function getContext(): ApplicationContext {
  if (!GlobalApplicationContext) throw new Error('ApplicationContext not bootstrapped')
  return GlobalApplicationContext
}
