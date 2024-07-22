import { createContext } from '@lit/context';
import { IApplicationContext } from '@one-inch-community/models';

export const ApplicationContextToken = createContext<IApplicationContext>(Symbol('ApplicationContextToken'));
