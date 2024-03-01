import pkg from './package.json'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { rollupLibBuilder } from '../../tools/build/rollup-lib-builder';

export default rollupLibBuilder({
  libName: pkg.name
})
