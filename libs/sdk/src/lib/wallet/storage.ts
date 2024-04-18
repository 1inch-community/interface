import { ChainId } from '@one-inch-community/models';
import { storage } from '../utils';
import { Address, getAddress } from 'viem';

export function setChainId(chainId: ChainId) {
  storage.set('chainId', chainId)
}

export function getChainId() {
  return storage.get('chainId', Number)
}

export function setActiveAddress(address: Address) {
  storage.set('activeAddress', address)
}

export function getActiveAddress(): Address | null {
  return storage.get('activeAddress', JSON.parse)
}

export function setActiveWallet(id: string | null) {
  storage.set('activeWallet', id)
}

export function getActiveWallet(): string | null {
  return storage.get('activeWallet', JSON.parse)
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