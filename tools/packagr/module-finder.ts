import * as fsSync from 'fs';
import * as path from 'path';
const fs = fsSync.promises

export type ModuleInfo = {
  modulePublicApiPath: string
  moduleName: string
}

export async function moduleFinder(baseDir: string): Promise<ModuleInfo[]> {
  const modulesPath = await findFilesByName(baseDir, 'public-api.ts');
  return modulesPath.map(modulePath => ({
    modulePublicApiPath: modulePath,
    moduleName: path.basename(path.dirname(modulePath))
  }));
}

export async function findFilesByName(baseDir: string, fileName: string): Promise<string[]> {
  async function recursiveSearch(dir: string): Promise<string[]> {
    let results: string[] = [];
    const files = await fs.readdir(dir, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        results = results.concat(await recursiveSearch(filePath));
      } else if (file.name === fileName) {
        results.push(filePath);
      }
    }
    return results;
  }

  return await recursiveSearch(baseDir);
}
