import * as fsSync from 'fs';
import { getLibraryPackageJsonPath, getProjectPackageJsonPath, getProjectRootPath } from './paths';
import path from 'path';

const fs = fsSync.promises

type PackageJson = {
  version: string
  name: string
  peerDependencies: object
}

export async function getProjectPackageJson(): Promise<PackageJson> {
  return await getPackageJson(getProjectPackageJsonPath())
}

export async function getLibraryPackageJson(libName: string) {
  return await getPackageJson(getLibraryPackageJsonPath(libName))
}

const cache: Map<string, PackageJson> = new Map<string, PackageJson>()
async function getPackageJson(path: string): Promise<PackageJson> {
  if (cache.has(path)) {
    return cache.get(path)!
  }
  const fileBuffer = await fs.readFile(path)
  const fileString = fileBuffer.toString()
  const result = JSON.parse(fileString);
  cache.set(path, result)
  return result
}

export async function findFilesByName(baseDir: string, callback: (fileName: string) => boolean): Promise<string[]>
export async function findFilesByName(baseDir: string, fileName: string): Promise<string[]>
export async function findFilesByName(baseDir: string, fileNameOrCallback: string | ((fileName: string) => boolean)): Promise<string[]> {
  async function recursiveSearch(dir: string): Promise<string[]> {
    const isTargetFile = (file: string): boolean => {
      if (typeof fileNameOrCallback === 'function') {
        return fileNameOrCallback(file)
      }
      return file === fileNameOrCallback
    }
    let results: string[] = [];
    const files = await fs.readdir(dir, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        results = results.concat(await recursiveSearch(filePath));
      } else if (isTargetFile(file.name)) {
        results.push(filePath);
      }
    }
    return results;
  }

  return await recursiveSearch(baseDir);
}

export async function findAllLibraryPackageJson(): Promise<PackageJson[]> {
  const libsRootPath = path.join(getProjectRootPath(), 'libs')
  const files = await findFilesByName(libsRootPath, 'package.json')
  return await Promise.all(files.map(file => getPackageJson(file)))
}
