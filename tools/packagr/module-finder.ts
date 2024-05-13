import * as path from 'path';
import { findFilesByName } from './files';

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
