import { ChainId, IToken, ITokenRateSourceAdapter, Rate } from '@one-inch-community/models';
import { Address, getAddress, isAddressEqual, parseAbi, zeroAddress } from 'viem';
import { getClient } from '../../../chain';
import { BlockTimeCache, LongTimeCache } from '../../../cache';
import { BigMath } from '../../../utils';

const FactoryContractABI = parseAbi([
  'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'
]);

const PoolContractABI = parseAbi([
  'function liquidity() external view returns (uint128)',
  'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)'
]);

export class UniswapV3BaseRateAdapter implements ITokenRateSourceAdapter {

  private readonly pools = new LongTimeCache<string, [Address, Address]>(`${this.name}_pools`, 7);
  private readonly liquidityCache = new BlockTimeCache<string, bigint>();

  constructor(
    public readonly name: string,
    private readonly factoryContractGetter: (chainId: ChainId) => Address,
    private readonly supportedChain: ChainId[],
    private readonly feeTiers: number[]
  ) {}

  isSupportedChain(chainId: ChainId): boolean {
    return this.supportedChain.includes(chainId);
  }

  async getRate(chainId: ChainId, sourceToken: IToken, destinationToken: IToken): Promise<Rate | null> {
    try {
      const srcTokenAddress = getAddress(sourceToken.address);
      const dstTokenAddress = getAddress(destinationToken.address);
      const [pool, token0] = await this.getPool(chainId, srcTokenAddress, dstTokenAddress);
      if (pool === zeroAddress) {
        return null;
      }
      const isRevertRate = !isAddressEqual(sourceToken.address, token0);
      const [ sqrtPriceX96, liquidity ] = await Promise.all([
        this.getSqrtPriceX96(chainId, pool),
        this.getLiquidity(chainId, pool)
      ])
      const [ rate, revertedRate ] = this.calculatePrice(sqrtPriceX96, sourceToken, destinationToken, liquidity, isRevertRate);
      return {
        rate,
        revertedRate,
        isReverted: isRevertRate,
      };
    } catch (error) {
      console.error(`Error in UniswapV3BaseRateAdapter adapter name ${this.name}`, error);
      return null
    }
  }

  private async getPool(chainId: ChainId, srcTokenAddress: Address, dstTokenAddress: Address): Promise<[Address, Address]> {
    const id1 = [chainId, srcTokenAddress, dstTokenAddress].join(':')
    if (this.pools.has(id1)) {
      return this.pools.get(id1)!
    }
    const id2 = [chainId, dstTokenAddress, srcTokenAddress].join(':')
    if (this.pools.has(id2)) {
      return this.pools.get(id2)!
    }

    const client = getClient(chainId);
    let resultPool: Address = zeroAddress
    let maxLiquidity = 0n
    for (const fee of this.feeTiers) {
      const pool: Address = await client.readContract({
        address: getAddress(this.factoryContractGetter(chainId)),
        functionName: 'getPool',
        args: [srcTokenAddress, dstTokenAddress, fee],
        abi: FactoryContractABI
      });
      if (pool === zeroAddress) {
        continue
      }
      const liquidity = await this.getLiquidity(chainId, pool)
      if (liquidity > maxLiquidity) {
        maxLiquidity = liquidity;
        resultPool = pool;
      }
    }
    if (resultPool !== zeroAddress) {
      const token0 = await client.readContract({
        address: resultPool,
        abi: PoolContractABI,
        functionName: 'token0'
      });
      this.pools.set(id1, [resultPool, token0])
      this.pools.set(id2, [resultPool, token0])
      return [resultPool, token0];
    }
    return [zeroAddress, zeroAddress];
  }

  private async getSqrtPriceX96(chainId: ChainId, pool: Address): Promise<bigint> {
    const client = getClient(chainId);
    const [ sqrtPriceX96 ] = await client.readContract({
      address: pool,
      abi: PoolContractABI,
      functionName: 'slot0'
    });
    return sqrtPriceX96;
  }

  private async getLiquidity(chainId: ChainId, pool: Address) {
    const result = this.liquidityCache.get(chainId, pool)
    if (result) {
      return result
    }
    const client = getClient(chainId);
    const liquidity = await client.readContract({
      address: pool,
      functionName: 'liquidity',
      abi: PoolContractABI
    })
    this.liquidityCache.set(chainId, pool, liquidity)
    return liquidity
  }

  private calculatePrice(sqrtPriceX96: bigint, sourceToken: IToken, destinationToken: IToken, liquidity: bigint, isRevertRate: boolean): [bigint, bigint] {
    const Q96 = 2n ** 96n
    const sourceTokenAmount = liquidity * Q96 / sqrtPriceX96
    const destinationTokenAmount = liquidity * sqrtPriceX96 / Q96;
    return [
      BigMath.div(
        isRevertRate ? destinationTokenAmount : sourceTokenAmount,
        isRevertRate ? sourceTokenAmount : destinationTokenAmount,
        sourceToken.decimals,
        destinationToken.decimals,
        destinationToken.decimals
      ),
      BigMath.div(
        isRevertRate ? sourceTokenAmount : destinationTokenAmount,
        isRevertRate ? destinationTokenAmount : sourceTokenAmount,
        destinationToken.decimals,
        sourceToken.decimals,
        sourceToken.decimals,
      )
    ]
  }
}
