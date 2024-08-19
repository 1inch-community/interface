import { EmbeddedBootstrapConfig } from '@one-inch-community/models';

export interface ElementContainer extends HTMLElement {
  setConfig(config: EmbeddedBootstrapConfig): Promise<void>
}
