import { ILogger } from './logger';
import { ModuleBuilder } from './module-builder';
import { getLibraryDistPath, getLibraryRootPath } from './paths';
import { moduleFinder, ModuleInfo } from './module-finder';
import { generatePackageJson } from './generate-package-json';
import { getLibraryFullName } from './names';
import { getLibraryPackageJson, getProjectPackageJson } from './files';
import { BuildStatusController } from './build-status-controller';
import { DependenciesFinder } from './dependencies-finder';
import * as fsSync from 'fs';
const fs = fsSync.promises

export class LibraryBuilder {

  private moduleBuilders: ModuleBuilder[] = []

  private readonly dependenciesFinder: DependenciesFinder

  constructor(
    private readonly logger: ILogger,
    private readonly libName: string,
    private readonly isWatch: boolean,
    private readonly isProduction: boolean,
    private readonly oneModuleLibrary: boolean,
    private readonly statusController?: BuildStatusController,
  ) {
    this.logger.log('start building')
    this.dependenciesFinder = new DependenciesFinder(
      this.logger,
      this.libName,
    )
  }

  async build() {
    this.logger.log('build in progress')
    this.logger.setLoadingState(true)
    this.statusController?.changeStatus(this.libName, 'building')
    const module = await moduleFinder(getLibraryRootPath(this.libName));
    await this.waitBuildCrossDeps(module)
    await this.removeDist()
    await this.terminate()
    const packageJson = await getProjectPackageJson()
    const statusController = new BuildStatusController(
      module.map(info => info.moduleName),
      packageJson.name,
      this.libName
    )
    this.moduleBuilders = module.map(info => new ModuleBuilder(
      this.oneModuleLibrary ? this.logger : this.logger.fork(info.moduleName),
      statusController,
      this.libName,
      info.moduleName,
      info.modulePublicApiPath,
      this.isWatch,
      this.isProduction,
      this.oneModuleLibrary
    ))
    await Promise.all(this.moduleBuilders.map(builder => builder.build()))
    await this.generatePackageJson()
    this.statusController?.changeStatus(this.libName, 'ready')
    this.logger.log('build complete')
    this.logger.setLoadingState(false)
  }

  async terminate() {
    await Promise.all(this.moduleBuilders.map(builder => builder.terminate()))
    this.moduleBuilders = []
  }

  async generatePackageJson() {
    if (this.oneModuleLibrary) return
    const exports: Record<string, unknown> = {}
    this.moduleBuilders.forEach(({ moduleName }) => {
      exports[`./${moduleName}`] = {
        types: `./${moduleName}/index.d.ts`,
        default: `./${moduleName}/index.esm.js`
      }
    })
    const packageJson = await getProjectPackageJson()
    const libPackageJson = await getLibraryPackageJson(this.libName)
    const projectName = packageJson.name
    const version = packageJson.version
    await generatePackageJson({
      name: getLibraryFullName(projectName, this.libName),
      version: version,
      type: "module",
      peerDependencies: libPackageJson?.peerDependencies ?? {},
      exports
    }, getLibraryDistPath(this.libName))
  }

  private async removeDist() {
    try {
      await fs.rm(getLibraryDistPath(this.libName), { recursive: true })
    } catch (error) {
    }
  }

  private async waitBuildCrossDeps(moduleInfo: ModuleInfo[]) {
    if (!this.statusController) {
      return
    }
    const crossDepsSet = await this.dependenciesFinder.findLibraryCrossDependencies(moduleInfo.map(info => info.modulePublicApiPath))
    const crossDeps = [ ...crossDepsSet ]
    this.logger.log('wait build cross dependencies, ' + crossDeps.join(', '))
    await Promise.all(crossDeps.map(deps => this.statusController!.waitReady(deps)))
    this.logger.log('build cross dependencies ready')
  }

}
