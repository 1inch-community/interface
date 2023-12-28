import {Injectable} from "@angular/core";
import {
  auditTime,
  BehaviorSubject,
  catchError,
  combineLatest,
  defer,
  distinctUntilChanged,
  firstValueFrom,
  map,
  merge,
  Observable,
  shareReplay,
  startWith,
  switchMap,
  tap,
  timer,
} from "rxjs";
import {ChainId, WalletDataService} from "@1inch/v3/core/wallet";
import {Token, TokenPriceFinderService, TokensDb} from "@1inch/v3/core/tokens";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {LocalStorage} from "ngx-webstorage";
import {liveQuery} from "dexie";
import {RouteHelperService} from "@1inch/v3/core/shared";
import {formatUnits, parseUnits} from "viem";
import {HttpErrorResponse} from "@angular/common/http";
import {FusionSwapAdapter} from "@1inch/v3/core/swap";
import {blockStream} from "../../../core/wallet/utils/block-stream";

type TokenType = 'srcToken' | 'dstToken'

@Injectable()
export class SwapFormDataService {

  @LocalStorage('swap:srcTokenAmount', '')
  private srcTokenAmount!: string

  private lastBackgroundUpdateTimestamp = Date.now()

  private readonly reverseFormIsProgress$$  = new BehaviorSubject(false)

  private readonly isLoading$$ = new BehaviorSubject<boolean>(false)
  private readonly isBackgroundLoading$$ = new BehaviorSubject<boolean>(false)

  private readonly isLowLiquidity$$ = new BehaviorSubject<boolean>(false)

  private readonly paramsMap$ = this.routeHelperService.params$.pipe(
    shareReplay({bufferSize: 1, refCount: true})
  )
  readonly chainId$: Observable<ChainId> = this.paramsMap$.pipe(
    map(paramMap => Number(paramMap['chainId'] ?? ChainId.ethereumMainnet)),
    distinctUntilChanged()
  )
  readonly srcTokenSymbol$: Observable<string> = this.paramsMap$.pipe(
    map(paramMap => paramMap['srcToken']),
    distinctUntilChanged()
  )
  readonly dstTokenSymbol$: Observable<string | null> = this.paramsMap$.pipe(
    map(paramMap => paramMap['dstToken']),
    distinctUntilChanged()
  )
  readonly srcToken$: Observable<Token | null> = combineLatest([this.chainId$, this.srcTokenSymbol$]).pipe(
    switchMap(([chainId, symbol]) => liveQuery(() => this.tokenDb.findBySymbol(chainId, symbol))),
  )
  readonly dstToken$: Observable<Token | null> = combineLatest([this.chainId$, this.dstTokenSymbol$]).pipe(
    switchMap(([chainId, symbol]) => {
      if (!symbol) return [null]
      return liveQuery(() => this.tokenDb.findBySymbol(chainId, symbol))
    }),
    shareReplay({bufferSize: 1, refCount: true})
  )
  readonly srcTokenAmountRaw$ = new BehaviorSubject<string>(this.srcTokenAmount)
  readonly dstTokenAmountRaw$: Observable<string> = combineLatest([
    this.chainId$.pipe(distinctUntilChanged()),
    this.srcTokenAmountRaw$.pipe(distinctUntilChanged()),
    this.walletData.isConnected$.pipe(distinctUntilChanged()),
    this.srcToken$,
    this.dstToken$,
    this.chainId$.pipe(
      distinctUntilChanged(),
      switchMap(chainId => blockStream(chainId).pipe(
        auditTime(10000),
        map(() => Date.now()),
        startWith(Date.now())
      ))
    ),
  ]).pipe(
    switchMap((data) => {
      const [
        chainId,
        amountStr,
        isConnectedWallet,
        srcToken,
        dstToken,
        backgroundUpdateTimestamp
      ] = data
      if (!srcToken || !dstToken || !amountStr.length) {
        return ['']
      }
      this.isBackgroundLoading$$.next(this.lastBackgroundUpdateTimestamp !== backgroundUpdateTimestamp)
      this.lastBackgroundUpdateTimestamp = backgroundUpdateTimestamp
      this.isLoading$$.next(true)
      const amount = parseUnits(amountStr, srcToken.decimals)
      if (!isConnectedWallet) {
        return this.loadPriceFromUniswapPools(chainId, srcToken, dstToken, amount)
      }
      this.isLowLiquidity$$.next(false)
      return defer(() => this.fusionAdapter.getDstTokenAmount(srcToken, dstToken, amount)).pipe(
        map(amount => formatUnits(amount, dstToken.decimals)),
        catchError((error: HttpErrorResponse | Error) => {
          if (error instanceof HttpErrorResponse && error.status === 400 && error?.error?.description === "insufficient amount") {
            this.isLowLiquidity$$.next(true)
          }
          return this.loadPriceFromUniswapPools(chainId, srcToken, dstToken, amount)
        })
      )
    }),
    tap(() => {
      this.isLoading$$.next(false)
    }),
    shareReplay({bufferSize: 1, refCount: true})
  )

