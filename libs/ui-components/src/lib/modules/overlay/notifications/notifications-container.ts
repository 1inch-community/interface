import { INotificationsController } from './notifications-controller.interface';
import { TemplateResult } from 'lit';

export interface NotificationsContainer extends HTMLElement {
  setController(controller: INotificationsController): void
  setAllNotifications(notifications: Map<number, TemplateResult>): void | Promise<void>
  preRender(): void | Promise<void>
  postRender(): void | Promise<void>
  preClose(): void | Promise<void>
}
