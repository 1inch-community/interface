import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume, provide } from '@lit/context';
import '@one-inch-community/ui-components/card';
import { selectTokenStyle } from './select-token.style';
import { selectTokenContext } from './context';
import { SelectTokenContext } from './select-token.context';
import './elements/search-token-input'
import './elements/token-list'
import './elements/favorite-tokens'
import { IApplicationContext, ISelectTokenContext, ISwapContext, TokenType } from '@one-inch-community/models';
import { subscribe } from '@one-inch-community/core/lit';
import { tap } from 'rxjs';
import { classMap } from 'lit/directives/class-map.js';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';
import { SwapContextToken } from '@one-inch-community/sdk/swap';


@customElement(SelectTokenElement.tagName)
export class SelectTokenElement extends LitElement {
  static tagName = 'inch-select-token' as const

  static override styles = selectTokenStyle

  @property({ type: String }) tokenType?: TokenType

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext

  @consume({ context: SwapContextToken, subscribe: true })
  @property({ type: Object })
  swapContext?: ISwapContext

  @provide({ context: selectTokenContext })
  selectTokenContext!: ISelectTokenContext

  private isEmpty = true

  protected override render() {
    const classes = {
      empty: this.isEmpty
    }
    this.initContext()
    return html`
      <inch-token-list
        class="${classMap(classes)}"
        .header="${() => html`
          <div style="margin-left: 1px; margin-right: 1px; pointer-events: auto;">
            <inch-card-header backButton headerText="Select token"></inch-card-header>
            <inch-search-token-input></inch-search-token-input>
            <inch-favorite-tokens></inch-favorite-tokens>
          </div>
        `}"
      ></inch-token-list>
    `
  }

  protected override firstUpdated() {
    subscribe(this, [
      this.getTokenAddressList().pipe(tap(list => this.isEmpty = list.length === 0))
    ])
  }

  private initContext() {
    if (this.selectTokenContext || !this.swapContext || !this.tokenType) return
    this.selectTokenContext = new SelectTokenContext(
      this.tokenType,
      this.applicationContext,
      this.swapContext
    )
  }

  private getTokenAddressList() {
    if (!this.selectTokenContext) throw new Error('')
    return this.selectTokenContext.tokenAddressList$
  }
}


declare global {
  interface HTMLElementTagNameMap {
    'inch-select-token': SelectTokenElement
  }
}
