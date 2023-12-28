import {Address} from "viem";

export type TokenDTO = Omit<Token, 'id' | 'priority'> & {
  providers?: string[]
}

export interface Token {
  id: string
  chainId: number
  address: Address
  name: string
  decimals: number
  symbol: string
  logoURI: string
  tags: string[]
  priority: number
}
