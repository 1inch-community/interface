import { ChainId } from '@one-inch-community/models';
import type { Address } from 'viem';
import { getEnvironmentValue } from '../environment';

interface OneInchTokenDTO {
  chainId: number
  symbol: string
  name: string
  address: Address
  decimals: number
  logoURI: string
  providers: string[]
  eip2612: boolean
  isFoT: boolean
  displayedSymbol: string
  tags: string[]
}

export class OneInchDevPortalAdapter {

  private readonly host: string = getEnvironmentValue('oneInchDevPortalHost')

  getOneInchWhiteListedTokens(chainId: ChainId): Promise<OneInchTokenDTO[]> {
    return fetch(`${this.host}/token/v1.2/${chainId}/token-list`)
      .then(response => response.json())
      .then(data => data.tokens);
  }

}