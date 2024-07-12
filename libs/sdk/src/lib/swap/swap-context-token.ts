import { createContext } from '@lit/context';
import { ISwapContext } from '@one-inch-community/models';

export const SwapContextToken = createContext<ISwapContext>(Symbol('SwapContextToken'));
