import { InitializingEntity } from '../base';
import { Observable } from 'rxjs';

export interface INotificationsController extends InitializingEntity {
  readonly notificationsCount$: Observable<number>
  openAllNotifications(): Promise<void>
}
