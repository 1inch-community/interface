import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage, SlicePipe} from '@angular/common';
import {CardComponent} from "../card/card.component";
import {distinctUntilChanged, map, startWith, timer} from "rxjs";
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {SelectTokenByIdPipe} from "./select-token-by-id.pipe";
import {WalletDataService} from "@1inch/v3/core/wallet";
import {TuiGroupModule} from "@taiga-ui/core";
import {ButtonComponent, NgLet, ToFixedPipe, TokenIconComponent} from "@1inch/v3/view/shared";
import {SelectTokenService} from "../../services/select-token.service";
import {RouteHelperService} from "@1inch/v3/core/shared";
import {TokenBalancesService} from "@1inch/v3/core/tokens";
import {SelectTokenViewState} from "./select-token-view.state";

@Component({
  selector: 'inch-select-token',
  standalone: true,
  imports: [
    CardComponent,
    NgForOf,
    AsyncPipe,
    CdkVirtualScrollViewport,
    CdkVirtualForOf,
    CdkFixedSizeVirtualScroll,
    NgIf,
    SelectTokenByIdPipe,
    NgOptimizedImage,
    SlicePipe,
    TuiGroupModule,
    NgLet,
    ToFixedPipe,
    ButtonComponent,
    TokenIconComponent,
  ],
  templateUrl: './select-token.component.html',
  styleUrl: './select-token.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SelectTokenViewState
  ]
})
export class SelectTokenComponent implements OnDestroy {

  protected readonly tokensIdList$ = this.selectTokenService.tokensIdList$
  protected readonly wallet$ = this.walletDataService.currentAddress$.pipe(
    distinctUntilChanged()
  )
  protected readonly loaderStub$ = timer(1000).pipe(
    map(() => false),
    startWith(true)
  )

  constructor(private readonly walletDataService: WalletDataService,
              private readonly selectTokenService: SelectTokenService,
              private readonly tokenBalancesService: TokenBalancesService,
              private readonly routeHelperService: RouteHelperService) {
    this.tokenBalancesService.startUpdateBalances()
  }

  async onSelect(symbol: string) {
    const params = this.routeHelperService.getParams()
    const tokenType = params['tokenType']
    await this.routeHelperService.updatePathAndRedirect({[tokenType]: symbol})
  }

  async onBack() {
    await this.routeHelperService.updatePathAndRedirect({})
  }

  ngOnDestroy(): void {
    this.tokenBalancesService.stopUpdateBalances()
  }
}
