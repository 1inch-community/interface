import { InitializingEntity } from '../base';
import { Observable } from 'rxjs';
import { TemplateResult } from 'lit';

export type NotificationConfig = {
  title?: string
  notCache?: boolean
  errorStyle?: boolean
  warningStyle?: boolean
  customTemplate?: boolean
  pinned?: boolean
}

export interface INotificationsController extends InitializingEntity {
  readonly notificationsCount$: Observable<number>
  openAllNotifications(): Promise<void>
  show(title: string, template: string | TemplateResult, config?: NotificationConfig): Promise<string>
  error(template: string | TemplateResult): Promise<string>
  warning(template: string | TemplateResult): Promise<string>
}
