import type { Address } from 'viem';
import { ChainId } from '@one-inch-community/models';

export type RepositoryPayload = { signal: AbortSignal, chainId?: ChainId, symbol?: string, address?: Address }
export type Repository = (payload: RepositoryPayload) => Promise<HTMLImageElement>