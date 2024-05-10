import { ILogger } from './logger';
import { ModuleBuildStatusController } from './module-build-status-controller';
import { EsbuildController } from './esbuild-controller';
import { DtsBuildController } from './dtsbuild-controller';

export class ModuleBuilder {

  private readonly dtsBuildController: DtsBuildController
  private readonly esbuildController: EsbuildController
  public readonly moduleName: string

  constructor(
    private readonly logger: ILogger,
    private readonly statusController: ModuleBuildStatusController,
    private readonly libName: string,
    moduleName: string,
    public readonly modulePath: string,
    private readonly isWatch: boolean,
    private readonly isProduction: boolean,
    private readonly oneModuleLibrary: boolean
  ) {
    this.logger.log('wait start building')
    this.logger.setLoadingState(true)
    this.moduleName = oneModuleLibrary ? '' : moduleName
    this.esbuildController = new EsbuildController(
      logger,
      libName,
      this.moduleName,
      modulePath,
      isWatch,
      isProduction,
      oneModuleLibrary
    )
    this.dtsBuildController = new DtsBuildController(
      logger,
      libName,
      this.moduleName,
      modulePath,
      isWatch,
      isProduction,
      oneModuleLibrary
    )
  }

  async build() {
    this.logger.log('start module building')
    this.logger.setLoadingState(true)
    this.statusController.changeStatus(this.moduleName, 'building')
    await this.esbuildController.build()
    await this.dtsBuildController.build()
    this.logger.log('module building ready')
    this.logger.setLoadingState(false)
    this.statusController.changeStatus(this.moduleName, 'ready')
  }

  async terminate() {

  }

}
