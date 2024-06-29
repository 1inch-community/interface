import {
  Address,
  parseAbi,
  SignTypedDataParameters,
  maxUint160,
  Hex,
  parseSignature,
  encodeFunctionData,
  encodeAbiParameters,
  decodeAbiParameters, maxUint256, maxUint48
} from 'viem';
import { ChainId } from '@one-inch-community/models';
import { getClient } from './chain-client';
import { permit2ContractAddress } from './contracts';
import { LongTimeAsyncCache } from '../cache';

type PermitLongTimeCacheItem = {
  permitSingle: Record<string, unknown>
  signature: Hex
}

const permitLongTimeCache = new LongTimeAsyncCache<PermitLongTimeCacheItem, string>('permit2', 29)

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

const loadAbi = () => import('./permit2_abi.json').then(m => m.default)

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
  const result = await client.readContract({
    address: permit2ContractAddress(chainId),
    abi: await loadAbi(),
    functionName: 'allowance',
    args: [tokenAddress, walletAddress, spenderAddress]
  })
  const [ amount, expiration, nonce ] = result as [ bigint, number, number ]
  return { amount, expiration, nonce }
}

export async function savePermit(chainId: ChainId, tokenAddress: Address, walletAddress: Address, spenderAddress: Address, signData: Hex, permitSingle: Record<string, unknown>) {
  const id = [chainId, tokenAddress, walletAddress, spenderAddress].join(":")
  await permitLongTimeCache.set(id, {
    permitSingle,
    signature: signData,
  })
}

export async function getPermit(chainId: ChainId, tokenAddress: Address, walletAddress: Address, spenderAddress: Address): Promise<PermitLongTimeCacheItem | null> {
  const id = [chainId, tokenAddress, walletAddress, spenderAddress].join(":")
  return await permitLongTimeCache.get(id)
}

export async function hasPermit(chainId: ChainId, tokenAddress: Address, walletAddress: Address, spenderAddress: Address): Promise<boolean> {
  const result = await getPermit(chainId, tokenAddress, walletAddress, spenderAddress)
  return result !== null
}

export async function preparePermit2ForSwap(owner: Address, permit2Sign: Hex, permitSingle: Record<string, unknown>): Promise<Hex> {
  const signature = parseSignature(permit2Sign)
  const permitCallFull = encodeFunctionData({
    abi: await loadAbi(),
    functionName: 'permit',
    args: [owner, permitSingle, (signature.r + signature.yParity)]
  })
  const permitCallParams = cutSelector(permitCallFull)
  const token = (permitSingle as any).details.token
  const spender = (permitSingle as any).spender
  return permitCallParams
}

function cutSelector(data: Hex): Hex {
  const hexPrefix = '0x';
  return hexPrefix + data.substring(hexPrefix.length + 8) as Hex;
}

function trim0x(bigNumber: bigint | string): string {
  const s = bigNumber.toString();
  if (s.startsWith('0x')) {
    return s.substring(2);
  }
  return s;
}

function compressPermit(permit: Hex): Hex {
  if (permit.length !== 706) {
    throw new Error('')
  }

  const [
    owner,
    token,
    amount,
    expiration,
    nonce,
    spender,
    sigDeadline,
    signature
  ] = decodeAbiParameters([
    { name: 'owner', type: 'address' },
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint160' },
    { name: 'expiration', type: 'uint48' },
    { name: 'nonce', type: 'uint48' },
    { name: 'spender', type: 'address' },
    { name: 'sigDeadline', type: 'uint256' },
    { name: 'signature', type: 'bytes' },
  ], permit);

  const compressResult = [
    amount.toString(16).padStart(40, '0'),
    (expiration.toString() === maxUint48.toString() ? '00000000' : (BigInt(expiration) + 1n).toString(16).padStart(8, '0')),
    nonce.toString(16).padStart(8, '0'),
    (sigDeadline.toString() === maxUint48.toString() ? '00000000' : (sigDeadline + 1n).toString(16).padStart(8, '0')),
    BigInt(signature).toString(16).padStart(128, '0'),
  ].join('')

  return `0x${compressResult}`
}

function decompressPermit(
  permit: Hex,
  token: Address,
  owner: Address,
  spender: Address
): Hex {
  if (permit.length !== 194) {
    throw new Error('')
  }
  const args = {
    amount: BigInt(permit.slice(0, 42)),
    expiration: Number('0x' + permit.slice(42, 50)),
    nonce: Number('0x' + permit.slice(50, 58)),
    sigDeadline: BigInt('0x' + permit.slice(58, 66)),
    r: '0x' + permit.slice(66, 130),
    vs: '0x' + permit.slice(130, 194),
  };
  return encodeAbiParameters(
    [
      { name: 'owner', type: 'address' },
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint160' },
      { name: 'expiration', type: 'uint48' },
      { name: 'nonce', type: 'uint48' },
      { name: 'spender', type: 'address' },
      { name: 'sigDeadline', type: 'uint256' },
      { name: 'signature', type: 'bytes' },
    ],
    [
      owner,
      token,
      args.amount,
      (args.expiration === 0 ? Number(maxUint48) : args.expiration - 1),
      args.nonce,
      spender,
      args.sigDeadline === 0n ? maxUint48 : args.sigDeadline - 1n,
      (args.r + trim0x(args.vs)) as Hex,
    ]
  )
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
