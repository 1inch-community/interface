import { LitElement, html } from 'lit';
import { fusionSwapInfoSlippageStyle } from './fusion-swap-info-slippage.style';
import { customElement, property } from 'lit/decorators.js';
import '@one-inch-community/ui-components/segmented-control'
import '@one-inch-community/ui-components/icon'
import type { SegmentedControlItem } from '@one-inch-community/ui-components/segmented-control';
import { SwapSettings } from '@one-inch-community/models';
import { dispatchEvent, appendStyle, subscribe, getMobileMatchMediaAndSubscribe } from '@one-inch-community/lit';
import { Maskito } from '@maskito/core';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import { fromEvent, tap } from 'rxjs';

@customElement(FusionSwapInfoSlippageElement.tagName)
export class FusionSwapInfoSlippageElement extends LitElement {
  static tagName = 'inch-fusion-swap-info-slippage' as const;

  static override styles = fusionSwapInfoSlippageStyle

  @property({ type: Object }) settings?: SwapSettings['slippage']

  private readonly mobileMedia = getMobileMatchMediaAndSubscribe(this)

  private readonly segmentsCustom: SegmentedControlItem = { label: 'Custom', value: 'custom', template: () => html`${this.customSlippageInput}` }

  private readonly segments: SegmentedControlItem[] = [
    { label: 'Auto', value: 'auto' },
    { label: '0.1%', value: 0.1 },
    { label: '0.5%', value: 0.5 },
    { label: '1%', value: 1 },
    this.segmentsCustom,
  ]

  private readonly postfix = '%'

  private readonly customSlippageInput = document.createElement('input')

  override connectedCallback() {
    super.connectedCallback();
    this.buildMask()
    this.settings?.startChangingValue()
    this.customSlippageInput.placeholder = 'Custom %'
    this.customSlippageInput.inputMode = 'decimal'
    this.customSlippageInput.autocomplete = 'off'
    appendStyle(this.customSlippageInput, {
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
      fromEvent(this.customSlippageInput, 'input').pipe(
        tap(() => {
          if (this.customSlippageInput.value.length === 1) {
            this.customSlippageInput.value = '';
          }
          const inputValue = parseFloat(this.customSlippageInput.value.replace(this.postfix, ''))
          this.settings?.setValue([ inputValue, 'custom' ])
        })
      )
    ], { requestUpdate: false })
  }

  protected override render() {
    appendStyle(this.customSlippageInput, {
      fontSize: this.mobileMedia.matches ? '13px' : '16px',
    })
    return html`
      <div @click="${() => this.onBack()}" class="slippage-title">
        <inch-icon class="back-icon" icon="chevronDown16"></inch-icon>
        <span>Slippage tolerance</span>
      </div>
      <inch-segmented-control
        .items="${this.segments}"
        .select="${this.getStartSection()}"
        @change="${(event: CustomEvent) => this.onChange(event)}"
      ></inch-segmented-control>
    `
  }

  private buildMask() {
    return new Maskito(this.customSlippageInput, maskitoNumberOptionsGenerator({
      max: 99,
      min: 1,
      precision: 2,
      postfix: this.postfix
    }));
  }

  private onBack() {
    const value = this.settings?.value ?? null
    if (value && value[1] === 'custom' && (value[0] === null || isNaN(value[0]))) {
      this.settings?.resetValue()
    }
    this.settings?.endChangingValue()
    dispatchEvent(this, 'back', null)
  }

  private onChange({ detail }: CustomEvent) {
    const value = detail.value
    if (value === 'auto') {
      this.settings?.cleanValue()
      return
    }
    if (value === 'custom') {
      const inputValue = parseFloat(this.customSlippageInput.value.replace(this.postfix, ''))
      this.settings?.setValue([ inputValue, 'custom' ])
      return
    }
    this.settings?.setValue([ detail.value, 'preset' ])
  }

  private getStartSection(): SegmentedControlItem {
    if (!this.settings || this.settings.value === null) return this.segments[0]
    const [ value, type ] = this.settings.value
    if (type === 'custom') {
      if (isNaN(parseFloat(value as any))) return this.segments[0]
      this.customSlippageInput.value = `${value}%`
      return this.segmentsCustom
    }
    if (type === 'preset') {
      const preset = this.segments.find(item => item.value === value)
      if (!preset) return this.segments[0]
      return preset
    }
    throw new Error('Invalid slippage type');
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-fusion-swap-info-slippage': FusionSwapInfoSlippageElement
  }
}
