import type { Address } from 'viem';

export interface FusionQuoteReceiveDto {
  recommended_preset: string
  quoteId: string | null
  settlementAddress: Address
  pfGas: number
  gas: number
  presets: Record<string, FusionPresetDto>
  toTokenAmount: string
  fromTokenAmount: string
  feeToken: Address
}

export interface FusionPresetDto {
  auctionDuration: number
  auctionEndAmount: string
  auctionStartAmount: string
  bankFee: string
  initialRateBump: number
  points: {delay: number, coefficient: number}[]
  startAuctionIn: number
  tokenFee: string
}