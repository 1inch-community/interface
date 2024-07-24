import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { settingsStyle } from './settings.style';
import { SceneController, shiftAnimation } from '@one-inch-community/ui-components/scene';
import { getLocalizationSettingsView, getMainSettingsView, getPersonalizationSettingsView } from './settings.view';
import { consume } from '@lit/context';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';
import { IApplicationContext } from '@one-inch-community/models';
import { getMobileMatchMediaAndSubscribe } from '@one-inch-community/core/lit';

@customElement(Settings.tagName)
export class Settings extends LitElement {
  static readonly tagName = 'inch-settings'

  static override styles = settingsStyle

  private readonly mobileMedia = getMobileMatchMediaAndSubscribe(this)

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext

  private readonly scene = new SceneController('main', {
    main: { minWidth: this.getWidth(), maxWidth: this.getWidth(), maxHeight: 180, minHeight: 180 },
    personalization: { minWidth: this.getWidth(), maxWidth: this.getWidth(), maxHeight: 240, minHeight: 240 },
    localization: { minWidth: this.getWidth(), maxWidth: this.getWidth(), maxHeight: 180, minHeight: 180 }
  }, shiftAnimation())

  protected render() {
    return html`
      <div class="settings-scene-container">
        ${this.scene.render({
          main: () => getMainSettingsView(this.scene, this),
          personalization: () => getPersonalizationSettingsView(this.scene, this.applicationContext, this),
          localization: () => getLocalizationSettingsView(this.scene, this.applicationContext),
        })}
      </div>
    `
  }

  private getWidth() {
    if (this.mobileMedia.matches) return window.innerWidth - 16
    return 556
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-settings': Settings
  }
}
