import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ChainId, IConnectWalletController } from '@one-inch-community/models';
import '@one-inch-community/ui-components/button';
import '@one-inch-community/ui-components/icon';
import { observe, getMobileMatchMediaAndSubscribe } from '@one-inch-community/lit';
import { chainSelectorStyle } from './chain-selector.style';
import { defer, filter, map } from 'rxjs';
import { when } from 'lit/directives/when.js';
import { OverlayController } from '@one-inch-community/ui-components/overlay';
import { isL2Chain } from '@one-inch-community/sdk';

type ChainViewInfo = {
  name: string
  iconName: string
  priority?: number
}

type ChainViewFull = {
  chainId: ChainId
} & ChainViewInfo

const chainViewConfig: Record<ChainId, ChainViewInfo> = {
  [ChainId.eth]: { name: 'Ethereum', iconName: 'eth24' },
  [ChainId.arbitrum]: { name: 'Arbitrum', iconName: 'arbitrum24' },
  [ChainId.op]: { name: 'Optimism', iconName: 'op24' },
  [ChainId.zkSyncEra]: { name: 'zkSync Era', iconName: 'zkSyncEra24' },
  [ChainId.bnb]: { name: 'BNB Smart Chain', iconName: 'bnb24', priority: 1 },
  [ChainId.matic]: { name: 'Polygon', iconName: 'matic24', priority: 1 },
  [ChainId.gnosis]: { name: 'Gnosis', iconName: 'gnosis24' },
  [ChainId.avalanche]: { name: 'Avalanche', iconName: 'avalanche24' },
  [ChainId.fantom]: { name: 'Fantom', iconName: 'fantom24' },
  [ChainId.aurora]: { name: 'Aurora', iconName: 'aurora24' },
  [ChainId.klaytn]: { name: 'Klaytn', iconName: 'klaytn24' }
};

const chainList: ChainViewFull[] = Object.keys(chainViewConfig)
  .map((chainId) => ({ ...(chainViewConfig as any)[chainId], chainId: Number(chainId) }))
  .sort((info1: ChainViewFull, info2: ChainViewFull) => {
    if (info1.chainId == ChainId.eth) return -1;
    if (info2.chainId == ChainId.eth) return 1;
    if (isL2Chain(info1.chainId)) return -1;
    if (isL2Chain(info2.chainId)) return 1;


    return (info2.priority ?? 0) - (info1.priority ?? 0);
  });

@customElement(ChainSelectorElement.tagName)
export class ChainSelectorElement extends LitElement {
  static tagName = 'inch-chain-selector' as const;

  static override styles = chainSelectorStyle;

  @property({ type: Object, attribute: false }) controller?: IConnectWalletController;

  private readonly mobileMedia = getMobileMatchMediaAndSubscribe(this);

  private readonly overlay = new OverlayController('#app-root', this);
  private overlayId: number | null = null

  private readonly chainId$ = defer(() => this.getController().data.chainId$);
  private readonly unsupportedChainId$ = this.chainId$.pipe(
    map(chainId => (!!chainId && !!chainViewConfig[chainId]) ? '' : 'unsupported')
  );
  private readonly chainIdIconName$ = this.chainId$.pipe(
    filter(Boolean),
    map(chainId => {
      if (!chainViewConfig[chainId]) return 'alert24';
      return chainViewConfig[chainId].iconName;
    })
  );
  private readonly chainIdName$ = this.chainId$.pipe(
    filter(Boolean),
    map(chainId => {
      if (!chainViewConfig[chainId]) return 'Unsupported chain';
      return chainViewConfig[chainId].name;
    })
  );

  override connectedCallback() {
    super.connectedCallback();
    import('./elements/chain-selector-list')
  }

  protected override render() {
    return html`
      <inch-button @click="${() => this.onClick()}" size="l" type="primary-gray">
        <inch-icon class="${observe(this.unsupportedChainId$)}" icon="${observe(this.chainIdIconName$)}"></inch-icon>
        ${when(!this.mobileMedia.matches, () => html`<span>${observe(this.chainIdName$)}</span>`)}
        <inch-icon icon="chevronDown16"></inch-icon>
      </inch-button>
    `;
  }

  private async onClick() {
    if (this.overlay.isOpenOverlay(this.overlayId ?? 0)) {
      this.closeOverlay()
      return
    }
    this.overlayId = await this.overlay.open(html`
      <inch-chain-selector-list
        .infoList="${chainList}"
        .controller="${this.controller}"
        activeChainId="${observe(this.chainId$)}"
        @closeCard="${() => this.closeOverlay()}"
      ></inch-chain-selector-list>
    `);
  }

  private closeOverlay() {
    if (!this.overlayId) return
    this.overlay.close(this.overlayId)
    this.overlayId = null
  }

  private getController() {
    if (!this.controller) {
      throw new Error('');
    }
    return this.controller;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-chain-selector': ChainSelectorElement;
  }
}
