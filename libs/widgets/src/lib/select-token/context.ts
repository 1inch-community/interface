import { createContext } from '@lit/context';
import { ISelectTokenContext } from '@one-inch-community/models';

export const selectTokenContext = createContext<ISelectTokenContext>(Symbol('select token context'))