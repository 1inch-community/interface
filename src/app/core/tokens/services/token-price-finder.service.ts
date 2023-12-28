import {Inject, Injectable} from "@angular/core";
import {ChainId} from "@1inch/v3/core/wallet";
import {Token, TokensDb} from "@1inch/v3/core/tokens";
import {TokenPairFinderSource} from "./token-pair-finder-sources/token-pair-finder-source.interface";
import {
    TokenPairFinderSourceInjectionToken
} from "./token-pair-finder-sources/token-pair-finder-source.injection-token";
import {BigMath} from "@1inch/v3/core/shared";
import {isNativeTokenContract} from "../../wallet/utils/is-native-token";
import {wrapperNativeTokenMap} from "../wrapper-native-token-map";
import {BehaviorSubject, Observable, switchMap} from "rxjs";
import {blockStream} from "../../wallet/utils/block-stream";

@Injectable()
export class TokenPriceFinderService {

    private readonly isLoadingState$ = new BehaviorSubject<boolean>(false)

    get isLoading$(): Observable<boolean> {
        return this.isLoadingState$
    }

    constructor(@Inject(TokenPairFinderSourceInjectionToken) private readonly sources: TokenPairFinderSource[],
                private readonly tokenDB: TokensDb) {
    }

    async getDstTokenAmount(chainId: ChainId, srcToken: Token, dstToken: Token, srcTokenAmount: bigint): Promise<bigint | null> {
        const rate = await this.getRate(chainId, srcToken,dstToken)
        if (rate === null) {
            return null
        }
        return BigMath.dev(srcTokenAmount, rate, srcToken.decimals, dstToken.decimals)
    }

    async getRate(chainId: ChainId, srcToken: Token, dstToken: Token): Promise<bigint | null> {
        let _srcToken = srcToken
        let _dstToken = dstToken
        if (isNativeTokenContract(srcToken.address)) {
            const wToken = await this.tokenDB.findByAddress(chainId, wrapperNativeTokenMap[chainId])
            if (!wToken) return null
            _srcToken = wToken
        }
        if (isNativeTokenContract(dstToken.address)) {
            const wToken = await this.tokenDB.findByAddress(chainId, wrapperNativeTokenMap[chainId])
            if (!wToken) return null
            _dstToken = wToken
        }
        this.isLoadingState$.next(true)
        const sources = this.sources.filter(source => source.isSupportedChain(chainId))
        const rateList: bigint[] = await Promise.all(sources.map(source => source.getRate(chainId, _srcToken, _dstToken)))
            .then(results => results.filter(v => v !== null) as bigint[])
        const avrRate = BigMath.avr(rateList, dstToken.decimals)
        this.isLoadingState$.next(false)
        return avrRate
    }

    listenRate(chainId: ChainId, srcToken: Token, dstToken: Token): Observable<bigint | null> {
        return blockStream(chainId).pipe(
            switchMap(() => this.getRate(chainId, srcToken, dstToken))
        )
    }


}
