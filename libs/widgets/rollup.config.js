import pkg from './package.json'
import { rollupLibBuilder } from '../../tools/build/rollup-lib-builder';

export default rollupLibBuilder({
  libName: pkg.name,
  oneModuleLibrary: false
})
