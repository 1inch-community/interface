import ts from 'typescript';
import * as fsSync from 'fs';
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
  ) {
  }

  async findModuleCrossDependencies(moduleEntry: string, oneModuleLibrary: boolean): Promise<Set<string>> {
    if (oneModuleLibrary) {
      return new Set<string>()
    }
    this.logger.log('find cross dependencies in progress')
    const tsconfigPath = getLibraryTsconfigPath(this.libName)
    const options = await this.readConfigFile(tsconfigPath)
    if (!options) {
      return new Set<string>()
    }
    const packageJson = await getProjectPackageJson()
    const libName = getLibraryFullName(packageJson.name, this.libName)
    const result = await this.findAllDependencies(moduleEntry, options, libName)
    this.logger.log('find cross dependencies ready')
    return result
  }

  async findAllDependenciesPath(moduleEntry: string): Promise<string[]> {
    const tsconfigPath = getLibraryTsconfigPath(this.libName)
    const options = await this.readConfigFile(tsconfigPath)
    if (!options) {
      return []
    }
    const packageJson = await getProjectPackageJson()
    const resultSer = await this.findAllDependencies(moduleEntry, options, `@${packageJson.name}/`)
    const result: string[] = []
    resultSer.forEach(dep => {
      const depPath = getDependencyPath(dep, options)
      depPath && result.push(path.dirname(depPath))
    })
    return result
  }

  async findLibraryCrossDependencies(moduleEntries: string[]): Promise<Set<string>> {
    this.logger.log('find cross dependencies in progress')
    const tsconfigPath = getLibraryTsconfigPath(this.libName)
    const options = await this.readConfigFile(tsconfigPath)
    if (!options) {
      return new Set<string>()
    }
    const packageJson = await getProjectPackageJson()
    const resultList: string[] = []
    for (const moduleEntry of moduleEntries) {
      const result = await this.findAllDependencies(moduleEntry, options, name => name.startsWith(`@${packageJson.name}/`) && ((name.split('/').length - 1) < 2))
      resultList.push(...result.values())
    }
    return new Set(resultList)
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

  private async findAllDependencies(filePath: string, options: ts.CompilerOptions, target: string | ((name: string) => boolean)) {
    const imports = new Set<string>();
    const moduleFiles = await findFilesByName(path.dirname(filePath), file => file.includes('.ts'));

    const program = ts.createProgram(moduleFiles, options);
    const sourceFiles = moduleFiles.map(file => program.getSourceFile(file));

    for (const sourceFile of sourceFiles) {
      if (!sourceFile || sourceFile.fileName.includes('node_modules')) {
        continue;
      }
      ts.forEachChild(sourceFile, node => {
        this.findImportsInNode(node, imports, target);
      });
    }

    return imports;
  }

  private findImportsInNode(node: ts.Node, imports: Set<string>, target: string | ((name: string) => boolean)) {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
      const specifier = node.moduleSpecifier;
      if (ts.isStringLiteral(specifier)) {
        const moduleName = specifier.text;
        if (typeof target === 'function' ? target(moduleName) : moduleName.startsWith(target)) {
          imports.add(moduleName);
        }
      }
    }

    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const [arg] = node.arguments;
      if (arg && ts.isStringLiteral(arg)) {
        const moduleName = arg.text;
        if (typeof target === 'function' ? target(moduleName) : moduleName.startsWith(target)) {
          imports.add(moduleName);
        }
      }
    }

    ts.forEachChild(node, child => this.findImportsInNode(child, imports, target));
  }

}

function getDependencyPath(dependency: string, options: ts.CompilerOptions): string | null {
  if (options.paths && options.baseUrl) {
    const paths = options.paths[dependency] || [];
    if (paths.length > 0) {
      return path.resolve(options.baseUrl, paths[0]);
    }
  }
  return null;
}

