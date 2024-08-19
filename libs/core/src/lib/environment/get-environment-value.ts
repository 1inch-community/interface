export interface Environment {
  oneInchDevPortalHost: string
  oneInchDevPortalToken?: string
  walletConnectProjectId: string
  baseHref: string
  appVersion: string
  infuraApiKey?: string
}

const requiredEnvFields: (keyof Environment)[] = [
  'oneInchDevPortalHost',
  'walletConnectProjectId',
  'appVersion',
]

declare const __environment__: Environment

const env: Partial<Environment> = {
  oneInchDevPortalHost: 'https://api.1inch.dev'
}

let embeddedMode = false

export function getEnvironmentValue<K extends keyof Environment>(valueName: K): Environment[K] {
  if (embeddedMode && env[valueName] === undefined && requiredEnvFields.includes(valueName)) {
    throw new Error(`environment value ${valueName} not exist`)
  }
  if (embeddedMode) {
    return env[valueName]!
  }
  return env[valueName] ?? __environment__[valueName]
}

export function setEnvironmentValue<K extends keyof Environment>(valueName: K, value:  Environment[K]) {
  env[valueName] = value
}

export function enabledEmbeddedMode() {
  embeddedMode = true
}
