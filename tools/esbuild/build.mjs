import * as esbuild from 'esbuild';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { fundModules } from './fund-lib-modules.mjs';
import { debounce } from './debounce.mjs';
import arg from 'arg'
import { dtsBundlePlugin } from './dts-bundle.mjs';
import { Logger } from './logger.mjs';
import { generatePackageJsonPlugin } from './generate-package-json.mjs';
import { config } from 'dotenv';

const args = arg({
  '--watch': Boolean,
  '--production': Boolean,
  '--one-module': Boolean,
  '--lib-name': String,
})
const libName = args['--lib-name']
const isWatch = args['--watch'] ?? false;
const oneModuleLibrary = args['--one-module']

if (!libName) throw new Error('flag --lib-name not exist');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(path.dirname(__dirname));
const libRoot = path.join(projectRoot, 'libs', libName);
const distRoot = path.join(projectRoot, 'dist');
const libDist = path.join(distRoot, 'libs', libName);
const pkg = JSON.parse(fs.readFileSync(path.join(libRoot, 'package.json')).toString());
const pkgGlobal = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json')).toString());
const tsconfigPath = path.join(libRoot, 'tsconfig.lib.json');
const version = pkgGlobal.version
const modules = fundModules(libRoot);
const _oneModuleLibrary = oneModuleLibrary ?? modules.length === 1
const logger = new Logger(`${libName} v${version}`, isWatch, modules.map(m => m.moduleName))

config({ path: path.join(projectRoot, '.env') })

process.title = `${pkgGlobal.name}__${isWatch ? 'watch-build' : 'build'}_library_${libName}`

const typesReady = {}

function getBuildConfig(moduleName, entryPoint, dist, format) {

  const plugins = []
  if (!typesReady[entryPoint] || isWatch) {
    plugins.push(dtsBundlePlugin(logger, tsconfigPath))
  }
  typesReady[entryPoint] = true
  const moduleFullName = `@${pkgGlobal.name}/${libName}/${moduleName}`

  const module = `./index.esm.js`
  const main = `./index.cjs.js`
  const types = `./index.d.ts`

  return {
    entryPoints: {
      'index': entryPoint
    },
    bundle: true,
    splitting: format === 'esm',
    minify: false,
    outdir: dist,
    format: format,
    sourcemap: true,
    platform: 'browser',
    legalComments: 'none',
    tsconfig: tsconfigPath,
    external: ['@one-inch-community', 'lit', ...Object.keys(pkg?.peerDependencies ?? {})],
    entryNames: `[dir]/[name].${format}`,
    define: {
      '__environment__': JSON.stringify({
        oneInchDevPortalHost: process.env.ONE_INCH_DEV_PORTAL_HOST
      })
    },
    loader: { '.ts': 'ts' },
    plugins: [
      ...plugins,
      generatePackageJsonPlugin({
        name: moduleFullName,
        version: pkgGlobal.version,
        module,
        main,
        types,
        type: "module",
        peerDependencies: pkg?.peerDependencies ?? {},
        exports: {
          '.': {
            import: module,
            require: main,
            types: types,
          }
        },
      }),
    ]
  }
}

async function watchBuilder(moduleName, entryPoint, config) {
  let isError = false
  let context

  const rebuild = debounce(async () => {
    logger.setStatus(moduleName, 'rebuild', true)
    try {
      await context.rebuild()
      isError = false
      logger.setError(moduleName, 'rebuild', null)
    } catch (error) {
      isError = true
      logger.setError(moduleName, 'rebuild', error)
    }
    logger.setStatus(moduleName, 'watch')
  }, 300)

  const build = debounce(async () => {
    context = await esbuild.context(config)
    try {
      logger.setStatus(moduleName, `build ${config.format}`, true)
      await esbuild.build(config)
      isError = false
      logger.setError(moduleName, `build ${config.format}`, null)
    } catch (error) {
      isError = true
      logger.setError(moduleName, `build ${config.format}`, error)
    }
    logger.setStatus(moduleName, 'watch')
  }, 100)
  await build()
  fs.watch(path.dirname(entryPoint), { recursive: true },  async () => {
    if (isError || !context) {
      await build()
    } else {
      await rebuild()
    }
  })
}

async function buildOrWatch(moduleName, entryPoint, dist, format) {
  const config = getBuildConfig(moduleName, entryPoint, dist, format)
  if (isWatch) {
    if (format === 'cjs') return
    await watchBuilder(moduleName, entryPoint, config)
    return
  }
  logger.setStatus(moduleName, `build ${format}`, true)
  await esbuild.build(config)
  logger.setStatus(moduleName, `build finish`)
}

async function build({ modulePublicApiPath, moduleName }) {
  const dist = path.join(libDist, _oneModuleLibrary ? '' : moduleName);
  await Promise.all([
    buildOrWatch(
      moduleName,
      modulePublicApiPath,
      dist,
      'cjs'
    ),
    buildOrWatch(
      moduleName,
      modulePublicApiPath,
      dist,
      'esm'
    )
  ])
}

for (const module of modules) {
  build(module).then()
}

// build(modules[0]).then()