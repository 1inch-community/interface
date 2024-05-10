import * as path from 'path';

export function getProjectRootPath() {
  return path.dirname(path.dirname(__dirname))
}

export function getLibraryRootPath(libName: string) {
  return path.join(getProjectRootPath(), 'libs', libName);
}

export function getLibraryDistPath(libName: string) {
  return path.join(
    getProjectRootPath(),
    'dist',
    'libs',
    libName
  );
}

export function getModuleDistPath(libName: string, moduleName: string): string {
  return path.join(getLibraryDistPath(libName), moduleName);
}

export function getProjectPackageJsonPath() {
  return path.resolve(getProjectRootPath(), 'package.json');
}

export function getLibraryPackageJsonPath(libName: string): string {
  return path.resolve(getLibraryRootPath(libName), 'package.json');
}

export function getLibraryTsconfigPath(libName: string) {
  return path.resolve(getLibraryRootPath(libName), 'tsconfig.lib.json');
}
