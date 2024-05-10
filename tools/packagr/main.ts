import { LibraryBuilder } from './library-builder';
import { buildLogger } from './logger';

const libName = 'sdk';
const isWatch = false;
const isProduction = false;
const oneModuleLibrary = true;

if (!libName) throw new Error('flag --lib-name not exist');

(async () => {
  const logger = buildLogger(libName, isWatch, isProduction, oneModuleLibrary)
  const builder = new LibraryBuilder(logger, libName, isWatch, isProduction, oneModuleLibrary)
  await builder.build()
})()
