import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { appStyle } from './app.style';
import './elements/header'
import './elements/footer'
import './elements/swap-form'
import { scrollbarStyle } from '@one-inch-community/core/theme';
import { consume } from '@lit/context';
import { IApplicationContext } from '@one-inch-community/models';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';
import { asyncTimeout } from '@one-inch-community/core/async';
import "@one-inch-community/widgets/notifications"


@customElement('app-root')
export class AppElement extends LitElement {

  static override styles = [
    appStyle,
    scrollbarStyle,
  ]

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext

  protected firstUpdated() {
    // this.init()
  }

  private async init() {
    const notificationsController = this.applicationContext.notificationsController
    let i = 0
    await notificationsController.show(
      'Swap status',
      html`<inch-notification-fusion-swap-view orderHash="0xd88ff7eb802ef939e3652006777f6fbe70955d094c3ff97799472070f33796fb"></inch-notification-fusion-swap-view>`
    )
    const loop = async () => {
      if (i >= 1) return
      await notificationsController.warning(
        'test notification ' + i,
      )
      i++
      await asyncTimeout(2000)
      loop()
    }
    await loop()
  }

  protected render() {
    return html`
      <inch-header></inch-header>
      <div id="outlet" class="content">
        <inch-swap-form-container></inch-swap-form-container>
      </div>
      <inch-footer></inch-footer>
    `
  }
}
