import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { fundModules } from './fund-lib-modules.mjs';
import { Logger } from './logger.mjs';
import { config } from 'dotenv';
import { ModuleBuilder } from './module-builder.mjs';
import { generatePackageJson } from './generate-package-json.mjs';

export class LibBuilder {

  moduleBuilder = []

  get libFullName() {
    return [
      `@${this.libName}`,
      this.libName,
    ].filter(Boolean).join('/');
  }

  get distPath() {
    return path.join(
      this.projectRoot,
      'dist',
      'libs',
      this.libName
    );
  }

  get packageJsonPath() {
    return path.join(
      this.projectRoot,
      'libs',
      this.libName,
      'package.json'
    )
  }

  constructor(libName, isWatch, production, oneModuleLibrary) {
    if (!libName) throw new Error('libName not exist');

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const projectRoot = path.dirname(path.dirname(__dirname));
    const libRoot = path.join(projectRoot, 'libs', libName);
    const pkgGlobal = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json')).toString());
    const version = pkgGlobal.version
    this.modules = fundModules(libRoot);

    this.projectRoot = projectRoot
    this.libName = libName
    this.isWatch = isWatch
    this.production = production
    this.oneModuleLibrary = oneModuleLibrary ?? this.modules.length === 1
    this.logger = new Logger(`${libName} v${version}`, isWatch)
    config({ path: path.join(projectRoot, '.env') })
    process.title = `${pkgGlobal.name}__${isWatch ? 'watch-build' : 'build'}_library_${libName}`
  }

  async start() {
    this.initModuleBuilders()
    await Promise.all(this.moduleBuilder.map(builder => builder.start()))
    await this.buildPackage()
  }

  // restart() {
  //   this.initModuleBuilders()
  //   this.moduleBuilder.forEach(builder => builder.start())
  // }

  initModuleBuilders() {
    this.moduleBuilder.forEach(builder => builder.stop())
    this.moduleBuilder = this.modules.map(({ moduleName, modulePublicApiPath }) => {
      return new ModuleBuilder(
        this.projectRoot,
        this.libName,
        moduleName,
        modulePublicApiPath,
        this.isWatch,
        this.production,
        this.oneModuleLibrary,
        this.logger
      )
    })
  }

  async buildPackage() {
    if (this.oneModuleLibrary) return
    const pkg = this.getPackageJson();
    const pkgGlobal = this.getProjectPackageJson();
    const exports = {}

    this.modules.forEach(({ moduleName, modulePublicApiPath }) => {
      exports[`./${moduleName}`] = {
        default: `./${moduleName}/index.esm.js`,
        types: `./${moduleName}/index.d.ts`
      }
    })

    await generatePackageJson({
      name: this.libFullName,
      version: pkgGlobal.version,
      type: "module",
      peerDependencies: pkg?.peerDependencies ?? {},
      exports
    }, this.distPath)
  }

  getPackageJson() {
    return JSON.parse(fs.readFileSync(this.packageJsonPath).toString());
  }

  getProjectPackageJson() {
    return JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json')).toString());
  }

}
