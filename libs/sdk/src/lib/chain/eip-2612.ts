import { AbiFunction, Address, Hex, parseAbi, toFunctionSelector, maxUint256 } from 'viem';
import { getClient } from './chain-client';
import { ChainId } from '@one-inch-community/models';
import { QueueCache } from '@one-inch-community/core/cache';

type EIP712Parameter = {
  name: string
  type: string
}

const eipPermitAbi = 'function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external' as const
const daiPermitAbi = 'function permit(address holder, address spender, uint256 nonce, uint256 expiry, bool allowed, uint8 v, bytes32 r, bytes32 s) external' as const

const apiPermit = () => parseAbi([
  eipPermitAbi,
  daiPermitAbi
])

const abiNonce = () => parseAbi([
  'function nonces(address owner) external view returns (uint)',
  'function nonce(address owner) external view returns (uint)',
  'function getNonce(address owner) external view returns (uint)',
  'function _nonces(address owner) external view returns (uint)',
])

const abiDomainSeparator = parseAbi([
  'function DOMAIN_SEPARATOR() external view returns (bytes32)'
])

const versionAbi = parseAbi([
  'function version() view returns (string)'
])

const nameAbi = parseAbi([
  'function name() view returns (string)'
])

const permitSelector = () => toFunctionSelector(apiPermit()[0]);
const permitSelectorDai = () => toFunctionSelector(apiPermit()[0]);
const domainSeparatorSelector = () => toFunctionSelector(abiDomainSeparator[0])
const nonceSelectors = () => abiNonce().map(abi => toFunctionSelector(abi))

async function circularViewCall<T>(chainId: ChainId, contract: Address, abiList: AbiFunction[], args: unknown[]): Promise<T> {
  const client = getClient(chainId)
  for (const abi of abiList) {
    try {
      return await client.readContract({
        args,
        abi: [abi],
        functionName: abi.name,
        address: contract
      })
    } catch (error) {
      //
    }
  }
  throw new Error('fail circular view call')
}

function getNonce(chainId: ChainId, contract: Address, owner: Address) {
  return circularViewCall<bigint>(chainId, contract, abiNonce() as any as AbiFunction[], [ owner ])
}

function getName(chainId: ChainId, contract: Address) {
  return circularViewCall<string>(chainId, contract, nameAbi as any as AbiFunction[], [ ])
}

function getVersion(chainId: ChainId, contract: Address) {
  return circularViewCall<string>(chainId, contract, versionAbi as any as AbiFunction[], [ ])
}

function getDomainSeparator(chainId: ChainId, contract: Address) {
  return circularViewCall<string>(chainId, contract, abiDomainSeparator as any as AbiFunction[], [ ])
}

const codeCache = new QueueCache<string, Hex>(5)
async function getCode(chainId: ChainId, contract: Address) {
  const id = [chainId, contract].join(':')
  const cacheValue = codeCache.get(id)
  if (cacheValue) {
    return cacheValue
  }
  const client = getClient(chainId)
  const code = await client.getBytecode({
    address: contract
  })
  if (!code) {
    throw new Error(`Contract not found: ${contract}`)
  }
  codeCache.set(id, code)
  return code
}

function checkExistDomainSeparatorSelector(code: Hex) {
  return code.includes(domainSeparatorSelector().replace('0x', '').toLowerCase())
}

function checkExistNonceSelector(code: Hex) {
  return nonceSelectors().some(selector => code.includes(selector.replace('0x', '').toLowerCase()))
}

function checkExistPermitSelector(code: Hex) {
  const _permitSelector = permitSelector().replace('0x', '').toLowerCase()
  return code.includes(_permitSelector) || isDaiLikePermit(code)
}

function isDaiLikePermit(code: Hex) {
  const _permitSelectorDai = permitSelectorDai().replace('0x', '').toLowerCase()
  return code.includes(_permitSelectorDai)
}

export async function isSupportedEIP2612(chainId: ChainId, contract: Address): Promise<boolean> {
  try {
    const code = await getCode(chainId, contract);
    const lowerCaseCode = code.toLowerCase() as Hex
    let isSupportedEIP2612 = true
    isSupportedEIP2612 && (isSupportedEIP2612 = checkExistPermitSelector(lowerCaseCode))
    isSupportedEIP2612 && (isSupportedEIP2612 = checkExistDomainSeparatorSelector(lowerCaseCode))
    isSupportedEIP2612 && (isSupportedEIP2612 = checkExistNonceSelector(lowerCaseCode))
    return isSupportedEIP2612
  } catch (error) {
    return false
  }
}

export async function makePermitTypeData(chainId: ChainId, contract: Address, owner: Address, spender: Address) {
  const [
    code,
    name,
    version,
    domainSeparator,
    nonce
  ] = await Promise.all([
    getCode(chainId, contract),
    getName(chainId, contract),
    getVersion(chainId, contract),
    getDomainSeparator(chainId, contract),
    getNonce(chainId, contract, owner),
  ])
  const isDaiLike = isDaiLikePermit(code)

  const [EIP712DomainType, EIP712DomainData] = getEIP712DomainDataAndType(
    chainId, contract, name, version
  )
  const [PermitType, PermitData] = getPermitDataAndType(
    isDaiLike, owner, spender, nonce
  )

  return {
    primaryType: 'Permit',
    types: {
      EIP712Domain: EIP712DomainType,
      Permit: PermitType,
    },
    domain: EIP712DomainData,
    message: PermitData,
  }
}

function getPermitDataAndType(isDaiLike: boolean, owner: Address, spender: Address, nonce: bigint) {
  const type: EIP712Parameter[] = isDaiLike ? daiPermitModelFields : eip2612PermitModelFields
  const data: Record<string, unknown> = {}
  if (isDaiLike) {
    data['holder'] = owner
    data['spender'] = spender
    data['nonce'] = nonce
    data['expiry'] = Math.round(Date.now() / 1000) + 300 // 5 min
    data['allowed'] = true
  } else {
    data['owner'] = owner
    data['spender'] = spender
    data['value'] = maxUint256
    data['nonce'] = nonce
    data['deadline'] = Math.round(Date.now() / 1000) + 300 // 5 min
  }
  return [type, data]
}

function getEIP712DomainDataAndType(chainId: ChainId, contract: Address, name: string, version: string): [EIP712Parameter[], object] {
  const type: EIP712Parameter[] = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ]
  const data = {
    name,
    version,
    chainId,
    verifyingContract: contract
  }
  return [type, data]
}

const eip2612PermitModelFields: EIP712Parameter[] = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
]

const daiPermitModelFields: EIP712Parameter[] = [
  { name: 'holder', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'nonce', type: 'uint256' },
  { name: 'expiry', type: 'uint256' },
  { name: 'allowed', type: 'bool' },
];
