import {
  IApplicationContext,
  IConnectWalletController,
  INotificationsController,
  ISwapContext,
  ITokenController,
  Ii18nController,
  IThemesController,
  IStorageController,
  ITokenRateProvider
} from '@one-inch-community/models';

export type ApplicationContextPayload = {
  connectWalletControllerFactory: () => Promise<IConnectWalletController>
  tokenControllerFactory: () => Promise<ITokenController>
  notificationsControllerFactory: () => Promise<INotificationsController>
  i18nControllerFactory: () => Promise<Ii18nController>
  themesControllerFactory: () => Promise<IThemesController>
  storageControllerFactory: () => Promise<IStorageController>
  tokenRateProviderFactory: () => Promise<ITokenRateProvider>
  swapContextFactory: (context: IApplicationContext) => Promise<ISwapContext>
}

const contextNotInitErrorMessage = 'ApplicationContext not init'

export class ApplicationContext implements IApplicationContext {
  private _connectWalletController?: IConnectWalletController
  private _tokenController?: ITokenController
  private _notificationsController?: INotificationsController
  private _i18nController?: Ii18nController
  private _themesController?: IThemesController
  private _storageController?: IStorageController
  private _tokenRateProvider?: ITokenRateProvider

  get connectWalletController(): IConnectWalletController {
    if (!this._connectWalletController) throw new Error(contextNotInitErrorMessage)
    return this._connectWalletController
  }

  get tokenController(): ITokenController {
    if (!this._tokenController) throw new Error(contextNotInitErrorMessage)
    return this._tokenController
  }

  get notificationsController(): INotificationsController {
    if (!this._notificationsController) throw new Error(contextNotInitErrorMessage)
    return this._notificationsController
  }

  get i18nController(): Ii18nController {
    if (!this._i18nController) throw new Error(contextNotInitErrorMessage)
    return this._i18nController
  }

  get themesController(): IThemesController {
    if (!this._themesController) throw new Error(contextNotInitErrorMessage)
    return this._themesController
  }

  get storageController(): IStorageController {
    if (!this._storageController) throw new Error(contextNotInitErrorMessage)
    return this._storageController
  }

  get tokenRateProvider(): ITokenRateProvider {
    if (!this._tokenRateProvider) throw new Error(contextNotInitErrorMessage)
    return this._tokenRateProvider
  }

  constructor(private readonly payload: ApplicationContextPayload) {
  }

  async init(): Promise<void> {
    const [
      connectWalletController,
      tokenController,
      notificationsController,
      i18nController,
      themesController,
      storageController,
      tokenRateProvider
    ] = await Promise.all([
      this.payload.connectWalletControllerFactory(),
      this.payload.tokenControllerFactory(),
      this.payload.notificationsControllerFactory(),
      this.payload.i18nControllerFactory(),
      this.payload.themesControllerFactory(),
      this.payload.storageControllerFactory(),
      this.payload.tokenRateProviderFactory()
    ])
    this._connectWalletController = connectWalletController
    this._tokenController = tokenController
    this._notificationsController = notificationsController
    this._i18nController = i18nController
    this._themesController = themesController
    this._storageController = storageController;
    this._tokenRateProvider = tokenRateProvider
    await Promise.all([
      this._i18nController.init(this),
      this._themesController.init(this),
      this._connectWalletController.init(this),
      this._notificationsController.init(this),
    ])
  }

  async makeSwapContext(): Promise<ISwapContext> {
    return await this.payload.swapContextFactory(this)
  }

}
