import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { Task } from '@lit/task';
import { icons, IconsRecord } from './icons';
import { iconTagName } from './icon-tag-name';

@customElement(IconElement.tagName)
export class IconElement extends LitElement {
  static tagName = iconTagName

  static override styles = css`
    :host {
        display: flex;
        width: fit-content;
        height: fit-content;
    }
  `

  @property({ type: String }) icon?: string

  private iconRecord?: IconsRecord

  private readonly iconLoadTask = new Task(
    this,
    ([iconName]) => this.loadImage(iconName),
    () => [this.icon]
    )

  protected override render() {

    return this.iconLoadTask.render({
      pending: () => html`<div style="${styleMap({ width: this.iconRecord?.width, height: this.iconRecord?.height })}"></div>`,
      complete: (svg) => svg
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