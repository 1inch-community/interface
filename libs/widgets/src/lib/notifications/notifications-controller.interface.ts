import { TemplateResult } from 'lit';
import { NotificationConfig } from '@one-inch-community/models';

export interface INotificationsControllerInternal {
  closeNotifications(): Promise<void>
  closeNotification(id: string): Promise<void>
}

export type NotificationRecord = {
  id: string
  config: NotificationConfig
  timestamp: number
  element: HTMLElement
}
