import { html, TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { getContainer } from '../overlay-container';
import {
  NotificationsDesktopContainerElement,
  NotificationsMobileContainerElement
} from './elements'
import { NotificationsContainer } from './notifications-container';
import { getOverlayId } from '../overlay-id-generator';
import { getMobileMatchMedia } from '@one-inch-community/lit';
import { INotificationsController } from './notifications-controller.interface';

export class NotificationsController implements INotificationsController {

  async new() {
    const instance = new NotificationsController()
  }

  // implementation

  private readonly notifications = new Map<number, TemplateResult>()

  private readonly mobileMatchMedia = getMobileMatchMedia()

  private readonly overlayContainer = getContainer()
  private readonly notificationDesktopContainer: NotificationsContainer
  private readonly notificationMobileContainer: NotificationsContainer

  protected constructor() {
    this.notificationDesktopContainer = document.createElement(NotificationsDesktopContainerElement.tagName) as NotificationsContainer
    this.notificationMobileContainer = document.createElement(NotificationsMobileContainerElement.tagName) as NotificationsContainer
    this.notificationDesktopContainer.setController(this)
    this.notificationMobileContainer.setController(this)

  }

  async closeNotifications(): Promise<void> {
    const container = this.getNotificationsContainer()
    await container.preClose()
    container.remove()
  }

  async closeNotification(id: number) {
    if (!this.notifications.has(id)) return
    this.notifications.delete(id)
    if (this.notifications.size === 0) {
      await this.closeNotifications()
      return
    }
    const container = this.getNotificationsContainer()
    if (this.overlayContainer.contains(container)) {
      container.setAllNotifications(this.notifications)
    } else {
      await this.renderContainer()
    }
  }

  private async initialize() {

  }

  private async error(title: string): Promise<number> {
    return this.render(this.makeNotificationTemplate(title, html``, { isError: true }))
  }

  private async show(title: string, template: TemplateResult): Promise<number> {
    return this.render(this.makeNotificationTemplate(title, template))
  }

  private async render(template: TemplateResult): Promise<number> {
    const id = getOverlayId()
    this.notifications.set(id, template)
    const container = this.getNotificationsContainer()
    if (this.overlayContainer.contains(container)) {
      container.setAllNotifications(this.notifications)
    } else {
      await this.renderContainer()
    }
    return id
  }

  private async renderContainer() {
    const container = this.getNotificationsContainer()
    container.setAllNotifications(this.notifications)
    await container.preRender()
    this.overlayContainer.appendChild(container)
    await container.postRender()
  }

  private getNotificationsContainer() {
    if (this.mobileMatchMedia.matches) {
      return this.notificationMobileContainer
    }
    return this.notificationDesktopContainer
  }

  private makeNotificationTemplate(title: string, template: TemplateResult, options?: { isError?: boolean }) {
    const classes = {
      'notification-container': true,
      'error': options?.isError ?? false,
    }
    return html`
      <div class="${classMap(classes)}">
        <div>${title}</div>
        <div>${template}</div>
      </div>
    `
  }

}
