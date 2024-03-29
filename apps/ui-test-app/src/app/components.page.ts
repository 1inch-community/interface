import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@one-inch-community/ui-components/button'
import '@one-inch-community/ui-components/card'
import '@one-inch-community/ui-components/icon'
import '@one-inch-community/ui-components/segmented-control'
import '../../../../libs/ui-components/src/lib/modules/token-icon/public-api'
import type { SegmentedControlItem } from '@one-inch-community/ui-components/segmented-control'
import {
  MainColors,
  BrandColors,
  themeChangeMainColor,
  themeChangeBrandColor,
} from '@one-inch-community/ui-components/theme';
import { SceneController } from '@one-inch-community/ui-components/scene';

@customElement('app-components')
export class ComponentsPage extends LitElement {

  static override styles = [
    css`
        :host {
            display: flex;
            height: calc(100vh - 16px * 2);
            padding: 16px;
            gap: 8px;
            flex-direction: column;
            flex-wrap: wrap;
        }

        .card-inner-layer {
            display: grid;
            gap: 8px;
            grid-template-columns: 1fr 1fr 1fr;
            align-items: center;
            justify-items: center;
        }

        .theme-control-layer {
            grid-template-columns: 1fr 1fr 1fr 1fr;
        }
    `,
    SceneController.styles()
  ]

  protected readonly data: SegmentedControlItem[] = [
    { value: 1, label: 'data1' },
    { value: 2, label: 'data2' },
    { value: 3, label: 'data3' },
  ]

  protected readonly dataAndTemplate: SegmentedControlItem[] = [
    ...this.data,
    { label: 4, template: () => html`<input placeholder="custom template" style="border: none; outline: none; background-color: transparent;">` }
  ]

  protected readonly segmentedMainColorsData: SegmentedControlItem[] = [
    { label: 'Dark', value: MainColors.dark },
    { label: 'Dark blue', value: MainColors.darkBlue },
    { label: 'Light', value: MainColors.light },
    { label: 'Light blue', value: MainColors.lightBlue },
  ]

  protected readonly segmentedBrandColorsData: SegmentedControlItem[] = [
    { label: 'Community', value: BrandColors.community },
    { label: 'Orange', value: BrandColors.orange },
    { label: 'Violet', value: BrandColors.violet },
  ]

  token1 = {
    symbol: 'USDT',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    chainId: 1
  }

  token2 = {
    symbol: 'GRT',
    address: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
    chainId: 1
  }

  targetToken = this.token1

  targetIcon = 'circle16'

  private readonly scene = new SceneController('scene1', {
    scene1: { width: 50, height: 50 },
    scene2: { width: 50, height: 50 },
  })


