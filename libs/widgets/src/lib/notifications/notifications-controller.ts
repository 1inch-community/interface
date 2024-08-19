import { html, render, TemplateResult } from 'lit';
import {
  NotificationsDesktopContainerElement,
  NotificationsMobileContainerElement
} from './elements'
import { NotificationsContainer } from './notifications-container';
import { INotificationsController, NotificationConfig } from '@one-inch-community/models';
import { getMobileMatchMedia } from '@one-inch-community/core/lit';
import { LongTimeAsyncCache } from '@one-inch-community/core/cache';
import { INotificationsControllerInternal, NotificationRecord } from './notifications-controller.interface';
import { getNotificationId } from './notifications-id';
import { getContainer } from '@one-inch-community/ui-components/overlay';
import { distinctUntilChanged, map, startWith, Subject } from 'rxjs';
import { asyncFrame } from '@one-inch-community/core/async';

export class NotificationsController implements INotificationsControllerInternal, INotificationsController {

  private readonly cache = new LongTimeAsyncCache<string>('notifications', 3);

  private readonly notifications = new Map<string, NotificationRecord>()

  private readonly mobileMatchMedia = getMobileMatchMedia()

  private activeContainer: NotificationsContainer | null = null

  private update$ = new Subject<void>()

  readonly notificationsCount$ = this.update$.pipe(
    startWith(null),
    map(() => this.notifications.size),
    distinctUntilChanged()
  )

  async init() {
    const records = await this.cache.getAll()
    for (const record of records) {
      const notification: NotificationRecord & { template: string } = JSON.parse(record)
      const templateElement = document.createElement('template');
      templateElement.innerHTML = notification.template.trim();
      const element = templateElement.content.firstChild as HTMLElement
      this.notifications.set(notification.id, {
        ...notification,
        element,
      })
    }
    this.update$.next()
  }

  async openAllNotifications() {
    const container = this.getNotificationsContainer()
    if (!getContainer().contains(container)) {
      await this.renderContainer()
    }
    container.openAll()
  }

  async closeNotifications(): Promise<void> {
    const container = this.getNotificationsContainer()
    await container.preClose()
    container.remove()
    this.activeContainer = null
    this.update$.next()
  }

  async closeNotification(id: string) {
    if (!this.notifications.has(id)) return
    this.notifications.delete(id)
    await this.cache.delete(id)
    if (this.notifications.size === 0) {
      await this.closeNotifications()
      return
    }
    const container = this.getNotificationsContainer()
    if (getContainer().contains(container)) {
      container.setAllNotifications(this.getSortedNotifications())
    } else {
      await this.renderContainer()
    }
    this.update$.next()
  }

  async error(template: string | TemplateResult): Promise<string> {
    return await this.show(
      'Error',
      template,
      { errorStyle: true }
    )
  }

  async warning(template: string | TemplateResult): Promise<string> {
    return await this.show(
      'Warning',
      template,
      { warningStyle: true }
    )
  }

  async show(title: string, template: string | TemplateResult, config?: NotificationConfig): Promise<string> {
    return await this.render(template, { ...config, title })
  }

  private async render(template: string | TemplateResult, config?: NotificationConfig): Promise<string> {
    const id = getNotificationId()
    const templateResult = typeof template === 'string' ? html`${template}` : template
    const element = document.createElement('div');
    render(templateResult, element)
    await asyncFrame()
    const record: NotificationRecord = {
      id,
      element: element,
      config: config ?? {},
      timestamp: Date.now()
    }
    this.notifications.set(id, record)
    if (!(config?.notCache ?? false)) {
      await this.cacheNotification(id, record)
    }
    const container = this.getNotificationsContainer()
    if (getContainer().contains(container)) {
      container.setAllNotifications(this.getSortedNotifications())
    } else {
      await this.renderContainer()
    }
    this.update$.next()
    return id
  }

  private async renderContainer() {
    const container = this.getNotificationsContainer()
    container.setAllNotifications(this.getSortedNotifications())
    await container.preRender()
    getContainer().appendChild(container)
    await container.postRender()
    this.update$.next()
  }

  private getNotificationsContainer() {
    if (this.activeContainer !== null) {
      return this.activeContainer
    }
    let container: NotificationsContainer
    if (this.mobileMatchMedia.matches) {
      container = document.createElement(NotificationsMobileContainerElement.tagName) as NotificationsContainer
    } else {
      container = document.createElement(NotificationsDesktopContainerElement.tagName) as NotificationsContainer
    }
    container.setController(this)
    this.activeContainer = container
    return container
  }

  private async cacheNotification(id: string, record: NotificationRecord) {
    try {
      const serializer = new XMLSerializer();
      const templateString = serializer.serializeToString(record.element);
      const recordString = JSON.stringify({
        ...record,
        template: templateString,
        element: undefined
      })
      await this.cache.set(id, recordString)
    } catch (error) {
      console.warn(error)
    }
  }

  protected getSortedNotifications() {
    return [...this.notifications.entries()].sort((r1, r2) => {
      const n1 = r1[1];
      const n2 = r2[1];
      return n2.timestamp - n1.timestamp;
    })
  }

}
