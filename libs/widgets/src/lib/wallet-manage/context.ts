import { createContext } from '@lit/context';
import { IConnectWalletController } from '@one-inch-community/models';

export const controllerContext = createContext<IConnectWalletController>(Symbol('controller context'))