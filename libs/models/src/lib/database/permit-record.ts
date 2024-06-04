import { ChainId } from '../chain';
import { Address, Hex } from 'viem';

export interface IPermitRecord {
  id: string
  chainId: ChainId
  contractAddress: Address
  ownerAddress: Address
  spenderAddress: Address
  createTimestamp: number
  permit: Hex
}
