import { EmbeddedBootstrapConfig, EmbeddedControllerType } from '@one-inch-community/models';

export interface ElementContainer extends HTMLElement {
  setConfig(config: EmbeddedBootstrapConfig): Promise<void>
  bindEmbeddedController<Type extends keyof EmbeddedControllerType>(controller: EmbeddedControllerType[Type]): void
}
