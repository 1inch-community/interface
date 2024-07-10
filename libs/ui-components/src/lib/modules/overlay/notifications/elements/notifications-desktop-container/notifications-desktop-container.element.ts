import { html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { customElement, state } from 'lit/decorators.js';
import { NotificationsContainer } from '../../notifications-container';
import { INotificationsController, NotificationRecord } from '../../notifications-controller.interface';
import { notificationsDesktopContainerStyle } from './notifications-desktop-container.style';
import { getScrollbarStyle } from '@one-inch-community/ui-components/theme';
import '@one-inch-community/ui-components/icon';
import '@one-inch-community/ui-components/button';
import { animationMap, appendStyle, subscribe } from '@one-inch-community/core/lit';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  startWith,
  switchMap,
  takeUntil,
  tap,
  timer
} from 'rxjs';
import { NotificationAnimationMapController } from './notification-animation-map-controller';

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

  @state() countShortView = 0

  private isClose = false

  private animationInProgress = false;

  private animationStateQueue: [string, NotificationRecord][][] = [];

  private readonly animationController = new NotificationAnimationMapController(this);

  connectedCallback() {
    super.connectedCallback();
    let prevDelta = 0;
    subscribe(this, [
      merge(
        getInteractiveCloseStreamByScrollEvent(this),
        getInteractiveCloseStreamByTouchEvent(this),
      ).pipe(
        filter(() => !this.isClose),
        tap((delta: number) => {
          if ((Math.abs(delta - prevDelta) > 10) && delta === 0) {
            this.animate([
              { transform: `translate3d(${prevDelta}px, 0, 0)` },
              { transform: `translate3d(0, 0, 0)` }
            ], { ...animationOptions, delay: 200 }).finished
              .then(() => {
                appendStyle(this, {
                  transform: ''
                })
              })
            prevDelta = delta
            return
          }
          if ((delta * 100 / this.clientWidth) > 50) {
            this.isClose = true
            this.animate([
              { transform: `translate3d(${delta}px, 0, 0)` },
              { transform: `translate3d(100%, 0, 0)` }
            ], animationOptions).finished
              .then(() => {
                appendStyle(this, {
                  transform: `translate3d(100%, 0, 0)`
                })
                return this.controller.closeNotifications()
              })
            return
          }
          appendStyle(this, {
            transform: `translate3d(${delta}px, 0, 0)`
          })
          prevDelta = delta
        })
      )
    ], { requestUpdate: false })
  }

  setController(controller: INotificationsController) {
    this.controller = controller;
  }

  setAllNotifications(notifications: [string, NotificationRecord][]) {
    if (this.animationInProgress) {
      this.animationStateQueue.push(notifications);
      return;
    }
    this.notifications = notifications;
    if (!this.fullView && this.countShortView < 4) {
      this.countShortView++
    }
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
    if (this.isClose) return
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
    return [...result.slice(0, this.countShortView), ['fullView']];
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

function getInteractiveCloseStreamByScrollEvent(element: HTMLElement) {
  let offsetX = 0
  let offsetY = 0
  let fullOverflow = false
  const initialResistance = 50000;
  const resistanceThreshold = 1;
  const reset = () => {
    offsetX = 0
    offsetY = 0
    fullOverflow = false
  }
  const applyBounceEffect = (offset: number) => {
    if (offset < 0) {
      const resistance = (element.clientWidth - offset) * 0.02
      if (resistance > 12) {
        fullOverflow = true
      }
      return (resistanceThreshold / initialResistance) + ((offset - resistanceThreshold) / resistance)
    }
    return offset
  };
  return fromEvent<WheelEvent>(document, 'wheel').pipe(
    filter(event => event.deltaMode === event.DOM_DELTA_PIXEL),
    map(event => {
      if (fullOverflow) {
        event.stopPropagation()
      }
      offsetX = offsetX + event.deltaX
      offsetY = offsetY + event.deltaY
      if ((Math.abs(offsetX) - Math.abs(offsetY)) < 0) {
        return 0
      }
      return offsetX * -1
    }),
    switchMap(offset => {
      if (offset === 0) {
        reset()
        return [0]
      }
      return timer(100).pipe(
        map(() => {
          reset()
          return 0
        }),
        startWith(applyBounceEffect(offset))
      )
    }),
    distinctUntilChanged()
  )
}

function getInteractiveCloseStreamByTouchEvent(element: HTMLElement) {
  const end$ = fromEvent(document, 'touchend')
  const initialResistance = 50000;
  const resistanceThreshold = 1;
  const applyBounceEffect = (offset: number) => {
    if (offset < 0) {
      const resistance = (element.clientWidth - offset) * 0.02
      return (resistanceThreshold / initialResistance) + ((offset - resistanceThreshold) / resistance)
    }
    return offset
  };

  return fromEvent<TouchEvent>(element, 'touchstart').pipe(
    switchMap(startEvent => {
      const startPoint = startEvent.touches[0].clientX;
      return fromEvent<TouchEvent>(document, 'touchmove').pipe(
        map(event => event.touches[0].clientX - startPoint),
        switchMap(offset => end$.pipe(
          map(() => 0),
          startWith(applyBounceEffect(offset))
        )),
        takeUntil(end$.pipe(debounceTime(100)))
      )
    })
  )
}
