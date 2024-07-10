import { html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { customElement, state } from 'lit/decorators.js';
import { NotificationsContainer } from '../../notifications-container';
import { INotificationsController, NotificationRecord } from '../../notifications-controller.interface';
import { notificationsDesktopContainerStyle } from './notifications-desktop-container.style';
import { getScrollbarStyle } from '@one-inch-community/ui-components/theme';
import '@one-inch-community/ui-components/icon';
import '@one-inch-community/ui-components/button';
import {
  animationMap,
  appendStyle,
  AnimationMapController,
} from '@one-inch-community/core/lit';
import { when } from 'lit/directives/when.js';
import { asyncTimeout } from '@one-inch-community/ui-components/async';

const animationOptions = {
  duration: 500,
  easing: 'cubic-bezier(.2, .8, .2, 1)'
};

@customElement(NotificationsDesktopContainerElement.tagName)
export class NotificationsDesktopContainerElement extends LitElement implements NotificationsContainer {
  static readonly tagName = 'inch-notifications-desktop-container';

  static override readonly styles = [
    getScrollbarStyle(':host', true),
    notificationsDesktopContainerStyle
  ];

  private controller!: INotificationsController;

  private notifications: [string, NotificationRecord][] = [];

  @state() fullView = false;

  private animationInProgress = false;

  private animationStateQueue: [string, NotificationRecord][][] = [];

  private readonly animationController = new NotificationAnimationMapController(this);

  setController(controller: INotificationsController) {
    this.controller = controller;
  }

  setAllNotifications(notifications: [string, NotificationRecord][]) {
    if (this.animationInProgress) {
      console.log('push', this.animationStateQueue);
      this.animationStateQueue.push(notifications);
      return;
    }
    this.notifications = notifications;
    this.requestUpdate();
  }

  preRender() {
    appendStyle(this, {
      transform: 'translateX(100%)'
    });
  }

  async postRender() {
    await this.animate([
      { transform: 'translateX(100%)' },
      { transform: 'translateX(0)' }
    ], animationOptions).finished;
    appendStyle(this, {
      transform: ''
    });
  }

  async preClose() {
    await this.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(100%)' }
    ], animationOptions).finished;
    appendStyle(this, {
      transform: 'translateX(100%)'
    });
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

  animationStartHandler() {
    this.animationInProgress = true;
  }

  animationCompleteHandler() {
    this.animationInProgress = false;
    const newState = this.animationStateQueue.shift();
    console.log('shift', this.animationStateQueue);
    if (newState) {
      this.notifications = newState;
      this.requestUpdate();
    }
  }

  onShowAll() {
    this.fullView = true
  }

  protected override render() {
    return html`
      <div class="close-button-container">
        <inch-button @click="${() => this.controller.closeNotifications()}" size="l" type="tertiary-gray">
          <inch-icon icon="cross8"></inch-icon>
        </inch-button>
      </div>
      ${animationMap(
        this.getSortedNotifications(),
        this.animationController as any
      )}
    `;
  }

  private getSortedNotifications() {
    const result = this.notifications.sort((r1, r2) => {
      const n1 = r1[1];
      const n2 = r2[1];
      return n2.timestamp - n1.timestamp;
    });
    if (this.fullView) {
      return result;
    }
    return [...result.slice(0, 4), ['fullView']];
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

}

class NotificationAnimationMapController implements AnimationMapController<[string, NotificationRecord], void, void, number> {

  readonly direction = 'vertical';
  readonly vertical = 'notification-item';
  readonly parallelAnimationStrategy = 'parallel';

  private renderElements: Map<number, HTMLElement> | null = null;
  private removeElementsClientHeight: Map<number, number> | null = null;
  private moveElements: Map<[number, number], HTMLElement> | null = null;

  constructor(private readonly element: NotificationsDesktopContainerElement) {
  }

  onKeyExtractor([id, record]: [string, NotificationRecord]) {
    if (id === 'fullView') {
      return 'item-' + id;
    }
    const date = new Date(record.timestamp)
    return 'item-' + id + `_${[date.getMinutes(), date.getSeconds()].join('-')}`;
  }

  onTemplateBuilder([id, record]: [string, NotificationRecord]) {
    if (id === 'fullView') {
      return html`
        <inch-button @click="${() => this.element.onShowAll()}" class="show-all-button" fullSize size="l" type="secondary">Show all</inch-button>
      `;
    }
    return html`
      <div class="notification-close-container">
        ${when(true, () => html`
          <inch-button class="close-notification-button" @click="${() => this.element.closeNotification(id)}" size="l" type="secondary">
            <inch-icon icon="cross8"></inch-icon>
          </inch-button>
        `)}
        ${this.element.makeNotificationTemplate(record)}
      </div>
    `;
  }

  onAnimationStart() {
    this.element.animationStartHandler();
  }

  onAnimationComplete() {
    this.element.animationCompleteHandler();
  }

  async onBeforeAnimation(container: HTMLElement, renderElements: Map<number, HTMLElement>, removeElements: Map<number, HTMLElement>, moveElements: Map<[number, number], HTMLElement>) {
    this.renderElements = renderElements
    this.removeElementsClientHeight = new Map<number, number>();
    removeElements.forEach((element, index) => {
      this.removeElementsClientHeight!.set(index, element.clientHeight)
    })
    this.moveElements = moveElements
  }

  async onAfterAnimation() {
    this.renderElements = null
    this.removeElementsClientHeight = null
    this.moveElements = null
  }

  async onBeforeRemoveAnimateItem(element: HTMLElement) {
    if (element.id === this.onKeyExtractor(['fullView', null as any])) {
      await Promise.all([
        element.animate([
          { opacity: 1 },
          { opacity: 0 }
        ], { ...animationOptions, duration: 150 }).finished
      ])
      return
    }
    await Promise.all([
      element.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(110%)' }
      ], animationOptions).finished
    ])
  }

  async onBeforeRenderAnimateItem(element: HTMLElement) {
    appendStyle(element, {
      transform: 'translateX(110%)'
    });
  }

  async onAfterRenderAnimateItem(element: HTMLElement, index: number) {
    const basePosition = 100
    const startPosition = basePosition + (index * 50)
    if (index > 50) {
      return
    }
    await Promise.all([
      element.animate([
        { transform: `translateX(${startPosition}%)` },
        { transform: 'translateX(0)' }
      ], { ...animationOptions, duration: animationOptions.duration + (index * 50) }).finished
    ])
    appendStyle(element, {
      transform: ''
    });
  }

  async onBeforeMoveAnimationItem(element: HTMLElement, oldIndex: number, newIndex: number) {
    return newIndex
  }

  async onAfterMoveAnimationItem(element: HTMLElement, newIndex: number) {
    const offset = this.getOffsetByIndex(newIndex)
    console.log('onAfterMoveAnimationItem', element, newIndex, offset)
    await element.animate([
      { transform: `translateY(${offset * -1}px)` },
      { transform: `translateY(0)` },
    ], animationOptions).finished
  }

  private getOffsetByIndex(index: number): number {
    let offset: number | null = null
    this.moveElements?.forEach((element, [ oldIndex, newIndex]) => {
      if (index - 1 === newIndex) {
        offset = element.clientHeight * (oldIndex > newIndex ? -1 : 1)
      }
    })
    if (offset === null && this.removeElementsClientHeight) {
      const newNode = this.renderElements?.get(0)
      offset = newNode?.clientHeight ?? null
    }
    if (offset === null && this.removeElementsClientHeight) {
      this.removeElementsClientHeight.forEach((clientHeight, removeIndex) => {
        if (removeIndex === index) {
          offset = clientHeight * -1
        }
      })
    }
    return offset ?? 0
  }

}
