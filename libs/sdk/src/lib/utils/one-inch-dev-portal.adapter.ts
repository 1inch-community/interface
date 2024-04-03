import { ChainId, ITokenDto } from '@one-inch-community/models';
import type { Address } from 'viem';
import { getEnvironmentValue } from '../environment';

export class OneInchDevPortalAdapter {

  private readonly host: string = getEnvironmentValue('oneInchDevPortalHost')

  async getWhiteListedTokens(chainId: ChainId): Promise<ITokenDto[]> {
    const response = await fetch(`${this.host}/token/v1.2/${chainId}/token-list`);
    const data: { tokens: ITokenDto[] } = await response.json();
    return data.tokens;
  }

  async getBalancesByWalletAddress(chainId: ChainId, walletAddress: Address): Promise<Record<Address, string>> {

    const response = await fetch(`${this.host}/balance/v1.2/${chainId}/balances/${walletAddress}`);
    return await response.json();
  }

  async getTokenPrices(chainId: ChainId): Promise<Record<Address, string>> {
    const queryParams = new URLSearchParams({ currency: 'USD' });
    const response = await fetch(`${this.host}/price/v1.1/${chainId}?${queryParams}`);
    return await response.json();
  }

}