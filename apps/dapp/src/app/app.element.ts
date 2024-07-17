import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { appStyle } from './app.style';
import './elements/header'
import './elements/footer'
import './elements/swap-form'
import { scrollbarStyle } from '@one-inch-community/core/theme';


@customElement('app-root')
export class AppElement extends LitElement {

  static override styles = [
    appStyle,
    scrollbarStyle,
  ]

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
