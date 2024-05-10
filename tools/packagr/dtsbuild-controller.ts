import { getLibraryDistPath, getLibraryRootPath, getLibraryTsconfigPath } from './paths';
import { ILogger } from './logger';
import * as path from 'path';
import * as fsSync from 'fs'
import * as ts from 'typescript';

const fs = fsSync.promises

export class DtsBuildController {

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
    const libRootPath = getLibraryRootPath(this.libName)
    const configFile = ts.readConfigFile(getLibraryTsconfigPath(this.libName), ts.sys.readFile);
    const parsedCommandLine = ts.parseJsonConfigFileContent(configFile.config, ts.sys, libRootPath);
    parsedCommandLine.options.outDir = path.join(getLibraryDistPath(this.libName), 'types');
    parsedCommandLine.options.declaration = true;
    parsedCommandLine.options.skipLibCheck = true;
    parsedCommandLine.options.rootDir = libRootPath;
    parsedCommandLine.options.emitDeclarationOnly = true;
    const program = ts.createProgram(parsedCommandLine.fileNames, parsedCommandLine.options);
    const emitResult = program.emit();
    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    for (const diagnostic of allDiagnostics) {
      if (diagnostic.file) {
        const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start ?? 0);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
      } else {
        console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
      }
    }

    if (emitResult.emitSkipped) {

    } else {
      await this.moveAllTypes()
    }
  }

  async terminate() {

  }

  private async moveAllTypes() {
    const typesPath = path.join(getLibraryDistPath(this.libName), 'types')
    const typesSrcPath = path.join(typesPath, 'src')
    const files = await fs.readdir(typesSrcPath)
    await Promise.all(files.map(async file => {
      const sourceFile = path.join(typesSrcPath, file);
      const targetFile = path.join(typesPath, file);
      await fs.rename(sourceFile, targetFile)
    }))
    await fs.rmdir(typesSrcPath)
  }

}

function restoreFileName(fileName: string): string {
  const extname = path.extname(fileName)
  if (extname.toLowerCase().includes('d.ts')) return fileName
  return fileName + '.d.ts';
}
