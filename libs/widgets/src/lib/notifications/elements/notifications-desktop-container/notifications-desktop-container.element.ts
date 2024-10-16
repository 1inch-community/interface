import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { notificationsDesktopContainerStyle } from './notifications-desktop-container.style';
import { getScrollbarStyle } from '@one-inch-community/core/theme';
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
import { NotificationsBaseContainerElement, notificationsBaseContainerStyle } from '../notifications-base-container';

const animationOptions = {
  duration: 500,
  easing: 'cubic-bezier(.2, .8, .2, 1)'
};

@customElement(NotificationsDesktopContainerElement.tagName)
export class NotificationsDesktopContainerElement extends NotificationsBaseContainerElement {
  static readonly tagName = 'inch-notifications-desktop-container' as const;

  static override readonly styles = [
    getScrollbarStyle(':host', true),
    notificationsBaseContainerStyle,
    notificationsDesktopContainerStyle
  ];

  private isClose = false

  protected maxShorthandView = 4

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

  protected override render() {
    return html`
      <div class="close-button-container">
        <inch-button @click="${() => this.controller.removeNotifications()}" size="l" type="tertiary-gray">
          <inch-icon icon="trash16"></inch-icon>
        </inch-button>
        <inch-button @click="${() => this.controller.closeNotifications()}" size="l" type="tertiary-gray">
          <inch-icon icon="xCircle16"></inch-icon>
        </inch-button>
      </div>
      ${animationMap(
        this.getSortedNotifications(),
        this.animationController as any
      )}
    `;
  }

  override getSortedNotifications() {
    const result = super.getSortedNotifications()
    if (!this.fullView) {
      return [ ...result, ['fullView'] as any]
    }
    return result
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

declare global {
  interface HTMLElementTagNameMap {
    'inch-notifications-desktop-container': NotificationsDesktopContainerElement
  }
}
