import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { headerStyle } from './header.style';
import { subscribe } from '@one-inch-community/ui-components/lit';
import '@one-inch-community/ui-components/icon';
import { fromEvent } from 'rxjs';

@customElement(HeaderElement.tagName)
export class HeaderElement extends LitElement {
  static tagName = 'inch-header' as const

  static override styles = headerStyle

  private mobileMedia = matchMedia('(max-width: 450px)')

  connectedCallback() {
    super.connectedCallback();
    subscribe(this, [
      fromEvent(this.mobileMedia, 'change')
    ])
  }

  protected render() {
    if (this.mobileMedia.matches) {
      return this.getMobileHeader()
    }

    return this.getDesktopHeader()
  }

  private getDesktopHeader() {
    return html`
      <div class="header-container">
        <inch-icon icon="logoFull"></inch-icon>
      </div>
    `
  }

  private getMobileHeader() {
    return html`
      <div class="header-container mobile-header">
        <inch-icon icon="logoFull"></inch-icon>
      </div>
    `
  }
}