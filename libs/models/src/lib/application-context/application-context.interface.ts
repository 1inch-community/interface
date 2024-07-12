import { IConnectWalletController } from '../wallet';
import { ITokenController } from '../token';
import { INotificationsController } from '../notifications';
import { ISwapContext } from '../swap';
import { Ii18nController } from '../i18n';
import { IThemesController } from '../themes';
import { IStorageController } from '../storage';
import { ITokenRateProvider } from '../token-price';

export interface IApplicationContext {
  readonly connectWalletController: IConnectWalletController
  readonly tokenController: ITokenController
  readonly tokenRateProvider: ITokenRateProvider
  readonly notificationsController: INotificationsController
  readonly i18nController: Ii18nController
  readonly themesController: IThemesController
  readonly storageController: IStorageController

  makeSwapContext(): Promise<ISwapContext>
}
