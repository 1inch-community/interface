import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { footerStyle } from './footer.style';
import { fromEvent } from 'rxjs';
import { subscribe } from '@one-inch-community/ui-components/lit';

@customElement(FooterElement.tagName)
export class FooterElement extends LitElement {
  static tagName = 'inch-footer' as const

  static styles = footerStyle

  private mobileMedia = matchMedia('(max-width: 450px)')

  connectedCallback() {
    super.connectedCallback();
    subscribe(this, [
      fromEvent(this.mobileMedia, 'change')
    ])
  }

  protected render() {
    if (this.mobileMedia.matches) {
      return this.getMobileFooter()
    }

    return this.getDesktopFooter()
  }

  private getDesktopFooter() {
    return html`
      <div class="footer-container">
        
      </div>
    `
  }

  private getMobileFooter() {
    return html`
      <div class="footer-container mobile-footer">
        
      </div>
    `
  }
}