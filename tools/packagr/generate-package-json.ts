import * as path from 'path';
import * as fsModule from 'fs';

const fs = fsModule.promises;

export async function generatePackageJson(packageJsonContent: unknown, outDir: string) {
  const packageJsonPath = path.join(outDir, 'package.json');
  const contentStr = JSON.stringify(packageJsonContent, null, 2);
  await fs.writeFile(packageJsonPath, contentStr, 'utf8');
}
