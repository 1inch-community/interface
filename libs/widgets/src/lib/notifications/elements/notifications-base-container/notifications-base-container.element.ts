import { html, LitElement } from 'lit';
import { NotificationsContainer } from '../../notifications-container';
import { INotificationsControllerInternal, NotificationRecord } from '../../notifications-controller.interface';
import { subscribe, getMobileMatchMediaEmitter } from '@one-inch-community/core/lit';
import { skip, switchMap } from 'rxjs';


export abstract class NotificationsBaseContainerElement extends LitElement implements NotificationsContainer {

  protected controller!: INotificationsControllerInternal;
  protected notifications: [string, NotificationRecord][] = [];
  protected animationInProgress = false;
  protected animationStateQueue: [string, NotificationRecord][][] = [];
  protected fullView = false
  protected countShortView = 0

  protected abstract maxShorthandView: number;

  protected constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    subscribe(this, [
      getMobileMatchMediaEmitter().pipe(
        skip(1),
        switchMap(() => this.controller.closeNotifications())
      )
    ], { requestUpdate: false })
  }

  setController(controller: INotificationsControllerInternal) {
    this.controller = controller;
  }

  setAllNotifications(notifications: [string, NotificationRecord][]) {
    if (this.animationInProgress) {
      this.animationStateQueue.push(notifications);
      return;
    }
    this.notifications = notifications;
    if (!this.fullView && this.countShortView < this.maxShorthandView) {
      this.countShortView++
    }
    this.requestUpdate();
  }

  animationStartHandler() {
    this.animationInProgress = true;
  }

  animationCompleteHandler() {
    this.animationInProgress = false;
    const newState = this.animationStateQueue.shift();
    if (newState) {
      this.notifications = newState;
      this.requestUpdate();
    }
  }

  openAll() {
    this.onShowAll()
  }

  protected onShowAll() {
    this.fullView = true
    this.requestUpdate()
  }

  async closeNotification(id: string) {
    await this.controller.closeNotification(id)
  }

  makeNotificationTemplate(record: NotificationRecord) {
    const template = html`${record.element}`
    if (record.config.customTemplate) return html`${template}`
    return html`
      <div class="notification-template">${template}</div>
    `;
  }

  protected getSortedNotifications() {
    const result = this.notifications
    if (this.fullView) {
      return result;
    }
    return [...result.slice(0, this.countShortView)];
  }

  abstract preRender(): void | Promise<void>
  abstract postRender(): void | Promise<void>
  abstract preClose(): void | Promise<void>
}
