import {ChainId} from "@1inch/v3/core/wallet";
import {Token} from "@1inch/v3/core/tokens";

export interface TokenPairFinderSource {
    readonly name: string
    isSupportedChain(chainId: ChainId): boolean
    getRate(chainId: ChainId, srcToken: Token, dstToken: Token): Promise<bigint | null>
}
