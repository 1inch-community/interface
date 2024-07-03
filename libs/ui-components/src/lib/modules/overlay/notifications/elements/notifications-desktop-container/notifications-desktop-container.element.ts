import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { NotificationsContainer } from '../../notifications-container';
import { INotificationsController } from '../../notifications-controller.interface';
import { notificationsDesktopContainerStyle } from './notifications-desktop-container.style';
import { animationMap, appendStyle } from '@one-inch-community/lit';
import { getScrollbarStyle } from '@one-inch-community/ui-components/theme';
import { asyncFrame } from '@one-inch-community/ui-components/async';
import '@one-inch-community/ui-components/icon';
import '@one-inch-community/ui-components/button';

const animationOptions = {
  duration: 500,
  easing: 'cubic-bezier(.2, .8, .2, 1)'
}

@customElement(NotificationsDesktopContainerElement.tagName)
export class NotificationsDesktopContainerElement extends LitElement implements NotificationsContainer {
  static readonly tagName = 'inch-notifications-desktop-container';

  static override readonly styles = [
    getScrollbarStyle(':host', true),
    notificationsDesktopContainerStyle,
  ]

  private controller!: INotificationsController

  private notifications: Map<number, TemplateResult> = new Map()

  setController(controller: INotificationsController) {
    this.controller = controller
  }

  setAllNotifications(notifications: Map<number, TemplateResult>) {
    this.notifications = notifications
    this.requestUpdate()
  }

  preRender() {
    appendStyle(this, {
      transform: 'translateX(100%)'
    })
  }

  async postRender() {
    await this.animate([
      { transform: 'translateX(100%)' },
      { transform: 'translateX(0)' },
    ], animationOptions).finished
    appendStyle(this, {
      transform: ''
    })
  }

  async preClose() {
    await this.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(100%)' },
    ], animationOptions).finished
    appendStyle(this, {
      transform: 'translateX(100%)'
    })
  }

  protected override render() {
    return html`
      <div class="close-button-container">
        <inch-button @click="${() => this.controller.closeNotifications()}" size="l" type="tertiary-gray">
          <inch-icon icon="cross8"></inch-icon>
        </inch-button>
      </div>
      ${animationMap(
        this.notifications.entries(),
        ([ index ]) => 'item-' + index,
        itemAnimation,
        ([ id ,template]) => html`
          <div class="notification-close-container">
            <inch-button class="close-notification-button" @click="${() => this.controller.closeNotification(id)}" size="l" type="secondary">
              <inch-icon icon="cross8"></inch-icon>
            </inch-button>
            ${template}
          </div>
        `
      )}
    `
  }

}

const itemAnimation = {
  direction: 'vertical-reverted' as const,
  deleteElement: async (element: HTMLElement) => {
    const elementHeight = element.offsetHeight
    await Promise.all([
      element.animate([
        { transform: 'translateX(0)', marginBottom: '0' },
        { transform: 'translateX(110%)', marginBottom: `-${elementHeight + 8}px` },
      ], animationOptions).finished
    ])
  },
  addedElement: async (element: HTMLElement) => {
    appendStyle(element, {
      transform: 'translateX(110%)'
    })
    return async (element: HTMLElement, container: HTMLElement) => {
      await asyncFrame()
      const containerHeight = container.offsetHeight
      const elementHeight = element.offsetHeight
      await Promise.all([
        container.animate([
          { height: `${containerHeight - elementHeight}px` },
          { height: `${containerHeight}px` },
        ], animationOptions).finished,
        element.animate([
          { transform: 'translateX(110%)'},
          { transform: 'translateX(0)'}
        ], animationOptions).finished
      ])
      appendStyle(element, {
        transform: ''
      })
    };
  }
};

/*
*
*
* */
