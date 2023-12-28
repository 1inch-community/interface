import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ChainId, getViemDefaultClient, WalletConnectionHandler, WalletDataService} from "@1inch/v3/core/wallet";
import {Token} from "@1inch/v3/core/tokens";
import {firstValueFrom} from "rxjs";
import {environment} from "@1inch/v3/env";
import {isNativeTokenContract} from "../../wallet/utils/is-native-token";
import {wrapperNativeTokenMap} from "../../tokens/wrapper-native-token-map";
import {NetworkEnum} from "@1inch/fusion-sdk/constants";
import {PresetEnum} from "@1inch/fusion-sdk/api";
import type {BlockchainProviderConnector} from "@1inch/fusion-sdk/connector";
import {EIP712TypedData} from "@1inch/fusion-sdk/limit-order";
import {isAddress, isHex, WalletClient} from "viem";
import {HttpProviderConnector} from "@1inch/fusion-sdk/connector";
import {FusionSDK} from "@1inch/fusion-sdk";

interface QuoterResponseDTO {
  toTokenAmount: string
}

function isSupportedFusionChainId(chainId: number): chainId is NetworkEnum {
  return !!NetworkEnum[chainId]
}

@Injectable({
  providedIn: "root"
})
export class FusionSwapAdapter {

  constructor(private readonly http: HttpClient,
              private readonly handler: WalletConnectionHandler,
              private readonly walletData: WalletDataService) {
    import('@1inch/fusion-sdk')
  }

  async getDstTokenAmount(srcToken: Token, dstToken: Token, srcTokenAmount: bigint): Promise<bigint> {
    const response = await this.getFusionQuote(srcToken, dstToken, srcTokenAmount)
    return BigInt(response?.toTokenAmount ?? '0')
  }

  async swap(
    chainId: ChainId,
    srcToken: Token,
    dstToken: Token,
    amount: bigint
  ) {
    if (!isSupportedFusionChainId(chainId)) {
      throw new Error(`Chain id ${chainId} not support fusion swap`)
    }
    const wallet = await this.walletData.getCurrentAddress()
    if (!wallet || !this.handler.client) {
      throw new Error('Wallet not connected')
    }
    const sdk = new FusionSDK({
      url: environment.devPortalHost + '/fusion',
      network: chainId,
      blockchainProvider: wrapClient(chainId, this.handler.client),
      httpProvider: wrapHttp(this.http)
    });
    const order = await sdk.createOrder({
      fromTokenAddress: srcToken.address,
      toTokenAddress: dstToken.address,
      amount: amount.toString(),
      walletAddress: wallet,
      preset: PresetEnum.fast,
    })
    const orderInfo = await sdk.submitOrder(order.order, order.quoteId)
  }

  private async getFusionQuote(srcToken: Token, dstToken: Token, srcTokenAmount: bigint): Promise<QuoterResponseDTO | null> {
    let _srcTokenAddress = srcToken.address
    if (isNativeTokenContract(srcToken.address)) {
      const chainId = await this.walletData.getChainId()
      _srcTokenAddress = wrapperNativeTokenMap[chainId]
    }
    const chainId = await this.walletData.getChainId()
    const walletAddress = await this.walletData.getCurrentAddress()
    if (!walletAddress) {
      throw new Error(`wallet not connected`)
    }
    const url = `${environment.devPortalHost}/fusion/quoter/v1.1/${chainId}/quote/receive`
    const params = new HttpParams()
      .set('fromTokenAddress', _srcTokenAddress)
      .set('toTokenAddress', dstToken.address)
      .set('amount', srcTokenAmount.toString())
      .set('walletAddress', walletAddress)
      .set('enableEstimate', false)
      .set('isLedgerLive', false)
    const stream = this.http.get<QuoterResponseDTO>(url, {params})
    return await firstValueFrom(stream) as any
  }
}

function wrapClient(chainId: ChainId, walletClient: WalletClient): BlockchainProviderConnector {
  const publicClient = getViemDefaultClient(chainId)
  return {
    signTypedData(walletAddress: string, typedData: EIP712TypedData): Promise<string> {
      if (!isAddress(walletAddress)) {
        throw new Error(`SignTypedDataError ${walletAddress} not address`)
      }
      return walletClient.signTypedData({
        account: walletAddress,
        ...typedData
      })
    },
    async ethCall(contractAddress: string, callData: string): Promise<string> {
      if (!isAddress(contractAddress)) {
        throw new Error(`EthCall ${contractAddress} not address`)
      }
      if (!isHex(callData)) {
        throw new Error(`EthCall ${callData} not hex`)
      }
      const res = await publicClient.call({
        account: contractAddress,
        data: callData
      })
      return res.data as string
    }
  }
}

function wrapHttp(http: HttpClient): HttpProviderConnector {
  return {
    get<T>(url: string): Promise<T> {
      return firstValueFrom(http.get<T>(url))
    },
    post<T>(url: string, data: unknown): Promise<T> {
      return firstValueFrom(http.post<T>(url, data))
    }
  }
}