  readonly isLowLiquidity$: Observable<Boolean> = this.isLowLiquidity$$

  readonly isLoading$: Observable<boolean> = combineLatest([
    this.tokenPriceFinder.isLoading$,
    this.isLoading$$
  ]).pipe(
    map(stats => stats.some(s => s)),
    distinctUntilChanged()
  )

  readonly isBackgroundLoading$ = this.isBackgroundLoading$$.pipe(
    distinctUntilChanged()
  )

  readonly isLoadingView$ = this.isLoading$.pipe(
    switchMap(state => state ? [state] : timer(500).pipe(map(() => state))),
    startWith(false),
    distinctUntilChanged()
  )

  constructor(private readonly tokenDb: TokensDb,
              private readonly walletData: WalletDataService,
              private readonly routeHelperService: RouteHelperService,
              private readonly tokenPriceFinder: TokenPriceFinderService,
              private readonly fusionAdapter: FusionSwapAdapter) {
    this.srcToken$.pipe(takeUntilDestroyed()).subscribe()
    this.dstToken$.pipe(takeUntilDestroyed()).subscribe()
  }

  getTokenSymbolByType(type: TokenType): Observable<string | null> {
    switch (type) {
      case "srcToken":
        return this.srcTokenSymbol$
      case "dstToken":
        return this.dstTokenSymbol$
      default:
        throw new Error(`type token ${type} not supported`)
    }
  }

  getTokenByType(type: TokenType): Observable<Token | null> {
    switch (type) {
      case "srcToken":
        return this.srcToken$
      case "dstToken":
        return this.dstToken$
      default:
        throw new Error(`type token ${type} not supported`)
    }
  }

  getTokenAmountStream(type: TokenType): Observable<string> {
    switch (type) {
      case "srcToken":
        return this.srcTokenAmountRaw$
      case "dstToken":
        return this.dstTokenAmountRaw$
      default:
        throw new Error(`type token ${type} not supported`)
    }
  }

  setSrcTokenAmount(amount: string) {
    this.srcTokenAmount = amount
    this.srcTokenAmountRaw$.next(amount)
  }

  async reversePair() {
    this.reverseFormIsProgress$$.next(true)
    const params = this.routeHelperService.getParams()
    const chainId = params['chainId']
    const srcToken = params['srcToken']
    const dstToken = params['dstToken']
    const amount = await firstValueFrom(this.dstTokenAmountRaw$)
    this.setSrcTokenAmount(amount)
    await this.routeHelperService.updatePathAndRedirect({
      chainId: Number(chainId) ?? undefined,
      srcToken: dstToken ?? undefined,
      dstToken: srcToken ?? undefined,
    })
    this.reverseFormIsProgress$$.next(false)
  }

  private loadPriceFromUniswapPools(chainId: ChainId, srcToken: Token, dstToken: Token, amount: bigint) {
    return defer(() => this.tokenPriceFinder.getDstTokenAmount(chainId, srcToken, dstToken, amount)).pipe(
      map(amount => {
        if (!amount) return '0'
        return formatUnits(amount, dstToken.decimals)
      }),
      catchError(() => ['0'])
    )
  }
}
