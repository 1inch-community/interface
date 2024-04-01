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
 * @param {Logger} logger
 * @param {string} outDir - The entry points for which the declaration bundle is generated.
 * @param {string[] | Record<string, string> | { in: string, out: string }[]} entryPoints - The entry points for which the declaration bundle is generated.
 * @return {void}
 */
export async function dtsBundle(logger, outDir, entryPoints) {
  const entryPointsRecord = buildEntryPoints(entryPoints);
  for (const fileName in entryPointsRecord) {
    const filePath = entryPointsRecord[fileName];
    const moduleName = path.basename(path.dirname(filePath))
    logger.setStatus(moduleName, 'build types', true)
    try {
      const data = generateDtsBundle([{ filePath, output: { noBanner: true } }]);
      const fileNameAnd = restoreFileName(fileName)
      await fs.writeFile(path.join(outDir, fileNameAnd), data[0])
    } catch (error) {
      logger.setError(moduleName, error)
    }
  }
}

/**
 * Creates a dts-bundle plugin for a build process.
 *
 * @param {Logger} logger
 * @returns {Object} The dts-bundle plugin.
 */
export function dtsBundlePlugin(logger) {
  return {
    name: 'dts-bundle',
    setup(build) {
      const entryPoints = build.initialOptions.entryPoints
      const outDir = build.initialOptions.outdir
      build.onEnd(async () => {
        await dtsBundle(logger, outDir, entryPoints)
      })
    }
  }
}

function restoreFileName(fileName) {
  const extname = path.extname(fileName)
  if (extname.toLowerCase().includes('d.ts')) return fileName
  return fileName + '.d.ts';
}