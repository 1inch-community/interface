import { getProjectPackageJson } from './files';

export async function getEnv() {
  const packageJson = await getProjectPackageJson()
  return {
    oneInchDevPortalHost: process.env.ONE_INCH_DEV_PORTAL_HOST,
    oneInchDevPortalToken: process.env.ONE_INCH_DEV_PORTAL_TOKEN,
    walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID,
    baseHref: process.env.BASE_HREF ?? '',
    infuraApiKey: process.env.INFURA_API_KEY ?? '',
    appVersion: packageJson.version,
  }
}
