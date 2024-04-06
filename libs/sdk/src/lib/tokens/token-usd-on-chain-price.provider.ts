import { ChainId, IToken } from "@one-inch-community/models";
import { Address, formatUnits, isAddressEqual } from 'viem';
import { buildDefaultTokenRageProvider } from './token-rate/token-rate.provider';

const USDTAddresses: Record<ChainId, Address> = {
  [ChainId.eth]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  [ChainId.bnb]: '0x55d398326f99059ff775485246999027b3197955',
  [ChainId.matic]: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  [ChainId.op]: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
  [ChainId.arbitrum]: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
  [ChainId.gnosis]: '0x4ecaba5870353805a9f068101a40e0f32ed605c6',
  [ChainId.avalanche]: '0xc7198437980c041c805a1edcba50c1ce5db95118',
  [ChainId.fantom]: '0xcc1b99ddac1a33c201a742a1851662e87bc7f22c',
  [ChainId.aurora]: '0x4988a896b1227218e4a686fde5eabdcabd91571f',
  [ChainId.klaytn]: '0x754288077d0ff82af7a5317c7cb8c444d421d103', // USDC
  [ChainId.zkSyncEra]: '0x493257fd37edb34451f62edf8d2a0c418852ba4c'
}

const decimals = 6

export class TokenUsdOnChainPriceProvider {

  private rateProvider = buildDefaultTokenRageProvider()

  async getPrice(chainId: ChainId, token: IToken): Promise<string> {
    const USDTAddress = USDTAddresses[chainId]
    if (isAddressEqual(token.address, USDTAddress)) {
      return '1'
    }
    const rate = await this.rateProvider.getRate(
      chainId,
      { address: USDTAddress, chainId, decimals, name: 'USDT', symbol: 'USDT' },
      token,
    )
    if (!rate) return '0'
    return formatUnits(rate, token.decimals)
  }

}