import { INotificationsController, NotificationRecord } from './notifications-controller.interface';
import { TemplateResult } from 'lit';

export interface NotificationsContainer extends HTMLElement {
  setController(controller: INotificationsController): void
  setAllNotifications(notifications: [string, NotificationRecord][]): void | Promise<void>
  preRender(): void | Promise<void>
  postRender(): void | Promise<void>
  preClose(): void | Promise<void>
  closeNotification(id: string): void | Promise<void>
  makeNotificationTemplate(record: NotificationRecord): TemplateResult
  animationStartHandler(): void
  animationCompleteHandler(): void
  onShowAll(): void
}
