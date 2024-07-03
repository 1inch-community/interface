import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { NotificationsContainer } from '../../notifications-container';
import { INotificationsController } from '../../notifications-controller.interface';

@customElement(NotificationsMobileContainerElement.tagName)
export class NotificationsMobileContainerElement extends LitElement implements NotificationsContainer {
  static readonly tagName = 'inch-notifications-mobile-container';

  private controller!: INotificationsController

  setController(controller: INotificationsController) {
    this.controller = controller
  }

  setAllNotifications(notifications: Map<number, TemplateResult>) {
  }

  addNotification(notification: TemplateResult): void | Promise<void> {

  }

  preRender() {

  }

  postRender() {

  }

  async preClose() {

  }

  protected override render() {
    return html`
      
    `
  }

}
