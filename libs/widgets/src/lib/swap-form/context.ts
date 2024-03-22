import { createContext } from '@lit/context';
import { ISwapContext } from '@one-inch-community/models';

export const swapContext = createContext<ISwapContext>('swap context')