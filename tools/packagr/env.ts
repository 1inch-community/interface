import { getProjectPackageJson } from './files';

export async function getEnv() {
  const packageJson = await getProjectPackageJson()
  return {
    oneInchDevPortalHost: process.env.ONE_INCH_DEV_PORTAL_HOST,
    walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID,
    appVersion: packageJson.version,
  }
}
