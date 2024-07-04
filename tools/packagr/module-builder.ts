import { ILogger } from './logger';
import { dirname } from 'path';
import { BuildStatus, BuildStatusController } from './build-status-controller';
import { EsbuildController } from './esbuild-controller';
import { DtsBuildController } from './dtsbuild-controller';
import { DependenciesFinder } from './dependencies-finder';
import { getLibraryPackageJson, getProjectPackageJson } from './files';
import { getModuleFullName } from './names';
import { getModuleDistPath } from './paths';
import { generatePackageJson } from './generate-package-json';
import { WatcherController } from './watcher-controller';

export class ModuleBuilder {

  private readonly dtsBuildController: DtsBuildController
  private readonly esbuildController: EsbuildController
  private readonly dependenciesFinder: DependenciesFinder
  private readonly watcher: WatcherController
  public readonly moduleName: string

  constructor(
    private readonly logger: ILogger,
    private readonly statusController: BuildStatusController,
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
    this.watcher = new WatcherController(
      this.logger,
      () => this.rebuild()
    )
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
    this.dependenciesFinder = new DependenciesFinder(
      this.logger,
      this.libName,
    )
  }

  async build() {
    this.logger.setLoadingState(true)
    this.logger.log('start module building')
    this.statusController.changeStatus(this.moduleName, BuildStatus.building)

    await this.waitBuildCrossDeps()
    this.logger.log('start module esbuild building')
    await this.esbuildController.build()
    this.logger.log('start module dts building')
    await this.dtsBuildController.build()
    await this.generatePackageJson()

    this.logger.setLoadingState(false)
    this.statusController.changeStatus(this.moduleName, BuildStatus.ready)
    this.logger.log('building complete')
    if (this.isWatch) {
      this.logger.log('wait changes')
      this.watcher.addPath(dirname(this.modulePath))
      const paths = await this.dependenciesFinder.findAllDependenciesPath(this.modulePath)
      if (paths.length) {
        this.watcher.addPaths(paths)
      }
      this.watcher.start()
    }
  }

  async rebuild() {
    this.logger.log('start module rebuilding')
    this.logger.setLoadingState(true)
    this.statusController.changeStatus(this.moduleName, BuildStatus.building)

    const paths = await this.dependenciesFinder.findAllDependenciesPath(this.modulePath)
    if (paths.length) {
      this.watcher.addPaths(paths)
    }

    await this.waitBuildCrossDeps()
    await this.esbuildController.rebuild()
    await this.dtsBuildController.rebuild()
    await this.generatePackageJson()

    this.logger.setLoadingState(false)
    this.statusController.changeStatus(this.moduleName, BuildStatus.ready)
    this.logger.log('wait changes')
  }

  async terminate() {
    this.watcher.stop()
    await this.esbuildController.terminate()
    await this.dtsBuildController.terminate()
  }

  private async generatePackageJson() {
    const packageJson = await getProjectPackageJson()
    const libPackageJson = await getLibraryPackageJson(this.libName)
    const projectName = packageJson.name
    const version = packageJson.version
    const module = `./index.esm.js`
    const types = `./index.d.ts`
    await generatePackageJson({
      version,
      name: getModuleFullName(projectName, this.libName, this.moduleName),
      module,
      types,
      type: "module",
      peerDependencies: libPackageJson?.peerDependencies ?? {},
      exports: {
        '.': {
          types: types,
          import: module,
        }
      },
    }, getModuleDistPath(this.libName, this.moduleName))
  }

  private async waitBuildCrossDeps() {
    const crossDepsSet = await this.dependenciesFinder.findModuleCrossDependencies(this.modulePath, this.oneModuleLibrary)
    const crossDeps = [ ...crossDepsSet ]
    this.logger.log('wait build cross module dependencies, ' + crossDeps.join(', '))
    await Promise.all(crossDeps.map(deps => this.statusController.waitReady(deps)))
    this.logger.log('build cross dependencies ready')
  }

}
