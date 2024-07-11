import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { notificationsMobileContainerStyle } from './notifications-mobile-container.style';
import { NotificationsBaseContainerElement, notificationsBaseContainerStyle } from '../notifications-base-container';
import { animationMap, appendStyle, subscribe } from '@one-inch-community/core/lit';
import { NotificationAnimationMapController } from './notification-animation-map-controller';
import { debounceTime, filter, fromEvent, map, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { when } from 'lit/directives/when.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { getScrollbarStyle } from '@one-inch-community/ui-components/theme';

const animationOptions = {
  duration: 500,
  easing: 'cubic-bezier(.2, .8, .2, 1)'
};

@customElement(NotificationsMobileContainerElement.tagName)
export class NotificationsMobileContainerElement extends NotificationsBaseContainerElement {
  static readonly tagName = 'inch-notifications-mobile-container';

  static override readonly styles = [
    getScrollbarStyle(':host', true),
    notificationsBaseContainerStyle,
    notificationsMobileContainerStyle
  ];

  protected maxShorthandView = 1

  private isClose = true

  private readonly animationController = new NotificationAnimationMapController(this);

  private readonly ref = createRef<HTMLElement>()

  connectedCallback() {
    super.connectedCallback();

    subscribe(this, [
      this.onOpenSwipe()
    ], { requestUpdate: false })
  }

  protected override render() {
    return html`
      <div ${ref(this.ref)} class="scroll-content-container">
        ${when(this.fullView, () => html`
        <div class="info-view">
          
        </div>
      `)}
        ${animationMap(
          this.getSortedNotifications(),
          this.animationController as any
        )}
      </div>
    `;
  }

  preRender(): void | Promise<void> {
    appendStyle(this, {
      transform: 'translateY(-100%)'
    });
  }

  async postRender(): Promise<void> {
    await this.animate([
      { transform: 'translateY(-100%)' },
      { transform: 'translateY(0)' }
    ], animationOptions).finished;
    appendStyle(this, {
      transform: ''
    });
  }

  async preClose(): Promise<void> {
    if (this.isClose) return
  }

  override onShowAll() {
    super.onShowAll();
    this.classList.add('show-all')
  }

  private onOpenSwipe() {
    let prevOffset = 0;

    const reset = async (offset: number) => {
      if (!this.ref.value) return
      await this.ref.value.animate([
        { transform: `translate3d(0, ${prevOffset}px, 0)` },
        { transform: `translate3d(0, 0, 0)` }
      ], { ...animationOptions, delay: 200 }).finished
      appendStyle(this.ref.value, {
        transform: ''
      })
      prevOffset = offset
    }

    return getInteractiveCloseStreamByTouchEvent(this).pipe(
      filter(() => !this.fullView),
      tap(offset => {
        if (!this.ref.value) return;
        if ((Math.abs(offset - prevOffset) > 10) && offset === 0) {
          reset(offset).catch(console.error)
          return
        }
        if (offset >= 20) {
          this.onShowAll()
          appendStyle(this.ref.value, {
            transform: ''
          })
          return;
        }
        if ((offset * 100 / this.ref.value.clientHeight) < -50) {
          this.isClose = true
          this.animate([
            { transform: `translate3d(0, ${offset}px, 0)` },
            { transform: `translate3d(0, -100%, 0)` }
          ], { ...animationOptions, delay: 1000 }).finished
            .then(() => {
              appendStyle(this, {
                transform: `translate3d(0, -100%, 0)`
              })
              return this.controller.closeNotifications()
            })
          return
        }

        appendStyle(this.ref.value, {
          transform: `translate3d(0, ${offset}px, 0)`
        })
        prevOffset = offset
      })
    )
  }

}

function getInteractiveCloseStreamByTouchEvent(element: HTMLElement) {
  const end$ = fromEvent(document, 'touchend')
  const initialResistance = 50000;
  const resistanceThreshold = 1;
  const maxOffset = 30
  const applyBounceEffect = (offset: number) => {
    if (offset < 0) return offset
    const resistance = (element.clientWidth - offset) * 0.05
    const result = (resistanceThreshold / initialResistance) + ((offset - resistanceThreshold) / resistance)
    if (result < 0) return 0
    if (result >= maxOffset) return maxOffset
    return result
  };

  return fromEvent<TouchEvent>(element, 'touchstart').pipe(
    switchMap(startEvent => {
      const startPoint = startEvent.touches[0].clientY;
      return fromEvent<TouchEvent>(document, 'touchmove').pipe(
        map(event => event.touches[0].clientY - startPoint),
        switchMap(offset => end$.pipe(
          map(() => 0),
          startWith(applyBounceEffect(offset))
        )),
        takeUntil(end$.pipe(debounceTime(100)))
      )
    })
  )
}
