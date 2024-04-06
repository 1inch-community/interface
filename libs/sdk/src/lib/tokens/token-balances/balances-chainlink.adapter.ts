// import { Address, formatUnits, parseAbi } from 'viem';
// import { ChainId } from '@one-inch-community/models';
// import { getClient } from '../../chain';
// import { tokenController } from '../token';
//
// const currency = {
//   USD: '0x0000000000000000000000000000000000000348' as Address
// }
//
// const chainlinkFeedRegistryAddress = '0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf' as const
//
// const abi = parseAbi([
//   'function latestAnswer(address base, address quote) external view returns (int256 answer)',
//   'function decimals(address base, address quote) external view returns (uint8)'
// ])
//
// export class BalancesChainlinkAdapter {
//
//   async getUSDPriceFromAllTokens(chainId: ChainId) {
//     if (chainId === ChainId.eth) {
//       const tokens = await tokenController.getTokenAddresses(chainId)
//       return this.loadUSDPriceFromAllTokens(tokens)
//     }
//   }
//
//   async getUSDPrice(chainId: ChainId, tokenAddress: Address) {
//     if (chainId === ChainId.eth) {
//       return this.loadUSDPrice(tokenAddress)
//     }
//   }
//
//   private async loadUSDPriceFromAllTokens(adresses: Address[]) {
//     const pending = []
//     for (const addresse of adresses) {
//       pending.push(this.loadUSDPrice(addresse))
//     }
//     const result = await Promise.all(pending)
//     const cleanResult = result.filter(value => value !== null)
//     debugger
//   }
//
//   private loadUSDPrice(tokenAddress: Address) {
//     const client = getClient(ChainId.eth)
//     const lastAnswerPending: Promise<bigint> = client.readContract({
//       abi,
//       address: chainlinkFeedRegistryAddress,
//       functionName: 'latestAnswer',
//       args: [
//         tokenAddress,
//         currency.USD
//       ]
//     })
//     const decimalsPending: Promise<number> = client.readContract({
//       abi,
//       address: chainlinkFeedRegistryAddress,
//       functionName: 'decimals',
//       args: [
//         tokenAddress,
//         currency.USD
//       ]
//     })
//
//     return Promise.all([ lastAnswerPending, decimalsPending ])
//       .then(([lastAnswer, decimals]) => ([tokenAddress, formatUnits(lastAnswer, decimals)]))
//       .catch(error => {
//         console.error('error load price for', tokenAddress)
//         console.error(error)
//         return null
//       })
//   }
//
// }