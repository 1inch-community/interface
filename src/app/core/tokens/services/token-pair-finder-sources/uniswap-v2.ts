import {TokenPairFinderSource} from "./token-pair-finder-source.interface";
import {ChainId, getViemDefaultClient} from "@1inch/v3/core/wallet";
import {Token} from "@1inch/v3/core/tokens";
import {Address, isAddressEqual, parseAbi} from "viem";
import {BigMath} from "@1inch/v3/core/shared";

const FactoryContractABI = parseAbi([
    'function getPair(address tokenA, address tokenB) external view returns (address pair)'
])

const PoolContractABI = parseAbi([
    'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
    'function token0() external view returns (address)',
    'function token1() external view returns (address)'
])

const zeroAddress: Address = '0x0000000000000000000000000000000000000000'

export class UniswapV2 implements TokenPairFinderSource {

    // Map<string, [pool address, token0 address]>
    private readonly pools = new Map<string, [Address, Address]>()

    constructor(
        public readonly name :string,
        private readonly factoryContractGetter: (chainId: ChainId) => Address,
        private readonly supportedChain: ChainId[]
    ) {
    }

    isSupportedChain(chainId: ChainId): boolean {
        return this.supportedChain.includes(chainId)
    }

    async getRate(chainId: ChainId, srcToken: Token, dstToken: Token): Promise<bigint | null> {
        try {
            const [pool, token0]: [Address, Address] = await this.getPool(chainId, srcToken, dstToken)
            if (pool === zeroAddress) {
                return null
            }
            const reserves = await this.getReserves(chainId, pool)
            const isRevertRate = !isAddressEqual(srcToken.address, token0)
            return BigMath.dev(
                isRevertRate ? reserves[1] : reserves[0],
                isRevertRate ? reserves[0] : reserves[1],
                srcToken.decimals,
                dstToken.decimals,
                dstToken.decimals
            )
        } catch (error) {
            console.error(error)
            return null
        }
    }

    private async getPool(chainId: ChainId, srcToken: Token, dstToken: Token): Promise<[Address, Address]> {
        const id1 = [chainId, srcToken.address, dstToken.address].join(':')
        if (this.pools.has(id1)) {
            return (this.pools.get(id1) as any)
        }
        const id2 = [chainId, dstToken.address, srcToken.address].join(':')
        if (this.pools.has(id2)) {
            return (this.pools.get(id2) as any)
        }
        const client = getViemDefaultClient(chainId)
        const pool: Address = await client.readContract({
            address: this.factoryContractGetter(chainId),
            functionName: 'getPair',
            args: [srcToken.address, dstToken.address],
            abi: FactoryContractABI
        })
        let token0 = zeroAddress
        if (pool !== zeroAddress) {
            token0 = await client.readContract({
                address: pool,
                abi: PoolContractABI,
                functionName: 'token0'
            })
        }
        this.pools.set(id1, [pool, token0])
        this.pools.set(id2, [pool, token0])
        return [pool, token0]
    }

    private async getReserves(chainId: ChainId, pool: Address) {
        const client = getViemDefaultClient(chainId)
        return await client.readContract({
            address: pool,
            abi: PoolContractABI,
            functionName: 'getReserves'
        })
    }

}
