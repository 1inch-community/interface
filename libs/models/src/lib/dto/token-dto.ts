import type { Address } from 'viem';

export interface ITokenDto {
  chainId: number
  symbol: string
  name: string
  address: Address
  decimals: number
  logoURI: string
  tags: string[]
  isFoT?: boolean
  displayedSymbol?: string
  extensions?: { eip2612: boolean }
  providers?: string[]
}