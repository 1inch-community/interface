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
    if (element.id === this.onKeyExtractor(['fullView', null as any])) {
      element.animate([
        { opacity: 1 },
        { opacity: 0 }
      ], { ...this.animationOptions, duration: 150 })
      return
    }
    await element.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(110%)' }
    ], this.animationOptions).finished
  }

  async onBeforeRenderAnimateItem(element: HTMLElement) {
    appendStyle(element, {
      transform: 'translateX(110%)'
    });
  }

  async onAfterMoveAnimationItem(element: HTMLElement, newIndex: number) {
    const rect = element.getBoundingClientRect()
    if (rect.top > (window.innerHeight + this.topOffset)) {
      return
    }
    const offset = this.getOffsetByIndex(newIndex)
    await element.animate([
      { transform: `translateY(${offset * -1}px)` },
      { transform: `translateY(0)` },
    ], this.animationOptions).finished
  }

  async onAfterRenderAnimateItemTransition(element: HTMLElement, index: number): Promise<void> {
    const offset = 100 + (index * 50)
    await element.animate([
      { transform: `translateX(${offset}%)` },
      { transform: 'translateX(0)' }
    ], { ...this.animationOptions, duration: this.animationOptions.duration + (index * 50) }).finished
  }
  onAfterRenderAnimateItemSkipTransition(element: HTMLElement): void {
    appendStyle(element, {
      transform: ''
    });
  }

}
