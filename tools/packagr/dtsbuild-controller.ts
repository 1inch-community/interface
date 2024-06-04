import ts from 'typescript';
import {
  getLibraryRootPath,
  getLibraryTsconfigPath,
  getModuleDistPath,
} from './paths';
import { ILogger } from './logger';
import * as path from 'path';
import * as fsSync from 'fs'
import { findFilesByName } from './files';

const fs = fsSync.promises

export class DtsBuildController {

  private host?: ts.CompilerHost
  private program?: ts.EmitAndSemanticDiagnosticsBuilderProgram
  private options?: ts.CompilerOptions
  private files: string[] = []

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
    this.logger.log('build types in progress')

    this.logger.removeError('types build error')
    this.logger.removeError('type emit skipped')

    try {
      // this.buildCompiler()
      const result = this.compileMono()
      if (result) {
        await this.moveAllTypes()
        await this.createIndexDts()
      } else {
        this.logger.error('type emit skipped', new Error())
      }
    } catch (error) {
      this.logger.error('types build error', error)
    }
    this.logger.log('build types complete')
  }

  async rebuild() {
    this.logger.log('rebuild types in progress')
    this.logger.removeError('types build error')
    this.logger.removeError('type emit skipped')
    try {
      const result = this.compileMono()
      if (result) {
        await this.moveAllTypes()
      } else {
        this.logger.error('type emit skipped', new Error())
      }
    } catch (error) {
      this.logger.error('types build error', error)
    }
  }

  async terminate() {

  }

  private buildCompiler() {
    const moduleRoot = path.dirname(this.modulePath)
    const libRootPath = getLibraryRootPath(this.libName)
    const configFile = ts.readConfigFile(getLibraryTsconfigPath(this.libName), ts.sys.readFile);
    const parsedCommandLine = ts.parseJsonConfigFileContent(configFile.config, ts.sys, libRootPath);
    this.files = parsedCommandLine.fileNames.filter(filePath => {
      return filePath.includes(moduleRoot)
    })
    this.options = {
      ...parsedCommandLine.options,
      outDir: path.join(getModuleDistPath(this.libName, this.moduleName), '_types'),
      declaration: true,
      emitDeclarationOnly: true,
      sourceMap: false,
    }
    this.host = ts.createIncrementalCompilerHost(this.options, ts.sys)
  }

  private compile() {
    if (!this.host || !this.options) {
      throw new Error('the compiler is not built')
    }
    this.logger.removeError('diagnostic types error')
    this.program = ts.createEmitAndSemanticDiagnosticsBuilderProgram(
      this.files,
      this.options,
      this.host,
      this.program
    )
    const emitResult = this.program.emit();
    const allDiagnostics = ts.getPreEmitDiagnostics(this.program.getProgram()).concat(emitResult.diagnostics);
    for (const diagnostic of allDiagnostics) {
      if (diagnostic.file) {
        const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start ?? 0);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        this.logger.error('diagnostic types error', new Error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`))
      } else {
        this.logger.error('diagnostic types error', new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')))
      }
    }

    return !emitResult.emitSkipped
  }

  private compileMono() {
    const moduleRoot = path.dirname(this.modulePath)
    const libRootPath = getLibraryRootPath(this.libName)
    const configFile = ts.readConfigFile(getLibraryTsconfigPath(this.libName), ts.sys.readFile);
    const parsedCommandLine = ts.parseJsonConfigFileContent(configFile.config, ts.sys, libRootPath);
    const fileNames = parsedCommandLine.fileNames.filter(filePath => {
      return filePath.includes(moduleRoot)
    })
    const options = {
      ...parsedCommandLine.options,
      outDir: path.join(getModuleDistPath(this.libName, this.moduleName), '_types'),
      declaration: true,
      emitDeclarationOnly: true,
      sourceMap: false,
    }
    const program = ts.createProgram(fileNames, options)
    const emitResult = program.emit();
    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    this.logger.removeError('diagnostic types error')
    for (const diagnostic of allDiagnostics) {
      if (diagnostic.file) {
        const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start ?? 0);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        this.logger.error('diagnostic types error', new Error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`))
      } else {
        this.logger.error('diagnostic types error', new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')))
      }
    }
    return !emitResult.emitSkipped
  }

  private async moveAllTypes() {
    const dist = path.join(getModuleDistPath(this.libName, this.moduleName), '_types')
    const typesPaths = await findFilesByName(dist, 'public-api.d.ts')
    if (typesPaths.length > 1) {
      throw new Error([
        'the number of entry points exceeds 1',
        ...typesPaths
      ].join('\n'))
    }
    const typesRootPath = path.dirname(typesPaths[0])
    const files = await fs.readdir(typesRootPath, { withFileTypes: true })
    const typesDist = path.join(getModuleDistPath(this.libName, this.moduleName), 'types')
    if (!fsSync.existsSync(typesDist)) {
      await fs.mkdir(typesDist)
    }
    await Promise.all(files.map(async (file: fsSync.Dirent) => {
      const sourceFile = path.join(typesRootPath, file.name);
      const targetFile = path.join(typesDist, file.name);
      if (this.isWatch) {
        await copy(sourceFile, targetFile)
      } else {
        await fs.rename(sourceFile, targetFile)
      }
    }))
    if (!this.isWatch) {
      await fs.rm(dist, { recursive: true })
    }
  }

  private async createIndexDts() {
    const indexDrsPath = path.join(getModuleDistPath(this.libName, this.moduleName), 'index.d.ts')
    await fs.writeFile(indexDrsPath, "export * from './types/public-api'")
  }

}

async function copy(src: string, dest: string): Promise<void> {
  const stat = await fs.stat(src);

  if (stat.isDirectory()) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copy(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } else {
    await fs.copyFile(src, dest);
  }
}
