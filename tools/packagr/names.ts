export function getLibFullName(projectName: string, libName: string): string {
  return [
    `@${projectName}`,
    libName,
  ].filter(Boolean).join('/');
}
