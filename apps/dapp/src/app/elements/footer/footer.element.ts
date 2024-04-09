import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { footerStyle } from './footer.style';
import { fromEvent } from 'rxjs';
import { subscribe } from '@one-inch-community/ui-components/lit';
import { getFooterHeight, getMobileMatchMedia } from '../../platform/match-media';

@customElement(FooterElement.tagName)
export class FooterElement extends LitElement {
  static tagName = 'inch-footer' as const

  static styles = footerStyle

  private mobileMedia = getMobileMatchMedia()

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
    const styles = {
      height: getFooterHeight()
    }
    return html`
      <div class="footer-container" style="${styleMap(styles)}">
        
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

declare global {
  interface HTMLElementTagNameMap {
    'inch-footer': FooterElement
  }
}