import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { Task } from '@lit/task';
import { icons, IconsRecord } from './icons';


@customElement(IconElement.tagName)
export class IconElement extends LitElement {
  static tagName = 'inch-icon' as const

  static override styles = css`
    :host {
        display: flex;
        width: fit-content;
        height: fit-content;
    }
  `

  @property({ type: String, attribute: 'icon' }) icon?: string
  @property({ type: String, attribute: true }) width?: string
  @property({ type: String, attribute: true }) height?: string

  @property({ type: Object }) props?: unknown

  private iconRecord?: IconsRecord

  private readonly iconLoadTask = new Task(
    this,
    ([iconName]) => this.loadImage(iconName),
    () => [this.icon]
  )

  protected override render() {
    const styles = {
      width: this.width ?? this.iconRecord?.width,
      height: this.height ?? this.iconRecord?.height
    }
    return this.iconLoadTask.render({
      pending: () => html`<div style="${styleMap(styles)}"></div>`,
      complete: (svg) => {
        if (typeof svg === 'function') {
          return svg({ ...styles, props: this.props })
        }
        return svg
      }
    })
  }

  protected async loadImage(iconName?: string) {
    if (!iconName) {
      throw new Error('icon is required field for inch-icon element')
    }
    this.iconRecord = icons[iconName]
    if (!this.iconRecord) {
      throw new Error(`icon name ${iconName} not exist`)
    }
    return await this.iconRecord.loader()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-icon': IconElement
  }
}
