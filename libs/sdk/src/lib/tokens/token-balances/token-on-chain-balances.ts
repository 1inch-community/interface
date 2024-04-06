import { ChainId } from "@one-inch-community/models";
import { Address } from 'viem';
import { getBalance } from '../../chain';

export class TokenOnChainBalances {

  async getBalances(chainId: ChainId, walletAddress: Address, addresses: Address[]): Promise<Record<Address, string>> {
    const result: Record<Address, string> = {}

    await Promise.all(addresses
      .map(address => getBalance(chainId, walletAddress, address)
        .then(balance => result[address] = balance.toString())))

    return result
  }
}