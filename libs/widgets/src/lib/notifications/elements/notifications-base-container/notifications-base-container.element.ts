import { html, LitElement } from 'lit';
import { NotificationsContainer } from '../../notifications-container';
import { INotificationsControllerInternal, NotificationRecord } from '../../notifications-controller.interface';
import { classMap } from 'lit/directives/class-map.js';

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

  onShowAll() {
    this.fullView = true
    this.requestUpdate()
  }

  async closeNotification(id: string) {
    await this.controller.closeNotification(id)
  }

  makeNotificationTemplate(record: NotificationRecord) {
    if (record.config.customTemplate) return html`${record.template}`;
    const classes = {
      'notification-container': true,
      'error': record.config.errorStyle ?? false
    };
    return html`
      <div class="${classMap(classes)}">
        <div class="notification-title">
          <span>${record.config.title}</span>
          <div class="notification-time">${this.formatNotificationTime(record.timestamp)}</div>
        </div>
        <div class="notification-template">${record.template}</div>
      </div>
    `;
  }

  private formatNotificationTime(timestamp: number): string {
    const date = new Date(timestamp);
    const formatTimeValue = (value: number) => {
      return value < 10 ? '0' + value : value;
    };
    const timeView = [
      formatTimeValue(date.getHours()),
      formatTimeValue(date.getMinutes()),
      formatTimeValue(date.getSeconds())
    ].join(':');

    if (Date.now() - timestamp > 6 * 60 * 60 * 1000) {
      const dateView = [
        formatTimeValue(date.getDate()),
        formatTimeValue(date.getMonth() + 1)
      ].join('.');
      return [dateView, timeView].join(' ');
    }

    return timeView;
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
