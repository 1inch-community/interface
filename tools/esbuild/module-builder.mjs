import * as path from 'path';
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import { generatePackageJson } from './generate-package-json.mjs';
import { dtsBundleAsync } from './dts-bundle.mjs';
import { findCrossDepsAsync } from './find-imports.mjs';

export class ModuleBuilder {

  context = null;

  watcher = null

  buildError = false;

  get libFullName() {
    return [
      `@${this.projectName}`,
      this.libName,
    ].filter(Boolean).join('/');
  }

  get moduleFullName() {
    return [
      this.libFullName,
      this.oneModuleLibrary ? null : this.moduleName
    ].filter(Boolean).join('/');
  }

  get distPath() {
    return path.join(
      this.projectRoot,
      'dist',
      'libs',
      this.libName,
      this.oneModuleLibrary ? '' : this.moduleName
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

  get tsconfigPath() {
    return path.join(
      this.projectRoot,
      'libs',
      this.libName,
      'tsconfig.lib.json'
    );
  }

  constructor(
    projectName,
    projectRoot,
    libName,
    moduleName,
    modulePublicApiPath,
    isWatch,
    production,
    oneModuleLibrary,
    logger
  ) {
    this.projectRoot = projectRoot;
    this.projectName = projectName;
    this.oneModuleLibrary = oneModuleLibrary
    this.libName = libName;
    this.moduleName = oneModuleLibrary ? libName : moduleName;
    this.modulePublicApiPath = modulePublicApiPath;
    this.isWatch = isWatch;
    this.production = production;
    this.oneModuleLibrary = oneModuleLibrary;
    this.logger = logger;
    this.logger.addModule(this.moduleName);
  }

  async start() {
    await this.build()
    if (this.isWatch) {
      await this.watch()
    }
  }

  stop() {
    this.watcher?.close()
  }

  async watch() {
    this.watcher = fs.watch(path.dirname(this.modulePublicApiPath), { recursive: true }, async () => {
      if (this.buildError) {
        await this.build();
      } else {
        await this.rebuild();
      }
      this.setStatus('wait module changes');
    });
    this.setStatus('wait module changes');
  }

  async build() {
    const config = this.getBuildConfig();
    try {
      const crossModules = await this.findCrossDeps(config)
      this.setStatus('build module', true);
      await esbuild.build(config);
      await this.buildTypes()
      await this.buildPackage()
      this.buildError = false;
      this.setError('build module', null);
    } catch (error) {
      this.buildError = true;
      this.setError('build module', error);
    }
    this.setStatus('build complete');
  }

  async rebuild() {
    if (!this.context) {
      const config = this.getBuildConfig();
      this.context = await esbuild.context(config);
      debugger
    }

    try {
      this.setStatus('rebuild', true)
      await this.context.rebuild()
      await this.buildTypes()
      await this.buildPackage()
      this.buildError = false
      this.setError('rebuild module', null)
    } catch (error) {
      this.buildError = true;
      this.context = null
      this.setError('rebuild module', error);
    }
  }

  buildTypes() {
    this.setStatus('build types', true);
    return dtsBundleAsync(
      this.moduleName,
      this.logger,
      this.distPath,
      { index: this.modulePublicApiPath },
      this.tsconfigPath
    )
  }

  async buildPackage() {
    try {
      this.setStatus('generate package.json', true);
      const pkg = this.getPackageJson();
      const pkgGlobal = this.getProjectPackageJson();
      const module = `./index.esm.js`
      const main = `./index.cjs.js`
      const types = `./index.d.ts`
      await generatePackageJson({
        name: this.moduleFullName,
        version: pkgGlobal.version,
        module,
        main,
        types,
        type: "module",
        peerDependencies: pkg?.peerDependencies ?? {},
        exports: {
          '.': {
            import: module,
            require: main,
            types: types,
          }
        },
      }, this.distPath)
      this.setError('generate package.json', null)
    } catch (error) {
      this.setError('generate package.json', error)
    }
  }

  getBuildConfig() {
    const pkg = this.getPackageJson();
    return {
      entryPoints: {
        'index': this.modulePublicApiPath
      },
      bundle: true,
      splitting: true,
      minify: false,
      outdir: this.distPath,
      format: 'esm',
      sourcemap: true,
      platform: 'browser',
      legalComments: 'none',
      tsconfig: this.tsconfigPath,
      external: ['@one-inch-community', 'lit', ...Object.keys(pkg?.peerDependencies ?? {})],
      entryNames: `[dir]/[name].esm`,
      define: {
        '__environment__': JSON.stringify({
          oneInchDevPortalHost: process.env.ONE_INCH_DEV_PORTAL_HOST,
          walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID,
        })
      },
      loader: { '.ts': 'ts' }
    };
  }

  async findCrossDeps(config) {
    this.setStatus('find dependencies', true);
    if (this.oneModuleLibrary) {
      return new Set()
    }
    return await findCrossDepsAsync(this.libFullName, config.entryPoints.index, this.tsconfigPath)
  }

  getPackageJson() {
    return JSON.parse(fs.readFileSync(this.packageJsonPath).toString());
  }

  getProjectPackageJson() {
    return JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json')).toString());
  }

  setStatus(name, isLoading) {
    this.logger.setStatus(this.moduleName, name, isLoading);
  }

  setError(errorName, error) {
    this.logger.setError(this.moduleName, errorName, error);
  }

}
