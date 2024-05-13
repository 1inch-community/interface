import { ILogger } from './logger';
import { ModuleBuilder } from './module-builder';
import { getLibraryDistPath, getLibraryRootPath } from './paths';
import { moduleFinder } from './module-finder';
import { generatePackageJson } from './generate-package-json';
import { getLibraryFullName } from './names';
import { getLibraryPackageJson, getProjectPackageJson } from './files';
import { ModuleBuildStatusController } from './module-build-status-controller';
import * as fsSync from 'fs';
const fs = fsSync.promises

export class LibraryBuilder {

  private moduleBuilders: ModuleBuilder[] = []

  constructor(
    private readonly logger: ILogger,
    private readonly libName: string,
    private readonly isWatch: boolean,
    private readonly isProduction: boolean,
    private readonly oneModuleLibrary: boolean
  ) {
    this.logger.log('start building')
  }

  async build() {
    this.logger.log('build in progress')
    await this.removeDist()
    await this.terminate()
    const module = await moduleFinder(getLibraryRootPath(this.libName));
    const packageJson = await getProjectPackageJson()
    const statusController = new ModuleBuildStatusController(
      module.map(info => info.moduleName),
      packageJson.name,
      this.libName
    )
    this.moduleBuilders = module.map(info => new ModuleBuilder(
      this.logger.fork(info.moduleName),
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
    this.logger.log('build complete')
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
        default: `./${moduleName}/index.esm.js`,
        types: `./${moduleName}/index.d.ts`
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

}
