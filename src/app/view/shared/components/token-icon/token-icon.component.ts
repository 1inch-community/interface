import {ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {Token} from "@1inch/v3/core/tokens";
import {getViemChainId} from "@1inch/v3/core/wallet";

const imgSrcList: ((token: Token) => string)[] = [
  (token) => {
    const chain = getViemChainId(token.chainId)
    return `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${chain.name.toLowerCase()}/assets/${token.address.toLowerCase()}/logo.png`
  },
]

@Component({
  selector: 'inch-token-icon',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgOptimizedImage
  ],
  templateUrl: './token-icon.component.html',
  styleUrl: './token-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TokenIconComponent implements OnChanges {

  @Input({ required: true })
  token!: Token

  @HostBinding('style.width.px')
  @HostBinding('style.height.px')
  @Input({ required: true })
  size: number = 24

  protected symbolView: string = ''
  protected index = -1
  protected iconFromToken = true
  protected showImg = true
  protected load = false

  get imgLink() {
    if (this.iconFromToken) {
      return this.token.logoURI
    }
    const factory = imgSrcList[this.index]
    if (!factory) return ''
    return factory(this.token)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('token' in changes) {
      this.index = -1
      this.showImg = true
      this.iconFromToken = true
      this.symbolView = this.token.symbol.slice(0, this.size <= 24 ? 1 : 2)
    }
  }

  protected onError() {
    this.iconFromToken = false
    if (imgSrcList[this.index + 1]) {
      this.index++
    } else {
      this.showImg = false
    }
  }

  protected onLoadStart() {
    this.load = true
  }

  protected onLoadComplete() {
    this.load = false
  }
}
