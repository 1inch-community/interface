import { contextField } from './context-field';
import { ChainId, IBaseEventEmitter } from '@one-inch-community/models';
import { Block } from 'viem';
import { InternalEventEmitter } from '../event-emitter';
import { getWSClient } from './chain-client';

const blockEmitterMap: Record<ChainId, IBaseEventEmitter<Block> | null> = contextField('__block_emitter_map', () => ({
  [ChainId.eth]: null,
  [ChainId.bnb]: null,
  [ChainId.matic]: null,
  [ChainId.op]: null,
  [ChainId.arbitrum]: null,
  [ChainId.gnosis]: null,
  [ChainId.avalanche]: null,
  [ChainId.fantom]: null,
  [ChainId.aurora]: null,
  [ChainId.klaytn]: null,
  [ChainId.zkSyncEra]: null,
}))

function blockListener(chainId: ChainId): IBaseEventEmitter<Block> {
  return new InternalEventEmitter<Block>(emitter => {
    const client = getWSClient(chainId)
    return client.watchBlocks({ onBlock: block => emitter.emit(block) })
  })
}

export function getBlockEmitter(chainId: ChainId): IBaseEventEmitter<Block> {
  if (blockEmitterMap[chainId] === null) {
    blockEmitterMap[chainId] = blockListener(chainId)
  }
  return blockEmitterMap[chainId]!
}