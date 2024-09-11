import { ChainId, IToken, ITokenRateSourceAdapter, Rate } from '@one-inch-community/models';
import { Address, parseAbi } from 'viem';
import { getClient } from '@one-inch-community/sdk/chain';
import { BigMath } from '@one-inch-community/core/math';

const abi = parseAbi([
  'function getRate(address srcToken, address dstToken, bool useWrappers) external view returns (uint256 weightedRate)'
])

export class OneInchOracleBaseRateAdapter implements ITokenRateSourceAdapter {

  constructor(
    public readonly name: string,
    private readonly factoryContractGetter: (chainId: ChainId) => Address,
    private readonly supportedChain: ChainId[]
  ) {
  }

  async getRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken): Promise<Rate | null> {
    const client = getClient(chainId)
    const contractAddress = this.factoryContractGetter(chainId)
    const [rateRaw, revertedRateRaw] = await Promise.all([
      client.readContract({
        abi,
        address: contractAddress,
        functionName: 'getRate',
        args: [ sourceToken.address, destinationToken.address, false ],
      }),
      client.readContract({
        abi,
        address: contractAddress,
        functionName: 'getRate',
        args: [ destinationToken.address, sourceToken.address, false ],
      })
    ])
    const isReverted = BigInt(sourceToken.address) > BigInt(destinationToken.address)
    const rate = BigMath.mul(rateRaw, BigMath.from(1, destinationToken.decimals), 18, destinationToken.decimals)
    const revertedRate = BigMath.mul(revertedRateRaw, BigMath.from(1, sourceToken.decimals), 18, sourceToken.decimals)
    return {
      chainId,
      sourceToken,
      destinationToken,
      rate,
      revertedRate,
      isReverted
    }
  }

  isSupportedChain(chainId: ChainId): boolean {
    return this.supportedChain.includes(chainId)
  }

}
