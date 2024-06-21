export interface WalletError extends Error {
  code: number
}

export function isUserRejectError(error: WalletError): boolean {
  const { code, message,  } = error
  return code === 4001 || message?.toLowerCase().includes('user rejected')
}
