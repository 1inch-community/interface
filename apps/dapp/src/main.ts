import { bootstrapApplication } from '@one-inch-community/integration-layer/application';

bootstrapApplication(() => import('./app/app.element'))
  .catch(console.error)

import('virtual:pwa-register').then(({ registerSW }) => {
  registerSW({
    onRegisteredSW: async (_, worker: ServiceWorkerRegistration) => {
      console.log('worker updated')
      await worker.update()
    },
    onNeedRefresh: () => console.log('update ready'),
    onOfflineReady: () => console.log('offline ready'),
  })
})
