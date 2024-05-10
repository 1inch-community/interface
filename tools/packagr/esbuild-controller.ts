import * as esbuild from 'esbuild';
import { getLibraryPackageJson } from './files';
import { getLibraryTsconfigPath, getModuleDistPath } from './paths';
import { getEnv } from './env';
import { ILogger } from './logger';

export class EsbuildController {

  private esbuildContext?: esbuild.BuildContext
  private lastBuildIsError = false

  constructor(
    private readonly logger: ILogger,
    private readonly libName: string,
    public readonly moduleName: string,
    public readonly modulePath: string,
    private readonly isWatch: boolean,
    private readonly isProduction: boolean,
    private readonly oneModuleLibrary: boolean
  ) {
  }

  async build() {
    const config = await this.getBuildConfig();
    try {
      await esbuild.build(config)
      if (this.isWatch && !this.esbuildContext) {
        this.esbuildContext = await esbuild.context(config)
      }
      this.lastBuildIsError = false
    } catch (error) {
      this.lastBuildIsError = true
    }
  }

  async rebuild() {
    if (this.lastBuildIsError) {
      return await this.build()
    }
    try {
      await this.esbuildContext?.rebuild()
    } catch (error) {
      this.lastBuildIsError = true
    }
  }

  async terminate() {

  }

  private async getBuildConfig(): Promise<esbuild.BuildOptions> {
    const pkg = await getLibraryPackageJson(this.libName);
    const outdir = getModuleDistPath(this.libName, this.moduleName);
    const tsconfig = getLibraryTsconfigPath(this.libName)
    return {
      outdir,
      tsconfig,
      entryPoints: {
        'index': this.modulePath
      },
      bundle: true,
      splitting: true,
      minify: false,
      format: 'esm',
      sourcemap: true,
      platform: 'browser',
      legalComments: 'none',
      external: ['@one-inch-community', 'lit', ...Object.keys(pkg?.peerDependencies ?? {})],
      entryNames: `[dir]/[name].esm`,
      define: {
        '__environment__': JSON.stringify(getEnv())
      },
      loader: { '.ts': 'ts' }
    };
  }

}
