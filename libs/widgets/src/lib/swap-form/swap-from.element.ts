import { html, LitElement, PropertyValues } from 'lit';
import { ContextProvider } from '@lit/context';
import { customElement, property } from 'lit/decorators.js';
import '@one-inch-community/ui-components/card'
import "@one-inch-community/ui-components/icon"
import "@one-inch-community/ui-components/button"
import { IConnectWalletController, IToken } from '@one-inch-community/models';
import { SwapContext } from '@one-inch-community/sdk';
import { combineLatest, defer, distinctUntilChanged, map, startWith, tap } from 'rxjs';
import { subscribe } from '@one-inch-community/lit';
import { swapFromStyle } from './swap-from.style';
import { swapContext } from './context';
import './elements'
import { when } from 'lit/directives/when.js';

@customElement(SwapFromElement.tagName)
export class SwapFromElement extends LitElement {
  static tagName = 'inch-swap-form' as const

  static override styles = swapFromStyle

  static lastFusionRenderIsEmptyState = true

  @property({ type: Object, attribute: false }) srcToken: IToken | null = null

  @property({ type: Object, attribute: false }) dstToken: IToken | null = null

  @property({ type: Object, attribute: false }) walletController?: IConnectWalletController

  readonly context = new ContextProvider(this, { context: swapContext })

  private readonly fusionView$ = combineLatest([
    defer(() => this.getWalletController().data.activeAddress$),
    defer(() => this.getContext().getTokenByType('source')),
    defer(() => this.getContext().getTokenByType('destination'))
  ]).pipe(
    map(([address, sourceToken, destinationToken ]) => !address || !sourceToken || !destinationToken),
    startWith(SwapFromElement.lastFusionRenderIsEmptyState),
    distinctUntilChanged(),
    tap((isEmpty) => {
      SwapFromElement.lastFusionRenderIsEmptyState = isEmpty
    })
  )

  override connectedCallback() {
    super.connectedCallback();
    subscribe(this, [
      this.fusionView$
    ])
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.context.value?.destroy()
  }

  protected override updated(changedProperties: PropertyValues) {
    const context = this.getContext()
    if (changedProperties.has('srcToken') || changedProperties.has('dstToken')) {
      context.setPair({
        srcToken: this.srcToken,
        dstToken: this.dstToken,
      })
      this.requestUpdate()
    }
  }

  protected override render() {
    if (!this.context.value) {
      this.getContext()
    }

    return html`
      <div class="swap-form-container">
        <inch-card-header headerText="Swap tokens" headerTextPosition="left">
          <inch-button slot="right-container" type="tertiary-gray" size="m">
            <inch-icon icon="authRefresh36"></inch-icon>
          </inch-button>
        </inch-card-header>
        
        <div class="input-container">
          <inch-swap-form-input tokenType="source"></inch-swap-form-input>
          <inch-token-pair-switch></inch-token-pair-switch>
          <inch-swap-form-input disabled tokenType="destination"></inch-swap-form-input>
        </div>
        
        ${when(!SwapFromElement.lastFusionRenderIsEmptyState, () => html`<inch-fusion-swap-info></inch-fusion-swap-info>`)}
        
        <inch-swap-button></inch-swap-button>
      </div>
    `
  }

  private getFusionInfoView(isEmpty: boolean) {
    if (isEmpty) return html``
    return html`<inch-fusion-swap-info></inch-fusion-swap-info>`
  }

  private getWalletController() {
    if (!this.walletController) throw new Error('')
    return this.walletController
  }

  private getContext() {
    if (!this.context.value) {
      const context = new SwapContext(
        this.getWalletController()
      )
      context.setPair({
        srcToken: this.srcToken,
        dstToken: this.dstToken,
      })
      this.context.setValue(context);
    }
    return this.context.value
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-form': SwapFromElement
  }
}