  protected render() {
    return html`
      <inch-card>
        <inch-card-header backButton closeButton headerText="Theme"></inch-card-header>
        <inch-segmented-control
          .items="${this.segmentedMainColorsData}"
          .select="${this.segmentedMainColorsData[2]}"
          @change="${(event: CustomEvent) => themeChangeMainColor(event.detail.value, event.detail.event)}"
        ></inch-segmented-control>
        <inch-segmented-control
          .items="${this.segmentedBrandColorsData}" 
          .select="${this.segmentedBrandColorsData[0]}"
          @change="${(event: CustomEvent) => themeChangeBrandColor(event.detail.value, event.detail.event)}"
        ></inch-segmented-control>
      </inch-card>
      
      <inch-card>
        <inch-card-header backButton closeButton headerTextPosition="left" headerText="Theme"></inch-card-header>
        <div class="card-inner-layer theme-control-layer">
          <inch-button @click="${(event: MouseEvent) => themeChangeMainColor(MainColors.dark, event)}"><span>Dark</span></inch-button>
          <inch-button @click="${(event: MouseEvent) => themeChangeMainColor(MainColors.darkBlue, event)}"><span>Dark Blue</span></inch-button>
          <inch-button @click="${(event: MouseEvent) => themeChangeMainColor(MainColors.light, event)}"><span>Light</span></inch-button>
          <inch-button @click="${(event: MouseEvent) => themeChangeMainColor(MainColors.lightBlue, event)}"><span>Light Blue</span></inch-button>
        </div>
      </inch-card>

      <inch-card>
        <inch-card-header closeButton headerTextPosition="left" headerText="Theme"></inch-card-header>
        <div class="card-inner-layer">
          <inch-button @click="${(event: MouseEvent) => themeChangeBrandColor(BrandColors.community, event)}"><span>Community</span></inch-button>
          <inch-button @click="${(event: MouseEvent) => themeChangeBrandColor(BrandColors.orange, event)}"><span>Orange</span></inch-button>
          <inch-button @click="${(event: MouseEvent) => themeChangeBrandColor(BrandColors.violet, event)}"><span>Violet</span></inch-button>
        </div>
      </inch-card>
      
      <inch-card>
        <div class="card-inner-layer">
          <inch-button size="l">
            <inch-icon icon="${this.targetIcon}"></inch-icon>
          </inch-button>
          <inch-button size="xl" disabled>
            <inch-icon icon="circle24"></inch-icon>
          </inch-button>
          <inch-button size="xxl">
            <inch-icon icon="circle24"></inch-icon>
          </inch-button>
          
          
          <inch-button size="l">
            <inch-icon icon="circle16"></inch-icon>
            <span>Button</span>
          </inch-button>
          <inch-button size="xl" disabled>
            <span>Button</span>
            <inch-icon icon="circle24"></inch-icon>
          </inch-button>
          <inch-button size="xxl">
            <inch-icon icon="circle24"></inch-icon>
          </inch-button>
          
          <inch-button size="l"><span>Button</span></inch-button>
          <inch-button size="xl"><span>Button</span></inch-button>
          <inch-button size="xxl"><span>Button</span></inch-button>

          <inch-button size="l" type="primary-critical"><span>Button</span></inch-button>
          <inch-button size="xl" type="primary-critical"><span>Button</span></inch-button>
          <inch-button size="xxl" type="primary-critical"><span>Button</span></inch-button>

          <inch-button size="l" type="primary-warning"><span>Button</span></inch-button>
          <inch-button size="xl" type="primary-warning"><span>Button</span></inch-button>
          <inch-button size="xxl" type="primary-warning"><span>Button</span></inch-button>

          <inch-button size="l" type="secondary"><span>Button</span></inch-button>
          <inch-button size="xl" type="secondary"><span>Button</span></inch-button>
          <inch-button size="xxl" type="secondary"><span>Button</span></inch-button>

          <inch-button size="l" type="secondary-critical"><span>Button</span></inch-button>
          <inch-button size="xl" type="secondary-critical"><span>Button</span></inch-button>
          <inch-button size="xxl" type="secondary-critical"><span>Button</span></inch-button>

          <inch-button size="l" type="secondary-warning"><span>Button</span></inch-button>
          <inch-button size="xl" type="secondary-warning"><span>Button</span></inch-button>
          <inch-button size="xxl" type="secondary-warning"><span>Button</span></inch-button>

          <inch-button size="l" type="secondary-gray"><span>Button</span></inch-button>
          <inch-button size="xl" type="secondary-gray"><span>Button</span></inch-button>
          <inch-button size="xxl" type="secondary-gray"><span>Button</span></inch-button>

          <inch-button size="l" type="secondary-gray" disabled><span>Button</span></inch-button>
          <inch-button size="xl" type="secondary-gray" disabled><span>Button</span></inch-button>
          <inch-button size="xxl" type="secondary-gray" disabled><span>Button</span></inch-button>

          <inch-button size="l" type="tertiary"><span>Button</span></inch-button>
          <inch-button size="xl" type="tertiary"><span>Button</span></inch-button>
          <inch-button size="xxl" type="tertiary"><span>Button</span></inch-button>

          <inch-button size="l" type="tertiary-gray"><span>Button</span></inch-button>
          <inch-button size="xl" type="tertiary-gray"><span>Button</span></inch-button>
          <inch-button size="xxl" type="tertiary-gray"><span>Button</span></inch-button>

          <inch-button size="l" disabled><span>Button</span></inch-button>
          <inch-button size="xl" disabled><span>Button</span></inch-button>
          <inch-button size="xxl" disabled><span>Button</span></inch-button>
        </div>
      </inch-card>
      
      <inch-card>
        <inch-segmented-control .items="${this.data}" .select="${this.data[0]}"></inch-segmented-control>
        <inch-segmented-control .items="${this.data}" .select="${this.data[1]}"></inch-segmented-control>
        <inch-segmented-control .items="${this.data}" .select="${this.data[2]}"></inch-segmented-control>
        <inch-segmented-control .items="${this.dataAndTemplate}" .select="${this.data[2]}"></inch-segmented-control>
      </inch-card>
      
      <inch-card>
<!--        <inch-token-icon symbol="USDT" address="0xdAC17F958D2ee523a2206206994597C13D831ec7" chainId="1" size="40"></inch-token-icon>-->
<!--        <inch-token-icon symbol="USDT" address="0xdAC17F958D2ee523a2206206994597C13D831ece" chainId="1"></inch-token-icon>-->
<!--        <inch-token-icon symbol="USDT" address="0xdAC17F958D2ee523a2206206994597C13D831ece" chainId="1" size="40"></inch-token-icon>-->
<!--        <inch-token-icon symbol="USDT" address="0xdAC17F958D2ee523a2206206994597C13D832ece" chainId="1" size="40"></inch-token-icon>-->
<!--        <inch-token-icon symbol="GRT" address="0xc944E90C64B2c07662A292be6244BDf05Cda44a7" chainId="1" size="40"></inch-token-icon>-->
<!--        <inch-token-icon symbol="GRT" address="0xc944E90C64B2c07662A292be6244BDf05Cda44A7" chainId="1" size="40"></inch-token-icon>-->
<!--        <inch-token-icon symbol="GRT" address="0xc944E90C64B2c07662A292be6244BDf05Cda44a7" chainId="1" size="40"></inch-token-icon>-->
        <inch-token-icon symbol="${this.targetToken.symbol}" address="${this.targetToken.address}" chainId="${this.targetToken.chainId}" size="40"></inch-token-icon>
      </inch-card>
      
      <inch-card>
        <inch-button size="l" @click="${() => this.scene.nextTo('scene1')}"><span>Scene 1</span></inch-button>
        <inch-button size="l" @click="${() => this.scene.nextTo('scene2')}"><span>Scene 2</span></inch-button>
        <inch-button size="l" @click="${() => this.scene.back()}"><span>Back</span></inch-button>
      </inch-card>
      
      <inch-card>
        ${this.scene.render({
          scene1: () => html`<span>s1</span>`,
          scene2: () => html`<span>s2</span>`
        })}
      </inch-card>
    `
  }

  protected firstUpdated() {
    setInterval(() => {
      this.targetIcon = this.targetIcon === 'circle16' ? 'chevronDown16' : 'circle16'
      this.targetToken = this.targetToken === this.token1 ? this.token2 : this.token1
      console.log('change token to', this.targetToken)
      console.log('change icon to', this.targetIcon)
      this.requestUpdate()
    }, 2000)
  }
}