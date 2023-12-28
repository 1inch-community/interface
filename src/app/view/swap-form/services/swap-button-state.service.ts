import {inject, Injectable} from "@angular/core";
import {combineLatest, filter, map, Observable, shareReplay, startWith, Subject, switchMap, tap} from "rxjs";
import {Contracts} from "@1inch/v3/core/shared";
import {parseUnits} from "viem";
import {isNativeTokenContract, WalletDataService} from "@1inch/v3/core/wallet";
import {SwapFormDataService} from "./swap-form-data.service";
import {TokenAllowanceService, TokenBalancesService} from "@1inch/v3/core/tokens";
import {LocalStorage} from "ngx-webstorage";

export enum SwapButtonState {
  ready = 'ready',
  zeroAmount = 'zeroAmount',
  walletNotConnected = 'walletNotConnected',
  discrepanciesChainId = 'discrepanciesChainId',
  dstTokenNotSelect = 'dstTokenNotSelect',
  updateDstTokenAmount = 'updateDstTokenAmount',
  overflowBalance = 'overflowBalance',
  wrapNativeToken = 'wrapNativeToken',
  needAllowance = 'needAllowance',
  lowLiquidity = 'lowLiquidity',
}

@Injectable()
export class SwapButtonStateService {

  private readonly walletDataService = inject(WalletDataService)
  private readonly swapFormDataService = inject(SwapFormDataService)
  private readonly tokenBalancesService = inject(TokenBalancesService)
  private readonly tokenAllowanceService = inject(TokenAllowanceService)

  @LocalStorage('inch-swap-button:lastSwapButtonState', SwapButtonState.walletNotConnected)
  lastButtonState!: SwapButtonState

  @LocalStorage('inch-swap-button:srcTokenSymbol', '')
  srcTokenSymbol!: string

  private customLoadingState: boolean = false
  private customButtonText: string | null = null

  private readonly update$$ = new Subject<void>()

  private readonly balance$ = combineLatest([
    this.walletDataService.chainId$,
    this.swapFormDataService.srcToken$,
    this.walletDataService.currentAddress$,
  ]).pipe(
    switchMap(([ chainId, token, wallet ]) => this.tokenBalancesService.listenAvailableTokenBalanceForFusion(chainId, token, wallet))
  )

  private readonly allowance$ = combineLatest([
    this.walletDataService.chainId$,
    this.swapFormDataService.srcToken$.pipe(filter(Boolean)),
    this.walletDataService.currentAddress$.pipe(filter(Boolean)),
  ]).pipe(
    switchMap(([ chainId, token, wallet ]) =>
      this.tokenAllowanceService.listenAllowance(chainId, token, wallet, Contracts.OneInchRouterV5)),
    startWith(0n)
  )

  readonly state$: Observable<SwapButtonState> = combineLatest([
    this.walletDataService.isConnected$,
    this.walletDataService.chainId$,
    this.swapFormDataService.srcToken$.pipe(
      filter(Boolean),
      tap(token => this.srcTokenSymbol = token.symbol)
    ),
    this.swapFormDataService.dstToken$,
    this.swapFormDataService.srcTokenAmountRaw$,
    this.swapFormDataService.chainId$,
    this.swapFormDataService.isLoadingView$,
    this.swapFormDataService.isBackgroundLoading$,
    this.balance$,
    this.allowance$,
    this.swapFormDataService.isLowLiquidity$,
    this.update$$.pipe(startWith(void 0))
  ]).pipe(
    map((data) => {
      const [
        isConnected,
        walletChainId,
        srcToken,
        dstToken,
        srcTokenAmountRaw,
        pathChainId,
        isUpdateDstTokenAmount,
        isBackgroundUpdateDstTokenAmount,
        balance,
        allowance,
        isLowLiquidity
      ] = data
      if (!isConnected) return SwapButtonState.walletNotConnected
      if (walletChainId !== pathChainId) return SwapButtonState.discrepanciesChainId
      if (!dstToken) return SwapButtonState.dstTokenNotSelect
      const srcTokenAmount = parseUnits(srcTokenAmountRaw, srcToken.decimals)
      if (srcTokenAmount === 0n) return SwapButtonState.zeroAmount
      if (isUpdateDstTokenAmount && !isBackgroundUpdateDstTokenAmount) return SwapButtonState.updateDstTokenAmount
      if (isLowLiquidity) return SwapButtonState.lowLiquidity
      if (balance < srcTokenAmount) return SwapButtonState.overflowBalance
      if (allowance < srcTokenAmount) return SwapButtonState.needAllowance
      if (isNativeTokenContract(srcToken.address)) return SwapButtonState.wrapNativeToken
      return SwapButtonState.ready
    }),
    tap(state => this.lastButtonState = state),
    startWith(this.lastButtonState),
    shareReplay({ bufferSize: 1, refCount: true })
  )

  setLoadingState(state: boolean) {
    this.customLoadingState = state
    this.update$$.next()
  }

  setButtonText(text: string) {
    this.customButtonText = text
    this.update$$.next()
  }

  resetButtonText() {
    this.customButtonText = null
    this.update$$.next()
  }

  getLoadingState() {
    return this.customLoadingState
  }

  getButtonText() {
    return this.customButtonText
  }

}
