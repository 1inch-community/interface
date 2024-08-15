import { EmbeddedBootstrapConfigBase } from '@one-inch-community/models';

export const widgets: Record<EmbeddedBootstrapConfigBase['widgetName'], () => Promise<string>> = {
  'swap-from': () => import('./elements/swap-form-embedded-container.element').then(m => m.SwapFormEmbeddedContainerElement.tagName),
  // 'select-token': async () => ''
}
