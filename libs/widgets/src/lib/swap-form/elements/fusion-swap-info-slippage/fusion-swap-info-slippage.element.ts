import { LitElement, html } from 'lit';
import { fusionSwapInfoSlippageStyle } from './fusion-swap-info-slippage.style';
import { customElement } from 'lit/decorators.js';
import '@one-inch-community/ui-components/segmented-control'
import '@one-inch-community/ui-components/icon'
import type { SegmentedControlItem } from '@one-inch-community/ui-components/segmented-control';
import { dispatchEvent, appendStyle, subscribe, getMobileMatchMediaAndSubscribe } from '@one-inch-community/lit';
import { Maskito } from '@maskito/core';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import { fromEvent, tap } from 'rxjs';

@customElement(FusionSwapInfoSlippageElement.tagName)
export class FusionSwapInfoSlippageElement extends LitElement {
  static tagName = 'inch-fusion-swap-info-slippage' as const;

  static override styles = fusionSwapInfoSlippageStyle

  private readonly mobileMedia = getMobileMatchMediaAndSubscribe(this)

  private readonly segments: SegmentedControlItem[] = [
    { label: 'Auto', value: 'auto' },
    { label: '0.1%', value: 0.1 },
    { label: '0.5%', value: 0.5 },
    { label: '1%', value: 1 },
    { label: 'Custom', template: () => html`${this.customSlippageItem}` },
  ]

  private readonly customSlippageItem = document.createElement('input')

  override connectedCallback() {
    super.connectedCallback();
    this.buildMask()
    this.customSlippageItem.placeholder = 'Custom %'
    this.customSlippageItem.inputMode = 'decimal'
    this.customSlippageItem.autocomplete = 'off'
    appendStyle(this.customSlippageItem, {
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none',
      padding: '0',
      color: 'var(--color-content-content-primary)',
      width: '80px',
      fontSize: '16px',
      textAlign: 'center',
    })
    subscribe(this, [
      fromEvent(this.customSlippageItem, 'input').pipe(
        tap(() => {
          if (this.customSlippageItem.value == '%') {
            this.customSlippageItem.value = '';
          }
        })
      )
    ], { requestUpdate: false })
  }

  protected override render() {
    appendStyle(this.customSlippageItem, {
      fontSize: this.mobileMedia.matches ? '13px' : '16px',
    })
    return html`
      <div @click="${() => dispatchEvent(this, 'backFromSlippageSettings', null)}" class="slippage-title">
        <inch-icon class="back-icon" icon="chevronDown16"></inch-icon>
        <span>Slippage tolerance</span>
      </div>
      <inch-segmented-control
        .items="${this.segments}"
        .select="${this.segments[0]}"
      ></inch-segmented-control>
    `
  }

  private buildMask() {
    return new Maskito(this.customSlippageItem, maskitoNumberOptionsGenerator({
      max: 99,
      min: 1,
      postfix: '%'
    }));
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-fusion-swap-info-slippage': FusionSwapInfoSlippageElement
  }
}
