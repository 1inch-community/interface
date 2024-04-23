import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { appStyle } from './app.style';
import './elements/header'
import './elements/footer'
import './elements/swap-form'
import { Router } from '@vaadin/router';
import { scrollbarStyle } from '@one-inch-community/ui-components/theme';

@customElement('app-root')
export class AppElement extends LitElement {

  protected async firstUpdated() {
    const router = new Router(this.shadowRoot?.querySelector('#outlet'));
    await router.setRoutes([
      {
        path: '/',
        component: 'inch-swap-form-container',
      },
    ]);
  }

  static override styles = [
    appStyle,
    scrollbarStyle
  ]

  protected render() {
    return html`
      <inch-header></inch-header>
      <div id="outlet" class="content"></div>
      <inch-footer></inch-footer>
    `
  }
}
