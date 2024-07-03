import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { appStyle } from './app.style';
import './elements/header'
import './elements/footer'
import './elements/swap-form'
import { scrollbarStyle } from '@one-inch-community/ui-components/theme';
import { NotificationsController } from '@one-inch-community/ui-components/overlay';

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
    const notificationsController = NotificationsController
    let i = 0
    setInterval(() => {
      if (i >= 4) return
      notificationsController.show('test notification', html`
        <span>Test notification ${i++}</span>
        <span>${new Date().toString()}</span>
      `)
    }, 1000)
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
