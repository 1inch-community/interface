import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';

@customElement('app-root')
export class AppElement extends LitElement {

  async firstUpdated() {
    const router = new Router(this.shadowRoot?.querySelector('#outlet'));
    await router.setRoutes([
      {
        path: '/', component: 'app-main',
      },
      {
        path: '/components', component: 'app-components',
        action: () => import('./components.page').then(() => null)
      },
      {
        path: '/widgets', component: 'app-widgets',
        action: () => import('./widgets.page').then(() => null)
      },
    ]);
  }

  protected render() {
    return html`<div id="outlet"></div>`
  }
}

@customElement('app-main')
export class MainPage extends LitElement {

  protected render() {
    return html`
      <div style="display: flex; flex-direction: column">
        <a href="/components">Components</a>
        <a href="/widgets">Widgets</a>
      </div>
    `
  }

}