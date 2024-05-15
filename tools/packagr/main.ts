import { LibraryBuilder } from './library-builder';
import { Logger } from './logger';
import * as process from 'node:process';
import { ProjectBuilder } from './project-builder';
import { getProjectPackageJson } from './files';
import { isProcessRunning, killProcess } from './process';

const libName = process.env['libName'];
const isWatch = Boolean(process.env['isWatch']);
const isProduction = Boolean(process.env['isProduction']);
const oneModuleLibrary = Boolean(process.env['oneModuleLibrary']);
const killClone = Boolean(process.env['killClone']);


(async () => {
  const packageJson = await getProjectPackageJson()
  const processName = [packageJson.name, libName ?? '', 'builder'].filter(Boolean).join('-')
  const buildingIsRun = await isProcessRunning(processName)
  if (buildingIsRun && killClone) {
    await killProcess(processName)
  }
  Reflect.set(globalThis.process, 'title', processName)
  if (libName) {
    const logger = Logger.now(libName)
    const builder = new LibraryBuilder(logger, libName, isWatch, isProduction, oneModuleLibrary)
    await builder.build()
  } else {
    const logger = Logger.now(packageJson.name)
    const builder = new ProjectBuilder(logger, isWatch, isProduction)
    await builder.build()
  }
})()
