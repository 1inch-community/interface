import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../token-list-item'
import '@one-inch-community/ui-components/icon'
import { tokenListStyle } from './token-list.style';
import { consume } from '@lit/context';
import { ChainId, ISelectTokenContext } from '@one-inch-community/models';
import { selectTokenContext } from '../../context';
import { defer, shareReplay, tap } from 'rxjs';
import { observe, subscribe } from '@one-inch-community/lit';
import { scrollbarStyle } from '@one-inch-community/ui-components/theme';
import { Address } from 'viem';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ISceneContext, sceneContext } from '@one-inch-community/ui-components/scene';
import '@one-inch-community/ui-components/scroll';
import '../token-list-stub-item'


@customElement(TokenListElement.tagName)
export class TokenListElement extends LitElement {
  static tagName = 'inch-token-list' as const

  static override styles = [
    tokenListStyle,
    scrollbarStyle
  ]

  @consume({ context: selectTokenContext })
  context?: ISelectTokenContext

  @consume({ context: sceneContext })
  sceneContext?: ISceneContext
  @state() private chainId: ChainId | null = null
  @state() private walletAddress: Address | null = null

  private readonly addressList$ = defer(() => this.getTokenAddressList()).pipe(
    shareReplay({ refCount: true, bufferSize: 1 })
  )

  protected override render() {
    return html`
      <inch-scroll-view-virtualizer-consumer
        .items=${observe(this.addressList$, this.getStubAddresses())}
        .keyFunction="${((address: Address) => [this.chainId, this.walletAddress, address].join(':')) as any}"
        .renderItem=${((address: Address) => html`
            <inch-token-list-item
              tokenAddress="${address}"
              walletAddress="${ifDefined(this.walletAddress ?? undefined)}"
              chainId="${ifDefined(this.chainId ?? undefined)}"
            ></inch-token-list-item>`
        )}
      ></inch-scroll-view-virtualizer-consumer>
    `
  }

  protected override async firstUpdated() {
    subscribe(this, [
      this.getConnectedWalletAddress().pipe(tap(address => this.walletAddress = address)),
      this.getChainId().pipe(tap(chainId => this.chainId = chainId)),
      this.addressList$
    ], { requestUpdate: false })
    subscribe(this, [
      this.getFavoriteTokens(),
    ])
  }

  private getTokenAddressList() {
    if (!this.context) throw new Error('')
    return this.context.tokenAddressList$
  }

  private getChainId() {
    if (!this.context) throw new Error('')
    return this.context.chainId$
  }

  private getFavoriteTokens() {
    if (!this.context) throw new Error('');
    return this.context.favoriteTokens$;
  }

  private getConnectedWalletAddress() {
    if (!this.context) throw new Error('')
    return this.context.connectedWalletAddress$
  }

  private getStubAddresses() {
    return Array.from(Array(30)).map((_, index) => `0x${index.toString(16)}`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-token-list': TokenListElement
  }
}
