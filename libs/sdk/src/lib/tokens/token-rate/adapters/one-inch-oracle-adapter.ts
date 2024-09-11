import { OneInchOracleBaseRateAdapter } from '../base-adapters/one-inch-oracle-base-rate-adapter';
import { oneInchSpotPriceOracle } from '@one-inch-community/sdk/chain';
import { ChainId } from '@one-inch-community/models';

export const oneInchOracleAdapter = new OneInchOracleBaseRateAdapter(
  'one-inch-oracle-adapter',
  oneInchSpotPriceOracle,
  [
    ChainId.eth,
    ChainId.bnb,
    ChainId.matic,
    ChainId.op,
    ChainId.arbitrum,
    ChainId.gnosis,
    ChainId.avalanche,
    ChainId.fantom,
    ChainId.aurora,
    ChainId.klaytn,
    ChainId.zkSyncEra,
  ]
)
