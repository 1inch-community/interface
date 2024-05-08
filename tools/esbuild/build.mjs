import arg from 'arg';
import { LibBuilder } from './lib-builder.mjs';

const args = arg({
  '--watch': Boolean,
  '--production': Boolean,
  '--one-module': Boolean,
  '--lib-name': String
});
const libName = args['--lib-name'];
const isWatch = args['--watch'] ?? false;
const isProduction = args['--production'] ?? false;
const oneModuleLibrary = args['--one-module'];

if (!libName) throw new Error('flag --lib-name not exist');

const builder = new LibBuilder(libName, isWatch, isProduction, oneModuleLibrary);
builder.start()
  .then(() => {
    if (!isWatch) {
      process.exit(0);
    }
  });

