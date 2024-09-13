import { IApplicationContext, ISentryController } from '@one-inch-community/models';
import * as Sentry from '@sentry/browser';
import type { Client } from '@sentry/types';

export class SentryController implements ISentryController {
  private client?: Client

  async init(context: IApplicationContext): Promise<void> {
    this.client = Sentry.init({
      dsn: 'https://8380a0d8cfa4e34cc5d742141c1b926f@o4506434492628992.ingest.us.sentry.io/4507944504852480',
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration()
      ],
      // Tracing
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost', /^https?:\/\/.+/],
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });

    if (this.client) {
      context.connectWalletController.data.activeAddress$.subscribe(address => {
        Sentry.setTag('activeAddress', address);
        this.updateActiveWallet(context)
      })
      context.connectWalletController.data.chainId$.subscribe(chainId => {
        Sentry.setTag('activeChainId', chainId);
        this.updateActiveWallet(context)
      })

    }
  }

  private updateActiveWallet(context: IApplicationContext) {
    if (context.connectWalletController.connectedWalletInfo === null) {
      Sentry.setTag('activeWallet', null);
      return
    }
    const { name, walletId, uuid, rdns } = context.connectWalletController.connectedWalletInfo
    Sentry.setTag('activeWallet', [ name, walletId, uuid, rdns ].join(':'));
  }
}
