import { TemplateResult } from 'lit';

export interface INotificationsControllerInternal {
  closeNotifications(): Promise<void>
  closeNotification(id: string): Promise<void>
}

export type NotificationConfig = {
  title?: string
  notCache?: boolean
  errorStyle?: boolean
  customTemplate?: boolean
}

export type NotificationRecord = {
  id: string
  template: TemplateResult
  config: NotificationConfig
  timestamp: number
}
