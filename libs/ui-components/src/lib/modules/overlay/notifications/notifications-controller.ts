import { html, TemplateResult } from 'lit';
import { unsafeHTML} from 'lit/directives/unsafe-html.js';
import { getContainer } from '../overlay-container';
import {
  NotificationsDesktopContainerElement,
  NotificationsMobileContainerElement
} from './elements'
import { NotificationsContainer } from './notifications-container';
import { getMobileMatchMedia } from '@one-inch-community/core/lit';
import { LongTimeAsyncCache } from '@one-inch-community/core/cache';
import { INotificationsController, NotificationConfig, NotificationRecord } from './notifications-controller.interface';
import { getNotificationId } from './notifications-id';

export class NotificationsController implements INotificationsController {

  static async new() {
    const instance = new NotificationsController()
    await instance.initialize()
    return instance
  }

  // implementation

  private readonly cache = new LongTimeAsyncCache<string>('notifications', 3);

  private readonly notifications = new Map<string, NotificationRecord>()

  private readonly mobileMatchMedia = getMobileMatchMedia()

  private readonly overlayContainer = getContainer()

  private activeContainer: NotificationsContainer | null = null

  protected constructor() {
  }

  async closeNotifications(): Promise<void> {
    const container = this.getNotificationsContainer()
    await container.preClose()
    container.remove()
    this.activeContainer = null
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
    if (this.overlayContainer.contains(container)) {
      container.setAllNotifications(this.getSortedNotifications())
    } else {
      await this.renderContainer()
    }
  }

  private async initialize() {
    const records = await this.cache.getAll()
    for (const record of records) {
      const notification: NotificationRecord = JSON.parse(record)
      this.notifications.set(notification.id, {
        ...notification,
        template: html`${unsafeHTML(notification.template as unknown as string)}`
      })
    }
  }

  async error(title: string): Promise<string> {
    return await this.render(html``, { errorStyle: true })
  }

  async show(title: string, template: TemplateResult, config?: NotificationConfig): Promise<string> {
    return await this.render(template, { ...config, title })
  }

  private async render(template: TemplateResult, config?: NotificationConfig): Promise<string> {
    const id = getNotificationId()
    const record: NotificationRecord = {
      id,
      template,
      config: config ?? {},
      timestamp: Date.now()
    }
    this.notifications.set(id, record)
    if (!(config?.notCache ?? false)) {
      await this.cacheNotification(id, record)
    }
    const container = this.getNotificationsContainer()
    if (this.overlayContainer.contains(container)) {
      container.setAllNotifications(this.getSortedNotifications())
    } else {
      await this.renderContainer()
    }
    return id
  }

  private async renderContainer() {
    const container = this.getNotificationsContainer()
    container.setAllNotifications(this.getSortedNotifications())
    await container.preRender()
    this.overlayContainer.appendChild(container)
    await container.postRender()
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
      const template = templateToString(record.template)
      if (template === null) {
        console.warn(`Notification with title ${record.config.title} cannot be cache pleas yse flag notCache: true for hidde this warning`)
        return
      }
      const recordString = JSON.stringify({ ...record, template })
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

export function templateToString(data: TemplateResult): string | null {
  const {strings, values} = data;
  const valueList = [...values, ''];  // + last empty part
  let output = '';
  for (let i = 0; i < strings.length; i++) {
    let v: unknown = valueList[i];
    if (typeof v === 'function') {
      return null
    }
    if (typeof v === 'object' && v !== null && Reflect.get(v, '_$litType$') !== undefined) {
      v = templateToString(v as TemplateResult);  // embedded Template
    } else if (Array.isArray(v)) {
      // array of strings or templates.
      let newV = '';
      for (const inner_v of [...v]) {
        newV += templateToString(inner_v);
      }
      v = newV;
    }
    output += strings[i] + v;
  }
  return output;
}
