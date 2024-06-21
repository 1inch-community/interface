import { Address, parseAbi, SignTypedDataParameters, maxUint160, Hex } from 'viem';
import { ChainId } from '@one-inch-community/models';
import { getClient } from './chain-client';
import { permit2ContractAddress } from './contracts';
import { LongTimeAsyncCache } from '../cache';

const permitLongTimeCache = new LongTimeAsyncCache<Hex, string>('permit', 29)

const permit2SupportedChain: Record<ChainId, boolean> = {
  [ChainId.eth]: true,
  [ChainId.bnb]: true,
  [ChainId.matic]: true,
  [ChainId.op]: true,
  [ChainId.arbitrum]: true,
  [ChainId.gnosis]: true,
  [ChainId.avalanche]: true,
  [ChainId.fantom]: false,
  [ChainId.aurora]: false,
  [ChainId.klaytn]: false,
  [ChainId.zkSyncEra]: true
};

const abi = () => parseAbi([
  'function allowance(address, address, address) view returns (uint160 amount, uint48 expiration, uint48 nonce)'
])

export function isSupportPermit2(chainId: ChainId): boolean {
  return permit2SupportedChain[chainId] ?? false;
}

function toDeadline(expiration: number): number {
  return Math.floor((Date.now() + expiration) / 1000);
}

export async function getPermit2TypeData(chainId: ChainId, tokenAddress: Address, walletAddress: Address, spenderAddress: Address): Promise<SignTypedDataParameters> {
  if (!isSupportPermit2(chainId)) {
    throw new Error(`chain ${chainId} not supported Permit2`)
  }
  const { nonce } = await getAllowanceData(chainId, tokenAddress, walletAddress, spenderAddress);

  const permitSingle: Record<string, unknown> = {
    details: {
      token: tokenAddress,
      amount: maxUint160,
      expiration: toDeadline(1000 * 60 * 60 * 24 * 30), // 30 day
      nonce
    },
    spender: spenderAddress,
    sigDeadline: toDeadline(1000 * 60 * 60 * 24 * 30), // 30 day
  };

  const domain = {
    chainId,
    name: 'Permit2',
    verifyingContract: permit2ContractAddress(chainId),
  }

  return {
    domain,
    account: walletAddress,
    primaryType: 'PermitSingle',
    types: PERMIT_TYPES,
    message: permitSingle
  }
}

export async function getAllowanceData(chainId: ChainId, tokenAddress: Address, walletAddress: Address, spenderAddress: Address) {
  if (!isSupportPermit2(chainId)) {
    throw new Error(`chain ${chainId} not supported Permit2`)
  }
  const client = getClient(chainId);
  return client.readContract({
    address: permit2ContractAddress(chainId),
    abi: abi(),
    functionName: 'allowance',
    args: [tokenAddress, walletAddress, spenderAddress]
  }).then(([ amount, expiration, nonce ]) => ({ amount, expiration, nonce }))
}

export async function savePermit(chainId: ChainId, tokenAddress: Address, walletAddress: Address, spenderAddress: Address, signData: Hex) {
  const id = [chainId, tokenAddress, walletAddress, spenderAddress].join(":")
  await permitLongTimeCache.set(id, signData)
}

export async function getPermit(chainId: ChainId, tokenAddress: Address, walletAddress: Address, spenderAddress: Address): Promise<Hex | null> {
  const id = [chainId, tokenAddress, walletAddress, spenderAddress].join(":")
  return await permitLongTimeCache.get(id)
}

export async function hasPermit(chainId: ChainId, tokenAddress: Address, walletAddress: Address, spenderAddress: Address): Promise<boolean> {
  const result = await getPermit(chainId, tokenAddress, walletAddress, spenderAddress)
  return result !== null
}

const PERMIT_DETAILS = [
  { name: 'token', type: 'address' },
  { name: 'amount', type: 'uint160' },
  { name: 'expiration', type: 'uint48' },
  { name: 'nonce', type: 'uint48' },
]

const EIP712_DOMAIN = [
  { name: "name", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
]

const PERMIT_TYPES = {
  PermitSingle: [
    { name: 'details', type: 'PermitDetails' },
    { name: 'spender', type: 'address' },
    { name: 'sigDeadline', type: 'uint256' },
  ],
  PermitDetails: PERMIT_DETAILS,
  EIP712Domain: EIP712_DOMAIN
}
