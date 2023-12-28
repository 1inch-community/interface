import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostListener,
  inject, TemplateRef, ViewChild
} from '@angular/core';
import {ButtonComponent, ModalRef, ModalService, PlatformService} from "../../../shared";
import {ChainId, WalletDataService} from "@1inch/v3/core/wallet";
import {map, shareReplay, timer} from "rxjs";
import {AsyncPipe, NgClass, NgForOf, NgIf, NgOptimizedImage, NgTemplateOutlet} from "@angular/common";
import {NgLet} from "../../../shared/directives/ng-let.directive";
import {MAT_RIPPLE_GLOBAL_OPTIONS, MatRippleModule, RippleGlobalOptions} from "@angular/material/core";
import {CssVar} from "../../../shared/directives/css-var.directive";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Router} from "@angular/router";
import {RouteHelperService} from "@1inch/v3/core/shared";

type ChainView = {
  name: string
  iconName: string,
  l2Chain: boolean,
  color: string,
  index: number
}

const chainViewRecord: Record<ChainId, ChainView> = {
  [ChainId.ethereumMainnet]: {
    name: 'Ethereum',
    iconName: 'ethereum',
    l2Chain: false,
    color: 'linear-gradient(73.28deg, #495bfc 6.51%, #114188 88.45%)',
    index: 1
  },
  [ChainId.arbitrumMainnet]: {
    name: 'Arbitrum',
    iconName: 'arbitrum',
    l2Chain: true,
    color: 'linear-gradient(86.38deg, #28a0f0 3.92%, #0678c4 99.17%)',
    index: 2
  },
  [ChainId.optimismMainnet]: {
    name: 'Optimism',
    iconName: 'optimism',
    l2Chain: true,
    color: 'linear-gradient(73.28deg, #ff0420 6.51%, #c10a1f 88.45%)',
    index: 3
  },
  [ChainId.zkSyncEraMainnet]: {
    name: 'zkSyncEra',
    iconName: 'zksync-era',
    l2Chain: true,
    color: 'linear-gradient(73.28deg, #3377ff 4.76%, #004eeb 97.18%)',
    index: 4
  },
  [ChainId.binanceMainnet]: {
    name: 'BNB Chain',
    iconName: 'bsc',
    l2Chain: false,
    color: 'linear-gradient(90deg, #F0B90B 6.51%, rgb(99 70 0) 88.45%)',
    index: 5
  },
  [ChainId.polygonMainnet]: {
    name: 'Polygon',
    iconName: 'polygon',
    l2Chain: false,
    color: 'linear-gradient(73.28deg, #8247e5 6.51%, #6027c0 88.45%)',
    index: 6
  },
  [ChainId.gnosisMainnet]: {
    name: 'Gnosis',
    iconName: 'gnosis',
    l2Chain: false,
    color: 'linear-gradient(73.28deg, #06a77f 6.51%, #04795c 88.45%)',
    index: 7
  },
  [ChainId.avalancheMainnet]: {
    name: 'Avalanche',
    iconName: 'avalanche',
    l2Chain: false,
    color: 'linear-gradient(73.28deg, #f54942 6.51%, #b42d28 88.45%)',
    index: 8
  },
  [ChainId.fantomMainnet]: {
    name: 'Fantom',
    iconName: 'fantom',
    l2Chain: false,
    color: 'linear-gradient(73.28deg, #0915ed 6.51%, #326bf6 88.45%)',
    index: 9
  },
  [ChainId.klaytnMainnet]: {
    name: 'Klaytn',
    iconName: 'klaytn',
    l2Chain: false,
    color: 'linear-gradient(73.28deg, #910202 6.51%, #ff8c00 88.45%)',
    index: 10
  },
  [ChainId.auroraMainnet]: {
    name: 'Aurora',
    iconName: 'aurora',
    l2Chain: false,
    color: 'linear-gradient(73.28deg, #aeae00 6.51%, #1c781b 88.45%)',
    index: 11
  }
}

const globalRippleConfig: RippleGlobalOptions = {
  animation: {
    enterDuration: 300,
    exitDuration: 200
  }
};

@Component({
  selector: 'inch-chain-selector',
  standalone: true,
  imports: [
    ButtonComponent,
    AsyncPipe,
    NgLet,
    NgIf,
    NgForOf,
    NgOptimizedImage,
    MatRippleModule,
    NgClass,
    CssVar,
    NgTemplateOutlet
  ],
  templateUrl: './chain-selector.component.html',
  styleUrl: './chain-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig}
  ]
})
export class ChainSelectorComponent {

  @ViewChild('chainSelector') chainSelectorRef!: TemplateRef<HTMLElement>

  protected chainIdList = Object.entries(chainViewRecord)
    .sort((v1, v2) => v1[1].index - v2[1].index)
    .map(([ id ]) => id)
  protected chainViewRecord: any = chainViewRecord
  protected walletData = inject(WalletDataService)
  protected router = inject(Router)
  protected modal = inject(ModalService)
  protected platformService = inject(PlatformService)
  protected cd = inject(ChangeDetectorRef)
  protected destroyRef = inject(DestroyRef)
  protected routeHelperService = inject(RouteHelperService)
  protected chainId$ = this.walletData.chainId$.pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  )
  protected chainIdView$ = this.chainId$.pipe(
    map(id => chainViewRecord[id])
  )
  protected isOpen = false
  protected modalRef: ModalRef | null = null

  @HostListener('document:click')
  onClose() {
    this.isOpen = false
  }

  onSwitch(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (this.platformService.isMobileView) {
      this.modalRef = this.modal.open(this.chainSelectorRef, 'Select network')
      return
    }
    this.isOpen = !this.isOpen
  }

  async onSelect(chainId: ChainId, event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    timer(200).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.isOpen = false
      this.modalRef?.close()
      this.cd.markForCheck()
    })
    await this.routeHelperService.updatePathAndRedirect({ chainId })
  }

}
