import type { Address } from 'viem';

export interface ITokenDto {
  chainId: number
  symbol: string
  name: string
  address: Address
  decimals: number
  logoURI: string
  providers: string[]
  eip2612: boolean
  isFoT: boolean
  displayedSymbol: string
  tags: string[]
}