import { LitElement, html } from 'lit';
import { fusionSwapInfoAuctionTimeStyle } from './fusion-swap-info-auction-time.style';
import { customElement } from 'lit/decorators.js';
import '@one-inch-community/ui-components/segmented-control'
import '@one-inch-community/ui-components/icon'
import type { SegmentedControlItem } from '@one-inch-community/ui-components/segmented-control';
import { dispatchEvent, appendStyle, subscribe, getMobileMatchMediaAndSubscribe } from '@one-inch-community/lit';
import { Maskito } from '@maskito/core';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import { fromEvent, tap } from 'rxjs';

@customElement(FusionSwapInfoAuctionTimeElement.tagName)
export class FusionSwapInfoAuctionTimeElement extends LitElement {
  static tagName = 'inch-fusion-swap-info-auction-time' as const;

  static override styles = fusionSwapInfoAuctionTimeStyle

  private readonly mobileMedia = getMobileMatchMediaAndSubscribe(this)

  private readonly segments: SegmentedControlItem[] = [
    { label: 'Auto', value: 'auto' },
    { label: '3m', value: 60 * 3 },
    { label: '5m', value: 60 * 5 },
    { label: '10m', value: 60 * 10 },
    { label: '30m', value: 60 * 30 },
    this.mobileMedia.matches ? null : { label: '1H', value: 60 * 60 },
    this.mobileMedia.matches ? null : { label: '2H', value: 60 * 60 * 2 },
    { label: 'Custom', template: () => html`${this.customAuctionTimeInput}` },
  ].filter(Boolean) as SegmentedControlItem[]

  private readonly customAuctionTimeInput = document.createElement('input')

  override connectedCallback() {
    super.connectedCallback();
    this.buildMask()
    this.customAuctionTimeInput.placeholder = 'Custom s'
    this.customAuctionTimeInput.inputMode = 'decimal'
    this.customAuctionTimeInput.autocomplete = 'off'
    appendStyle(this.customAuctionTimeInput, {
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
      fromEvent(this.customAuctionTimeInput, 'input').pipe(
        tap(() => {
          if (this.customAuctionTimeInput.value.length === 1) {
            this.customAuctionTimeInput.value = '';
          }
        })
      )
    ], { requestUpdate: false })
  }

  protected override render() {
    appendStyle(this.customAuctionTimeInput, {
      fontSize: this.mobileMedia.matches ? '13px' : '16px',
    })
    return html`
      <div @click="${() => dispatchEvent(this, 'back', null)}" class="slippage-title">
        <inch-icon class="back-icon" icon="chevronDown16"></inch-icon>
        <span>Auction time</span>
      </div>
      <inch-segmented-control
        .items="${this.segments}"
        .select="${this.segments[0]}"
      ></inch-segmented-control>
    `
  }

  private buildMask() {
    return new Maskito(this.customAuctionTimeInput, maskitoNumberOptionsGenerator({
      max: 60 * 60 * 30,
      min: 60 * 3,
      postfix: 's'
    }));
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-fusion-swap-info-auction-time': FusionSwapInfoAuctionTimeElement
  }
}
