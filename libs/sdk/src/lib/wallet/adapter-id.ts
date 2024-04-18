import { EIP6963ProviderInfo } from '@one-inch-community/models';
import { encodePacked } from 'viem';

const idMap = new WeakMap<EIP6963ProviderInfo, string>()
export function adapterId(info: EIP6963ProviderInfo): string {
  if (idMap.has(info)) {
    return idMap.get(info)!
  }
  const id = encodePacked(
    ['string', 'string', 'string'],
    [
      info.name,
      info.rdns ?? '',
      info.icon
    ]
  ).slice(0, 10)
  idMap.set(info, id)
  return id
}