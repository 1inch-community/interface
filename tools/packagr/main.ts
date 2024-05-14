import { LibraryBuilder } from './library-builder';
import { Logger } from './logger';
import * as process from 'node:process';
import { ProjectBuilder } from './project-builder';
import { getProjectPackageJson } from './files';

const libName = process.env['libName'];
const isWatch = Boolean(process.env['isWatch']);
const isProduction = Boolean(process.env['isProduction']);
const oneModuleLibrary = Boolean(process.env['oneModuleLibrary']);


(async () => {
  const packageJson = await getProjectPackageJson()
  Reflect.set(globalThis.process, 'title', [packageJson.name, libName ?? '', 'builder'].filter(Boolean).join('-'))
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
