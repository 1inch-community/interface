import {Address} from "viem";

export enum Contracts {
  OneInchRouterV5 = 'OneInchRouterV5'
}

export const ContractAddresses: Record<Contracts, Address> = {
  [Contracts.OneInchRouterV5]: '0x1111111254eeb25477b68fb85ed929f73a960582'
}
