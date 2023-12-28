import {ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit} from '@angular/core';
import {TuiInputNumberModule} from '@taiga-ui/kit';
import {tuiNumberFormatProvider} from '@taiga-ui/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {
  combineLatest,
  debounceTime,
  defer,
  distinctUntilChanged,
  filter, firstValueFrom,
  map,
  Observable,
  shareReplay,
  startWith,
  switchMap,
  tap,
  timer
} from "rxjs";
import {Token, TokenBalancesService} from "@1inch/v3/core/tokens";
import {ButtonComponent, ToFixedPipe, TokenIconComponent} from "@1inch/v3/view/shared";
import {SwapFormDataService} from "../../services/swap-form-data.service";
import {AsyncPipe, NgIf, NgOptimizedImage, NgSwitch, NgSwitchCase} from "@angular/common";
import {LinkComponent} from "../../../shared/components/link/link.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ChainId, WalletDataService} from "@1inch/v3/core/wallet";
import {Address, formatUnits} from "viem";
import {buildEtherscanAddressLink} from "../../../../core/wallet/utils/scan-link";
import {BigMath, RouteHelperService} from "@1inch/v3/core/shared";
import {LocalStorageService} from "ngx-webstorage";

@Component({
  selector: 'inch-swap-input',
  standalone: true,
  imports: [
    TuiInputNumberModule,
    ReactiveFormsModule,
    NgIf,
    NgOptimizedImage,
    AsyncPipe,
    ButtonComponent,
    LinkComponent,
    NgSwitch,
    NgSwitchCase,
    ToFixedPipe,
    TokenIconComponent
  ],
  templateUrl: './swap-input.component.html',
  styleUrl: './swap-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiNumberFormatProvider({
      decimalSeparator: '.',
      thousandSeparator: ' ',
      zeroPadding: false
    })
  ]
})
export class SwapInputComponent implements OnInit {

  @Input({required: true}) tokenType!: 'srcToken' | 'dstToken'

  protected chainId$: Observable<ChainId> = this.swapData.chainId$
  protected token$: Observable<Token | null> = defer(() => this.swapData.getTokenByType(this.tokenType).pipe(
    tap(balance => this.ls.store(`inch-swap-input:token:${this.tokenType}`, balance)),
    startWith(this.ls.retrieve(`inch-swap-input:token:${this.tokenType}`)),
    shareReplay({bufferSize: 1, refCount: true})
  ))
  protected symbol$: Observable<string | null> = defer(() => this.swapData.getTokenSymbolByType(this.tokenType))
  protected name$: Observable<string> = defer(() => this.token$.pipe(
    map(token => token?.name ?? ''),
  ))
  protected scanLink$: Observable<string | null> = combineLatest([
    this.chainId$,
    this.token$
  ]).pipe(
    map(([chainId, token]) => {
      if (!token) return null
      return buildEtherscanAddressLink(chainId, token.address)
    })
  )
  protected balance$: Observable<string | null> = defer(() => combineLatest([
    this.token$,
    this.chainId$,
    this.walletData.currentAddress$,
  ]).pipe(
    switchMap(([token, chainId, walletAddress]) => {
      if (!walletAddress) return [null]
      return this.tokenBalancesService.listenTokenBalance(chainId, token, walletAddress).pipe(
        map(balance => formatUnits(balance, token?.decimals ?? 0)),
      )
    }),
    tap(balance => this.ls.store(`inch-swap-input:balance:${this.tokenType}`, balance)),
    startWith(this.ls.retrieve(`inch-swap-input:balance:${this.tokenType}`)),
    shareReplay({bufferSize: 1, refCount: true})
  ))
  private readonly availableTokenBalanceForFusion$ = combineLatest([
    this.chainId$,
    this.token$,
    this.walletData.currentAddress$,
  ]).pipe(
    switchMap(([ chainId, token, wallet ]) =>
      this.tokenBalancesService.listenAvailableTokenBalanceForFusion(chainId, token, wallet).pipe(
        map(balance => formatUnits(balance, token?.decimals ?? 0)),
      )),
    shareReplay({ bufferSize: 1, refCount: true })
  )
  protected readonly isMax$ = defer(() => combineLatest([
    this.availableTokenBalanceForFusion$,
    this.formControl.valueChanges.pipe(startWith(this.formControl.value))
  ])).pipe(
    map(([availableBalance, value]) => availableBalance === value)
  )
  protected readonly maxButtonColor$ = this.isMax$.pipe(
    map(state => state ? 'default' : 'blue')
  )
  protected selectCurrencyButtonColor$: Observable<'blue' | 'flat'> = this.symbol$.pipe(
    map(symbol => (symbol ? 'flat' : 'blue') as any),
  )

  protected readonly formControl = new FormControl<string>('0')

  protected isFocus = false

  protected readonly isLoading$ = this.swapData.isLoadingView$.pipe(
    filter(() => this.tokenType === "dstToken"),
    startWith(false)
  )

  constructor(private readonly swapData: SwapFormDataService,
              private readonly walletData: WalletDataService,
              private readonly routeHelperService: RouteHelperService,
              private readonly tokenBalancesService: TokenBalancesService,
              private readonly ls: LocalStorageService,
              private readonly destroyRef: DestroyRef) {
  }

  ngOnInit(): void {
    this.swapData.getTokenAmountStream(this.tokenType).pipe(
      distinctUntilChanged(),
      filter(amount => !BigMath.eq(this.formControl.value ?? '0', amount, 6)),
      tap(amount => this.formControl.setValue(amount)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
    if (this.tokenType === 'dstToken') {
      this.formControl.disable()
      return
    }
    this.formControl.valueChanges.pipe(
      filter(() => this.isFocus),
      startWith(this.formControl.value),
      debounceTime(300),
      map(amount => `${amount ?? ''}`),
      distinctUntilChanged((v1, v2) => BigMath.eq(v1, v2, 6)),
      tap(amount => this.swapData.setSrcTokenAmount(amount)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }

  protected onChangeFocus(state: boolean) {
    this.isFocus = state
  }

  protected async onOpenSelectToken() {
    await this.routeHelperService.openSelectToken(this.tokenType)
  }

  protected async onSetMax() {
    const balance = await firstValueFrom(this.availableTokenBalanceForFusion$)
    this.formControl.setValue(balance)
    this.swapData.setSrcTokenAmount(balance)
  }

}
