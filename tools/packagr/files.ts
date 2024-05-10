import * as fsSync from 'fs';
import { getLibraryPackageJsonPath, getProjectPackageJsonPath } from './paths';

const fs = fsSync.promises

export async function getProjectPackageJson() {
  return await getPackageJson(getProjectPackageJsonPath())
}

export async function getLibraryPackageJson(libName: string) {
  return await getPackageJson(getLibraryPackageJsonPath(libName))
}

async function getPackageJson(path: string) {
  const fileBuffer = await fs.readFile(path)
  const fileString = fileBuffer.toString()
  return JSON.parse(fileString);
}
