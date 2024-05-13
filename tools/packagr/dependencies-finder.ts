import ts from 'typescript';
import * as fsSync from 'fs'
import * as path from 'node:path';
import { getLibraryTsconfigPath } from './paths';
import { getLibraryFullName } from './names';
import { findFilesByName, getProjectPackageJson } from './files';
import { ILogger } from './logger';
const fs = fsSync.promises

export class DependenciesFinder {

  constructor(
    private readonly logger: ILogger,
    private readonly libName: string,
    private readonly moduleName: string,
    private readonly moduleEntry: string,
    private readonly oneModuleLibrary: boolean
  ) {
  }

  async findModuleCrossDependencies() {
    if (this.oneModuleLibrary) {
      return new Set<string>()
    }
    this.logger.log('find cross dependencies in progress')
    const tsconfigPath = getLibraryTsconfigPath(this.libName)
    const options = await this.readConfigFile(tsconfigPath)
    if (!options) {
      return new Set<string>()
    }
    this.logger.log('find cross dependencies ready')
    return await this.findAllDependencies(this.moduleEntry, options)
  }

  private async readConfigFile(filePath: string) {
    const configFileText = await fs.readFile(filePath, "utf8");
    const result = ts.parseConfigFileTextToJson(filePath, configFileText);
    const configObject = result.config;

    if (!configObject) {
      return null;
    }

    const configParseResult = ts.parseJsonConfigFileContent(configObject, ts.sys, path.dirname(filePath));
    if (configParseResult.errors.length > 0) {
      console.error("Error parsing tsconfig.json content", configParseResult.errors);
      return null;
    }

    return configParseResult.options;
  }

  private async findAllDependencies(filePath: string, options: ts.CompilerOptions) {
    const packageJson = await getProjectPackageJson()
    const libName = getLibraryFullName(packageJson.name, this.libName)
    const imports = new Set<string>()
    const moduleFiles = await findFilesByName(path.dirname(filePath), file => file.includes('.ts'))

    const program = ts.createProgram(moduleFiles, options);
    const sourceFiles = moduleFiles.map(file => program.getSourceFile(file))

    for (const sourceFile of sourceFiles) {
      if (!sourceFile || sourceFile.fileName.includes('node_modules')) {
        continue
      }
      ts.forEachChild(sourceFile, node => {
        if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
          const specifier = node.moduleSpecifier;
          if (ts.isStringLiteral(specifier)) {
            const moduleName = specifier.text;
            if (moduleName.includes(libName)) {
              imports.add(moduleName);
            }
          }
        }
      })
    }

    return imports
  }

}
