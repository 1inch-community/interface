import { appendStyle } from '@one-inch-community/core/lit';
import '@one-inch-community/ui-components/icon';
import '@one-inch-community/ui-components/button';
import { NotificationAnimationMapBaseController } from '../notifications-base-container';
import { NotificationRecord } from '../../notifications-controller.interface';
import { when } from 'lit/directives/when.js';
import { html } from 'lit';
import { NotificationsContainer } from '../../notifications-container';

export class NotificationAnimationMapController extends NotificationAnimationMapBaseController {
  readonly topOffset = 200

  constructor(element: NotificationsContainer) {
    super(element)
  }

  onTemplateBuilder([id, record]: [string, NotificationRecord]) {
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

  async onBeforeRemoveAnimateItem(element: HTMLElement) {
    await element.animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(50px) scale(0.7)', opacity: 0 }
    ], this.animationOptions).finished
  }

  async onBeforeRenderAnimateItem(element: HTMLElement) {
    appendStyle(element, {
      transform: 'translateX(-110%)'
    });
  }

  async onAfterMoveAnimationItem(element: HTMLElement, newIndex: number) {
    if (this.element.scrollTop >= this.topOffset) {
      return
    }
    const rect = element.getBoundingClientRect()
    if (rect.top > (window.innerHeight + this.topOffset)) {
      return
    }
    const offset = this.getOffsetByIndex(newIndex)
    console.log('onAfterMoveAnimationItem', offset)
    await element.animate([
      { transform: `translateY(${offset * -1}px)` },
      { transform: `translateY(0)` },
    ], this.animationOptions).finished
  }

  async onAfterRenderAnimateItemTransition(element: HTMLElement, index: number): Promise<void> {
    const offset = 100 + (index * 10)
    console.log('onAfterRenderAnimateItemTransition', offset)
    await element.animate([
      { transform: `translateY(${offset * -1}%)`, zIndex: `-${index}` },
      { transform: 'translateY(0)', zIndex: `-${index}` }
    ], { ...this.animationOptions, duration: this.animationOptions.duration, delay: index * 200 }).finished
  }

  onAfterRenderAnimateItemSkipTransition(element: HTMLElement): void {
    appendStyle(element, {
      transform: ''
    });
  }

}
