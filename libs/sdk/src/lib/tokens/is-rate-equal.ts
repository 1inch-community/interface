import { Rate } from "@one-inch-community/models";
import { isTokensEqual } from './is-tokens-equal';

export function isRateEqual(rate1: Rate, rate2: Rate): boolean {
  return rate1.rate === rate2.rate
    && rate1.chainId === rate2.chainId
    && rate1.revertedRate === rate2.revertedRate
    && isTokensEqual(rate1.sourceToken, rate2.sourceToken)
    && isTokensEqual(rate1.destinationToken, rate2.destinationToken)
}
