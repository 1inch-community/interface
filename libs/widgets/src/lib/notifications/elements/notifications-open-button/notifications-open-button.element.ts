import { html, LitElement, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@one-inch-community/ui-components/button'
import '@one-inch-community/ui-components/icon'
import { consume } from '@lit/context';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';
import { IApplicationContext } from '@one-inch-community/models';
import { notificationsOpenButtonStyle } from './notifications-open-button.style';
import { defer, tap } from 'rxjs';
import { observe, subscribe } from '@one-inch-community/core/lit';
import { when } from 'lit/directives/when.js';

@customElement(NotificationsOpenButtonElement.tagName)
export class NotificationsOpenButtonElement extends LitElement {
  static tagName = 'inch-notifications-open-button' as const;

  static override styles = [
    notificationsOpenButtonStyle
  ]

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext;

  @state() count = 0

  private readonly count$ = defer(() => this.applicationContext.notificationsController.notificationsCount$)

  protected firstUpdated() {
    this.count = this.applicationContext.storageController.get('inch-notifications-open-button__count', Number) ?? 0
    subscribe(this, [
      this.count$.pipe(tap(count => {
        this.applicationContext.storageController.set('inch-notifications-open-button__count', count)
        this.count = count
      }))
    ])
  }

  protected render() {
    return html`
      <inch-button @click="${() => this.applicationContext.notificationsController.openAllNotifications()}" size="l" type="secondary-gray">
        <inch-icon icon="bell24"></inch-icon>
      </inch-button>
      ${when(this.count, () => html`<span class="notification-counter">${this.count}</span>`)}
    `
  }



}

declare global {
  interface HTMLElementTagNameMap {
    'inch-notifications-open-button': NotificationsOpenButtonElement
  }
}
