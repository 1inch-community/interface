import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './swap-form.element'
import { connectWalletController } from '../../controllers/connect-wallet-controller';
import { TokenController } from '@one-inch-community/sdk';
import { IToken } from '@one-inch-community/models';
import { distinctUntilChanged, finalize, tap } from 'rxjs';
import { Router } from '@vaadin/router';
import { subscribe } from '@one-inch-community/ui-components/lit';

@customElement(SwapFormPageElement.tagName)
export class SwapFormPageElement extends LitElement {
  static tagName = 'inch-swap-form-page' as const;

  @property({ type: Number, attribute: false }) chainId?: number
  @property({ type: String, attribute: false }) sourceToken?: string
  @property({ type: String, attribute: false }) destinationToken?: string

  @state() private srcToken: IToken | null = null

  @state() private dstToken: IToken | null = null

  private get parsedChainId(): number {
    return Number(this.chainId)
  }

  connectedCallback() {
    super.connectedCallback();
    debugger
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    debugger
  }

  protected async updated(changedProperties: PropertyValues) {
    let isDirty = false
    if (changedProperties.has('chainId') && this.chainId) {
      await connectWalletController.changeChain(this.parsedChainId)
      isDirty = true
    }
    if (this.hasChangeSourceToken(changedProperties)) {
      this.srcToken = await TokenController.getTokenBySymbol(this.parsedChainId, this.sourceToken!).then(records => records[0])
      console.log('srcToken', this.srcToken)
      isDirty = true
    }
    if (this.hasChangeDestinationToken(changedProperties)) {
      this.dstToken = await TokenController.getTokenBySymbol(this.parsedChainId, this.destinationToken!).then(records => records[0])
      isDirty = true
    }
    if (isDirty) {
      this.requestUpdate()
    }
  }

  protected async firstUpdated() {
    let isDirty = false
    if (this.chainId) {
      await connectWalletController.changeChain(this.parsedChainId)
      isDirty = true
    }
    if (this.sourceToken && this.chainId) {
      this.srcToken = await TokenController.getTokenBySymbol(this.parsedChainId, this.sourceToken).then(records => records[0])
      console.log('F srcToken', this.srcToken)
      isDirty = true
    }
    if (this.destinationToken && this.chainId) {
      this.dstToken = await TokenController.getTokenBySymbol(this.parsedChainId, this.destinationToken).then(records => records[0])
      isDirty = true
    }
    if (isDirty) {
      this.requestUpdate()
    }
    subscribe(this, [
      connectWalletController.data.chainId$.pipe(
        distinctUntilChanged(),
        tap((chainId) => {
          if (this.parsedChainId === chainId) return
          debugger
          Router.go([
            chainId,
            'swap',
            this.sourceToken,
            this.destinationToken
          ].filter(Boolean).join('/'))
        }),
        finalize(() => { debugger })
      )
    ], { requestUpdate: false })
  }

  private hasChangeSourceToken(changedProperties: PropertyValues) {
    if (changedProperties.has('sourceToken') && this.sourceToken && this.chainId && this.sourceToken !== this.srcToken?.symbol) {
      return true
    }
    if (changedProperties.has('chainId') && this.sourceToken && this.chainId) {
      return true
    }
    return false
  }

  private hasChangeDestinationToken(changedProperties: PropertyValues) {
    if (changedProperties.has('destinationToken') && this.destinationToken && this.chainId && this.destinationToken !== this.dstToken?.symbol) {
      return true
    }
    if (changedProperties.has('chainId') && this.destinationToken && this.chainId) {
      return true
    }
    return false
  }

  protected render() {
    return html`
      <inch-swap-form-view
        chainId="${this.chainId}"
        .srcToken="${this.srcToken}"
        .dstToken="${this.dstToken}"
      ></inch-swap-form-view>
    `
  }
}