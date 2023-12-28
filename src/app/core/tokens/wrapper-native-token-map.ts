import {ChainId} from "@1inch/v3/core/wallet";
import {Address} from "viem";

export const wrapperNativeTokenMap: Record<ChainId, Address> = {
    [ChainId.ethereumMainnet]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    [ChainId.binanceMainnet]: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    [ChainId.polygonMainnet]: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    [ChainId.optimismMainnet]: '0x4200000000000000000000000000000000000006',
    [ChainId.arbitrumMainnet]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    [ChainId.gnosisMainnet]: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
    [ChainId.avalancheMainnet]: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    [ChainId.fantomMainnet]: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    [ChainId.auroraMainnet]: '0xc9bdeed33cd01541e1eed10f90519d2c06fe3feb',
    [ChainId.klaytnMainnet]: '0xe4f05a66ec68b54a58b17c22107b02e0232cc817',
    [ChainId.zkSyncEraMainnet]: '0x',
}
