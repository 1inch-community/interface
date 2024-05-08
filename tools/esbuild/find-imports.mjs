import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ThreadController } from './thread-controller.mjs';

const __filename = fileURLToPath(import.meta.url);

export function readConfigFile(filePath) {
  const configFileText = fs.readFileSync(filePath, "utf8");
  const result = ts.parseConfigFileTextToJson(filePath, configFileText);
  const configObject = result.config;

  if (!configObject) {
    console.error("Error parsing tsconfig.json");
    return;
  }

  const configParseResult = ts.parseJsonConfigFileContent(configObject, ts.sys, path.dirname(filePath));
  if (configParseResult.errors.length > 0) {
    console.error("Error parsing tsconfig.json content", configParseResult.errors);
    return;
  }

  return configParseResult.options;
}

export function findAllDependencies(filePath, options, visited = new Set(), imports = []) {
  if (visited.has(filePath)) {
    return imports;
  }
  visited.add(filePath);

  const program = ts.createProgram([filePath], options);
  const sourceFile = program.getSourceFile(filePath);

  if (!sourceFile) {
    console.error("Could not load source file: " + filePath);
    return imports;
  }

  ts.forEachChild(sourceFile, node => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
      const moduleName = node.moduleSpecifier.text;
      const resolvedModule = ts.resolveModuleName(moduleName, filePath, options, ts.sys).resolvedModule;

      if (resolvedModule && resolvedModule.resolvedFileName) {
        if (!resolvedModule.resolvedFileName.includes('node_modules')) {
          imports.push([ moduleName, resolvedModule.resolvedFileName ]);
          findAllDependencies(resolvedModule.resolvedFileName, options, visited, imports);
        }
      }
    }
  });

  return imports;
}

export function findCrossDeps(moduleName, entryPath, tsconfigPath) {
  const deps = findAllDependencies(entryPath, readConfigFile(tsconfigPath))
  const result = new Set()
  for (const [ importName ] of deps) {
    if (!importName.includes(moduleName)) continue
    result.add(importName)
  }
  return result
}

const threadController = new ThreadController(__filename, { findCrossDeps })

export function findCrossDepsAsync(moduleName, entryPath, tsconfigPath) {
  return threadController.execute('findCrossDeps', [moduleName, entryPath, tsconfigPath])
}
