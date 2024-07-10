import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { appStyle } from './app.style';
import './elements/header'
import './elements/footer'
import './elements/swap-form'
import { scrollbarStyle } from '@one-inch-community/ui-components/theme';
import { NotificationsController } from '@one-inch-community/ui-components/overlay';
import { asyncTimeout } from '@one-inch-community/ui-components/async';

@customElement('app-root')
export class AppElement extends LitElement {

  // protected async firstUpdated() {
  //   const router = new Router(this.shadowRoot?.querySelector('#outlet'));
  //   await router.setRoutes([
  //     {
  //       path: '/',
  //       component: 'inch-swap-form-container',
  //     },
  //   ]);
  // }

  static override styles = [
    appStyle,
    scrollbarStyle,
  ]

  constructor() {
    super();
    this.init()
  }

  private async init() {
    const notificationsController = await NotificationsController.new()
    let i = 0
    const loop = async () => {
      if (i > 1) return
      await notificationsController.show('test notification', html`
        <span>Test notification ${i++}</span>
        <span>${new Date().toString()}</span>
      `)
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
