import * as path from 'path';
import * as fsModule from 'fs'
const fs = fsModule.promises

export function generatePackageJsonPlugin(packageJsonContent) {
  return {
    name: 'generate-package-json',
    setup(build) {
      build.onEnd(async () => {
        const outdir = build.initialOptions.outdir || '.';
        const packageJsonPath = path.join(outdir, 'package.json');
        const contentStr = JSON.stringify(packageJsonContent, null, 2);
        await fs.writeFile(packageJsonPath, contentStr, 'utf8');
      });
    }
  }
 }