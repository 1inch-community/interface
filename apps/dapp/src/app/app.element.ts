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


@customElement('app-root')
export class AppElement extends LitElement {

  static override styles = [
    appStyle,
    scrollbarStyle,
  ]

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext

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
