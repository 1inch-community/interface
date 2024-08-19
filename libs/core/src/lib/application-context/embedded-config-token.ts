import { createContext } from '@lit/context';
import { EmbeddedBootstrapConfig } from '@one-inch-community/models';

export const EmbeddedConfigToken = createContext<EmbeddedBootstrapConfig>(Symbol('EmbeddedConfigToken'));
