export interface GasPriceDto {
  baseFee: string
  low: GasPriceValueDto
  medium: GasPriceValueDto
  high: GasPriceValueDto
  instant: GasPriceValueDto
}

export interface GasPriceValueDto {
  maxPriorityFeePerGas: string
  maxFeePerGas: string
}
