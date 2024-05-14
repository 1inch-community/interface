import {generateDtsBundle} from 'dts-bundle-generator'
import * as fsModule from 'fs'
import * as path from 'path'

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
 * @return {Promise<void>}
 */
export function dtsBundle(moduleName, logger, outDir, entryPoints, tsconfigPath) {
  return new Promise(async (resolve, reject) => {
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
          reject()
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
        reject()
      }
      try {
        if (!data) {
          return reject()
        }
        const fileNameAnd = restoreFileName(fileName)
        await fs.writeFile(path.join(outDir, fileNameAnd), data[0])
        logger.setError(moduleName, 'save types', null)
      } catch (error) {
        logger.setError(moduleName, 'save types', error)
        reject()
      }
    }
    resolve()
  })
}

function restoreFileName(fileName) {
  const extname = path.extname(fileName)
  if (extname.toLowerCase().includes('d.ts')) return fileName
  return fileName + '.d.ts';
}
