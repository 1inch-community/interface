import { bootstrapApplicationContext } from './context';
import { html, render } from 'lit';

Promise.all([
  import('./app/app.element'),
  bootstrapApplicationContext(),
]).then(() => {
  const template = html`
    <global-application-context>
      <app-root id="app-root"></app-root>
      <div id="overlay-container"></div>
    </global-application-context>
  `
  render(template, document.body)
})

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
