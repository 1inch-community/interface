import { html, LitElement } from 'lit';
import { consume } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import '@one-inch-community/ui-components/card'
import "@one-inch-community/ui-components/icon"
import "@one-inch-community/ui-components/button"
import { ApplicationContextToken } from '@one-inch-community/core/application-context';
import { ISwapContext, IApplicationContext } from '@one-inch-community/models';
import { SwapContextToken } from '@one-inch-community/sdk/swap';
import { combineLatest, defer, distinctUntilChanged, map, startWith } from 'rxjs';
import { observe, translate } from '@one-inch-community/core/lit';
import { swapFromStyle } from './swap-from.style';
import './elements'

@customElement(SwapFromElement.tagName)
export class SwapFromElement extends LitElement {
  static tagName = 'inch-swap-form' as const

  static override styles = swapFromStyle

  static lastFusionRenderIsEmptyState = true

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext

  @consume({ context: SwapContextToken, subscribe: true })
  swapContext?: ISwapContext

  private readonly fusionView$ = combineLatest([
    defer(() => this.getWalletController().data.activeAddress$),
    defer(() => this.swapContext!.getTokenByType('source')),
    defer(() => this.swapContext!.getTokenByType('destination'))
  ]).pipe(
    map(([address, sourceToken, destinationToken ]) => !address || !sourceToken || !destinationToken),
    startWith(SwapFromElement.lastFusionRenderIsEmptyState),
    distinctUntilChanged(),
    map((isEmpty) => {
      SwapFromElement.lastFusionRenderIsEmptyState = isEmpty
      if (isEmpty) return html``
      return html`<inch-fusion-swap-info></inch-fusion-swap-info>`
    })
  )

  protected override render() {
    if (!this.swapContext) return
    return html`
      <div class="swap-form-container">
        <inch-card-header headerText="${translate('widgets.swap-form.header.swap')}" headerTextPosition="left">
        </inch-card-header>
        
        <div class="input-container">
          <inch-swap-form-input tokenType="source"></inch-swap-form-input>
          <inch-token-pair-switch></inch-token-pair-switch>
          <inch-swap-form-input disabled tokenType="destination"></inch-swap-form-input>
        </div>
        
        ${observe(this.fusionView$)}
        
        <inch-swap-button></inch-swap-button>
      </div>
    `
  }

  private getWalletController() {
    if (!this.applicationContext.connectWalletController) throw new Error('')
    return this.applicationContext.connectWalletController
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-form': SwapFromElement
  }
}
