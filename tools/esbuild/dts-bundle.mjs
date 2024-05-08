import {generateDtsBundle} from 'dts-bundle-generator'
import * as fsModule from 'fs'
import * as path from 'path'
import { ThreadController } from './thread-controller.mjs';
import { fileURLToPath } from 'url';
import { ThreadLogger } from './logger.mjs';

const fs = fsModule.promises

/**
 * Builds the entry points based on the given input.
 *
 * @param {string[] | Record<string, string> | { in: string, out: string }[]} entryPoints
 * @returns {Record<string, string>}
 */
function buildEntryPoints(entryPoints) {
  if (!Array.isArray(entryPoints)) return entryPoints
  const record = {}
  for (const entryPoint of entryPoints) {
    if (typeof entryPoint === 'string') {
      const fileName = path.basename(entryPoint)
      record[fileName] = entryPoint
    } else {
      record[entryPoint.out] = entryPoint.in
    }
  }

  return record
}

/**
 * Generates a TypeScript declaration (.d.ts) bundle for the given entry points.
 *
 * @param {string} moduleName
 * @param {Logger} logger
 * @param {string} outDir - The entry points for which the declaration bundle is generated.
 * @param {string[] | Record<string, string> | { in: string, out: string }[]} entryPoints - The entry points for which the declaration bundle is generated.
 * @param {string} tsconfigPath
 * @return {void}
 */
export async function dtsBundle(moduleName, logger, outDir, entryPoints, tsconfigPath) {
  const entryPointsRecord = buildEntryPoints(entryPoints);
  for (const fileName in entryPointsRecord) {
    const filePath = entryPointsRecord[fileName];
    logger.setStatus(moduleName, 'build types', true)
    let data
    try {
      const error = console.error
      console.error = (...args) => {
        logger.setError(moduleName, 'build types', {
          message: 'Build types error',
          stack: args.join('\n')
        })
      };
      data = generateDtsBundle(
        [
          {
            filePath,
            libraries: {
              inlinedLibraries: [
                '@one-inch-community/models'
              ]
            },
            output: {
              noBanner: true,
              exportReferencedTypes: false,
              inlineDeclareGlobals: true
            }
          }
        ],
        {
          preferredConfigPath: tsconfigPath,
          followSymlinks: true
        });
      console.error = error
      logger.setError(moduleName, 'build types', null)
      logger.setError(moduleName, 'dts error', null)
    } catch (error) {
      logger.setError(moduleName, 'dts error', error)
    }
    try {
      if (!data) {
        return
      }
      const fileNameAnd = restoreFileName(fileName)
      await fs.writeFile(path.join(outDir, fileNameAnd), data[0])
      logger.setError(moduleName, 'save types', null)
    } catch (error) {
      logger.setError(moduleName, 'save types', error)
    }
  }
}

function restoreFileName(fileName) {
  const extname = path.extname(fileName)
  if (extname.toLowerCase().includes('d.ts')) return fileName
  return fileName + '.d.ts';
}

const __filename = fileURLToPath(import.meta.url);

const threadController = new ThreadController(__filename,{ dtsBundle })

export function dtsBundleAsync(moduleName, logger, outDir, entryPoints, tsconfigPath) {
  return threadController.execute('dtsBundle', [ moduleName, null, outDir, entryPoints, tsconfigPath ])
}

export function dtsBundleThreadWrapper(moduleName, logger, outDir, entryPoints, tsconfigPath) {
  return dtsBundle(moduleName, logger, outDir, entryPoints, tsconfigPath)
}
