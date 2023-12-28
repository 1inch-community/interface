import {initializedProvider} from "@1inch/v3/core/shared";
import {TokenUpdateHandler} from "./services/token-update.handler";
import {TokenPriceFinderService} from "./services/token-price-finder.service";
import {
    TokenPairFinderSourceInjectionToken
} from "./services/token-pair-finder-sources/token-pair-finder-source.injection-token";
import {UniswapV2} from "./services/token-pair-finder-sources/uniswap-v2";
import {ChainId} from "@1inch/v3/core/wallet";
import {Address} from "viem";

const SushiSwapFactory: Record<number, Address> = {
    [ChainId.ethereumMainnet]: '0xC0AeE478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
    [ChainId.binanceMainnet]: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
    [ChainId.polygonMainnet]: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
    [ChainId.gnosisMainnet]: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
    [ChainId.fantomMainnet]: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
    [ChainId.avalancheMainnet]: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
    [ChainId.arbitrumMainnet]: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
}

const PancakeSwapFactory: Record<number, Address> = {
    [ChainId.ethereumMainnet]: '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362',
    [ChainId.binanceMainnet]: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    [ChainId.arbitrumMainnet]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
}

export function provideTokens() {
    return [
        {
            provide: TokenPairFinderSourceInjectionToken,
            useFactory: () => new UniswapV2(
                'UniswapV2',
                () => '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
                [
                    ChainId.ethereumMainnet,
                    ChainId.binanceMainnet,
                    ChainId.polygonMainnet,
                    ChainId.optimismMainnet,
                    ChainId.arbitrumMainnet,
                    ChainId.avalancheMainnet,
                ]
            ),
            multi: true,
        },
        {
            provide: TokenPairFinderSourceInjectionToken,
            useFactory: () => new UniswapV2(
                'SushiSwapV2',
                (chainId) => SushiSwapFactory[chainId],
                [
                    ChainId.ethereumMainnet,
                    ChainId.binanceMainnet,
                    ChainId.polygonMainnet,
                    ChainId.gnosisMainnet,
                    ChainId.fantomMainnet,
                    ChainId.arbitrumMainnet,
                    ChainId.avalancheMainnet,
                ]
            ),
            multi: true,
        },
        {
            provide: TokenPairFinderSourceInjectionToken,
            useFactory: () => new UniswapV2(
                'PancakeSwapV2',
                (chainId) => PancakeSwapFactory[chainId],
                [
                    ChainId.ethereumMainnet,
                    ChainId.binanceMainnet,
                    ChainId.arbitrumMainnet,
                ]
            ),
            multi: true,
        },
        TokenPriceFinderService,
        initializedProvider([
            TokenUpdateHandler
        ]),
    ]
}
