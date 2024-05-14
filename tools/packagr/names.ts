export function getLibraryFullName(projectName: string, libName: string): string {
  return [
    `@${projectName}`,
    libName,
  ]
    .filter(Boolean)
    .join('/');
}

export function getModuleFullName(projectName: string, libName: string, moduleName: string): string {
  return [
    `@${projectName}`,
    libName,
    moduleName,
  ]
    .filter(Boolean)
    .join('/');
}
