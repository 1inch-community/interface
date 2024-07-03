export interface INotificationsController {
  closeNotifications(): Promise<void>
  closeNotification(id: number): Promise<void>
}
