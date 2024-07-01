import { ChainId } from '@one-inch-community/models';
import { storage } from '../utils';
import { Address } from 'viem';

export function setChainIdInStorage(chainId: ChainId) {
  storage.set('chainId', Number(chainId))
}

export function getChainIdFromStorage() {
  return storage.get('chainId', Number)
}

export function setActiveAddress(address: Address) {
  storage.set('activeAddress', address)
}

export function getActiveAddress(): Address | null {
  return storage.get('activeAddress', String) as Address
}

export function setActiveWallet(id: string | null) {
  storage.set('activeWallet', id)
}

export function getActiveWallet(): string | null {
  return storage.get('activeWallet', String)
}

export function addConnectedWallet(id: string) {
  const connectedWalletList = storage.get('connectedWallet', JSON.parse)
  const connectedWalletSet = new Set<string>(connectedWalletList)
  if (connectedWalletSet.has(id)) {
    return
  }
  connectedWalletSet.add(id)
  storage.set('connectedWallet', [ ...connectedWalletSet.keys() ])
}

export function getConnectedWallet() {
  return storage.get('connectedWallet', JSON.parse)
}

export function removeConnectedWallet(id: string) {
  const connectedWalletList = storage.get('connectedWallet', JSON.parse)
  const connectedWalletSet = new Set<string>(connectedWalletList)
  if (!connectedWalletSet.has(id)) {
    return
  }
  connectedWalletSet.delete(id)
  storage.set('connectedWallet', [ ...connectedWalletSet.keys() ])
}
