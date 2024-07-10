import { AnimationMapController, appendStyle } from '@one-inch-community/core/lit';
import '@one-inch-community/ui-components/icon';
import '@one-inch-community/ui-components/button';
import { NotificationRecord } from '../../notifications-controller.interface';
import { html } from 'lit';
import { when } from 'lit/directives/when.js';
import { NotificationsContainer } from '../../notifications-container';

const animationOptions = {
  duration: 500,
  easing: 'cubic-bezier(.2, .8, .2, 1)'
};

export class NotificationAnimationMapController implements AnimationMapController<[string, NotificationRecord], void, void, number> {

  readonly direction = 'vertical';
  readonly vertical = 'notification-item';
  readonly parallelAnimationStrategy = 'parallel';

  private renderElements: Map<number, HTMLElement> | null = null;
  private removeElementsClientHeight: Map<number, number> | null = null;
  private moveElements: Map<[number, number], HTMLElement> | null = null;

  private readonly topOffset = 100

  constructor(private readonly element: NotificationsContainer) {
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
        <inch-button @click="${() => this.element.onShowAll()}" class="show-all-button" fullSize size="l" type="secondary">
          <inch-icon icon="arrowDown24"></inch-icon>
        </inch-button>
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
      element.animate([
        { opacity: 1 },
        { opacity: 0 }
      ], { ...animationOptions, duration: 150 })
      return
    }
    await element.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(110%)' }
    ], animationOptions).finished
  }

  async onBeforeRenderAnimateItem(element: HTMLElement) {
    appendStyle(element, {
      transform: 'translateX(110%)'
    });
  }

  async onAfterRenderAnimateItem(element: HTMLElement, index: number) {
    const reset = () => {
      appendStyle(element, {
        transform: ''
      });
    }
    if (this.element.scrollTop >= this.topOffset) {
      reset()
      return
    }
    const rect = element.getBoundingClientRect()
    if ((rect.top + rect.height - this.topOffset) > window.innerHeight) {
      reset()
      return
    }
    const basePosition = 100
    const startPosition = basePosition + (index * 50)
    await element.animate([
      { transform: `translateX(${startPosition}%)` },
      { transform: 'translateX(0)' }
    ], { ...animationOptions, duration: animationOptions.duration + (index * 50) }).finished
    reset()
  }

  async onBeforeMoveAnimationItem(element: HTMLElement, oldIndex: number, newIndex: number) {
    return newIndex
  }

  async onAfterMoveAnimationItem(element: HTMLElement, newIndex: number) {
    const offset = this.getOffsetByIndex(newIndex)
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
