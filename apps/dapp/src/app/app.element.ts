import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { appStyle } from './app.style';
import './elements/header'
import './elements/footer'
import './elements/swap-form'
import { fromEvent } from 'rxjs';
import { getMobileMatchMedia, subscribe } from '@one-inch-community/ui-components/lit';
import { Router } from '@vaadin/router';

@customElement('app-root')
export class AppElement extends LitElement {

  private mobileMedia = getMobileMatchMedia()

  connectedCallback() {
    super.connectedCallback();
    subscribe(this, [
      fromEvent(this.mobileMedia, 'change')
    ])
  }

  protected async firstUpdated() {
    const router = new Router(this.shadowRoot?.querySelector('#outlet'));
    await router.setRoutes([
      {
        path: '/', component: 'inch-swap-form-container',
      },
    ]);
  }

  static override styles = [
    appStyle
  ]

  protected render() {
    const classes = {
      content: true,
      mobile: this.mobileMedia.matches
    }
    return html`
      <inch-header></inch-header>
      <div id="outlet" class="${classMap(classes)}"></div>
      <inch-footer></inch-footer>
    `
  }


}
