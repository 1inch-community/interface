import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@lit-labs/virtualizer'
import '../token-list-item'
import '@one-inch-community/ui-components/icon'
import { tokenListStyle } from './token-list.style';
import { consume } from '@lit/context';
import { ChainId, ISelectTokenContext } from '@one-inch-community/models';
import { selectTokenContext } from '../../context';
import { combineLatest, defer, map, startWith } from 'rxjs';
import { observe } from '@one-inch-community/ui-components/lit';
import { scrollbarStyle } from '@one-inch-community/ui-components/theme';
import { Address } from 'viem';
import { ifDefined } from 'lit/directives/if-defined.js';


@customElement(TokenListElement.tagName)
export class TokenListElement extends LitElement {
  static tagName = 'inch-token-list' as const

  static override styles = [
    tokenListStyle,
    scrollbarStyle
  ]

  @consume({ context: selectTokenContext })
  context?: ISelectTokenContext

  private view$ = defer(() => combineLatest([
    this.getTokenAddressList(),
    this.getChainId(),
    this.getConnectedWalletAddress(),
  ])).pipe(
    map(([ tokenAddresses, chainId, walletAddress ]) => this.getTokenListView(tokenAddresses, chainId, walletAddress ?? undefined)),
    startWith(this.getLoaderView()),
  )

  protected override render(): TemplateResult {
    return html`${observe(this.view$)}`
  }

  private getTokenAddressList() {
    if (!this.context) throw new Error('')
    return this.context.tokenAddressList$
  }

  private getChainId() {
    if (!this.context) throw new Error('')
    return this.context.chainId$
  }

  private getConnectedWalletAddress() {
    if (!this.context) throw new Error('')
    return this.context.connectedWalletAddress$
  }

  private getLoaderView() {
    return html`
      <div class="loader-container">
        <inch-icon width="100px" height="80px" icon="unicornRun"></inch-icon>
      </div>
    `
  }


  private getTokenListView(tokenAddresses: Address[], chainId: ChainId, walletAddress?: Address): TemplateResult {
    const offsetHeight = this.offsetHeight
    return html`
      <lit-virtualizer
        scroller
        style="height: ${offsetHeight - 7}px;"
        .items=${tokenAddresses}
        .renderItem=${(address: Address) => html`<inch-token-list-item
          tokenAddress="${address}"
          walletAddress="${ifDefined(walletAddress)}"
          chainId="${chainId}"
        ></inch-token-list-item>`}
      ></lit-virtualizer>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-token-list': TokenListElement
  }
}