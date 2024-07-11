import { appendStyle } from '@one-inch-community/core/lit';
import '@one-inch-community/ui-components/icon';
import '@one-inch-community/ui-components/button';
import { NotificationsContainer } from '../../notifications-container';
import { NotificationAnimationMapBaseController } from '../notifications-base-container';

export class NotificationAnimationMapController extends NotificationAnimationMapBaseController {
  readonly topOffset = 100

  constructor(element: NotificationsContainer) {
    super(element)
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
    const offset = this.getOffsetByIndex(newIndex)
    await element.animate([
      { transform: `translateY(${offset * -1}px)` },
      { transform: `translateY(0)` },
    ], this.animationOptions).finished
  }

  async onAfterRenderAnimateItemTransition(element: HTMLElement, index: number, offset: number): Promise<void> {
    await element.animate([
      { transform: `translateY(${offset * -1}%)` },
      { transform: 'translateY(0)' }
    ], { ...this.animationOptions, duration: this.animationOptions.duration + (index * 50) }).finished
  }
  onAfterRenderAnimateItemSkipTransition(element: HTMLElement): void {
    appendStyle(element, {
      transform: ''
    });
  }

}
