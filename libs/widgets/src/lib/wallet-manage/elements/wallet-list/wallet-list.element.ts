import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { Task } from '@lit/task';
import '../wallet-view'
import { consume } from '@lit/context';
import { controllerContext } from '../../context';
import { IConnectWalletController } from '@one-inch-community/models';
import '@one-inch-community/ui-components/icon';
import '@one-inch-community/ui-components/scroll';

@customElement(WalletListElement.tagName)
export class WalletListElement extends LitElement {
  static tagName = 'inch-wallet-list' as const

  @consume({ context: controllerContext })
  private controller?: IConnectWalletController

  private readonly task = new Task(this,
    async () => await this.getController().getSupportedWallets(),
    () => []
  )

  protected override render() {
    return this.task.render({
      pending: () => html`<inch-icon icon="unicornRun"></inch-icon>`,
      complete: (infoList) => html`
        <inch-scroll-view-consumer>
          ${map(infoList, info => html`<inch-wallet-view .info="${info}"></inch-wallet-view>`)}
        </inch-scroll-view-consumer>
      `
    })
  }

  private getController() {
    if (!this.controller) {
      throw new Error('')
    }
    return this.controller
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'inch-wallet-list': WalletListElement
  }
}
