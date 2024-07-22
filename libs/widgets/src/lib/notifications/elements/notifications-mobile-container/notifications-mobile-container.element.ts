import { html, render } from 'lit';
import { customElement } from 'lit/decorators.js';
import { notificationsMobileContainerStyle } from './notifications-mobile-container.style';
import { NotificationsBaseContainerElement, notificationsBaseContainerStyle } from '../notifications-base-container';
import {
  subscribe,
  appendStyle,
  animationMap,
} from '@one-inch-community/core/lit';
import { NotificationAnimationMapController } from './notification-animation-map-controller';
import {
  map,
  tap,
  fromEvent,
  startWith,
  switchMap,
  takeUntil,
  Observable,
  debounceTime,
  distinctUntilChanged,
  Subject,
  merge
} from 'rxjs';
import { createRef, ref } from 'lit/directives/ref.js';
import { getScrollbarStyle } from '@one-inch-community/core/theme';
import { consume } from '@lit/context';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';
import { IApplicationContext } from '@one-inch-community/models';
import { getContainer } from '@one-inch-community/ui-components/overlay';
import './notifications-mobile-info.element';

const animationOptions = {
  duration: 500,
  easing: 'cubic-bezier(.2, .8, .2, 1)'
};

@customElement(NotificationsMobileContainerElement.tagName)
export class NotificationsMobileContainerElement extends NotificationsBaseContainerElement {
  static readonly tagName = 'inch-notifications-mobile-container' as const;

  static override readonly styles = [
    getScrollbarStyle(':host', true),
    notificationsBaseContainerStyle,
    notificationsMobileContainerStyle
  ];

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext;

  protected maxShorthandView = 1;

  private readonly animationController = new NotificationAnimationMapController(this);

  private readonly touchContainerRef = createRef<HTMLElement>();
  private readonly contentContainerRef = createRef<HTMLElement>();
  private readonly backgroundViewRef = createRef<HTMLElement>();

  private upButtonElement: HTMLElement | null = null;

  private hostHeight = this.clientHeight

  private readonly infoViewHeight: number = 48; //px

  private readonly open$ = new Subject<void>()

  private lastOffset = 0

  private closeInProgress = false

  private readonly openInterpolation$ = this.open$.pipe(
    switchMap(() => interpolateTo(10, this.infoViewHeight, 200))
  )

  protected firstUpdated() {
    subscribe(this, [
      this.onShowHideUpButton(),
      this.swipeDownOnShortViewHandler()
    ], { requestUpdate: false });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.upButtonElement?.remove();
  }

  protected override render() {
    return html`
      <div ${ref(this.backgroundViewRef)} class="background-view"></div>
      <div ${ref(this.touchContainerRef)} class="touch-container">
        <div class="info-view">
          <inch-notifications-mobile-info></inch-notifications-mobile-info>
        </div>
        <div ${ref(this.contentContainerRef)} class="content-view">
          ${animationMap(
            this.getSortedNotifications(),
            this.animationController as any
          )}
        </div>
      </div>
    `;
  }

  async closeNotification(id: string) {
    if (this.fullView) {
      await this.controller.closeNotification(id)
      return
    }
    await this.controller.closeNotifications()
  }

  openAll() {
    this.hostHeight = this.clientHeight
    this.open$.next()
  }

  preRender(): void {
    appendStyle(this, {
      transform: 'translateY(-100%)'
    });
  }

  async postRender(): Promise<void> {
    await this.animate([
      { transform: `translate3d(0, -100%, 0)` },
      { transform: `translate3d(0, ${-this.infoViewHeight}px, 0)` }
    ], animationOptions).finished;
    appendStyle(this, {
      transform: `translate3d(0, ${-this.infoViewHeight}px, 0)`
    });
  }

  async preClose(): Promise<void> {
    this.closeInProgress = true
    if (!this.fullView) {
      await this.touchContainerRef.value!.animate([
        { transform: `translate3d(0, ${this.lastOffset * -1}px, 0)` },
        { transform: `translate3d(0, -100%, 0)` },
      ], { ...animationOptions, duration: 700 }).finished
    } else {
     await Promise.all([
       this.contentContainerRef.value!.animate([
         { transform: `translate3d(0, ${this.lastOffset}px, 0)` },
         { transform: `translate3d(0, 100%, 0)` },
       ], { duration: 1000 }).finished,
       this.touchContainerRef.value!.animate([
         { opacity: 1 },
         { opacity: 0 },
       ], { ...animationOptions, duration: 1000 }).finished,
       this.backgroundViewRef.value!.animate([
         getBackdropFilter('blur(3px)'),
         getBackdropFilter('blur(0px)'),
       ], { ...animationOptions, duration: 1000 })
     ])
    }
  }

  private swipeDownOnShortViewHandler() {
    let fullView = this.fullView
    return merge(
      this.openInterpolation$,
      getInteractiveTouchEvent(this, {
        startHandler: () => {
          fullView = this.fullView
          this.hostHeight = this.clientHeight
          this.animationStartHandler()
        },
        endHandler: () => {
          this.animationCompleteHandler()
        }
      })
    ).pipe(
      map((offset) => {
        return this.fullView && offset < this.infoViewHeight ? this.infoViewHeight : offset
      }),
      tap(offset => {
        if (!this.touchContainerRef.value || this.scrollTop > 0 || this.closeInProgress) return;
        if (offset < 0) {
          this.handleCloseOnShortView(offset)
        } else {
          this.applyBackgroundBlur(offset);
          this.applyOffsetOnContentContainer(offset);
          this.applyOffsetOnShowAll(offset);
          this.applyHostHeight(offset);
          this.handleCloseOnFullView(offset, fullView)
        }
        this.applyOffsetOnHost(offset);
        this.lastOffset = offset
      })
    );
  }

  private getUpButtonTemplate() {
    return html`
      <inch-button @click="${() => this.scrollToUp()}" size="l">
        <inch-icon style="transform: rotate(180deg)" icon="arrowDown24"></inch-icon>
      </inch-button>
    `;
  }

  private onShowHideUpButton() {
    return fromEvent(this, 'scroll').pipe(
      startWith(null),
      map(() => {
        return this.scrollTop > 80;
      }),
      distinctUntilChanged(),
      debounceTime(300),
      switchMap(async (state) => {
        if (state) {
          this.upButtonElement?.remove();
          this.upButtonElement = document.createElement('div');
          render(this.getUpButtonTemplate(), this.upButtonElement);
          appendStyle(this.upButtonElement, {
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            zIndex: '3010',
            transform: 'translateY(200%)'
          });
          getContainer().appendChild(this.upButtonElement);
          await this.upButtonElement?.animate([
            { transform: 'translateY(200%)' },
            { transform: 'translateY(0)' }
          ], animationOptions).finished;
          if (this.upButtonElement === null) return;
          appendStyle(this.upButtonElement, {
            transform: ''
          });
        } else {
          await this.upButtonElement?.animate([
            { transform: 'translateY(0)' },
            { transform: 'translateY(200%)' }
          ], animationOptions).finished;
          this.upButtonElement?.remove();
          this.upButtonElement = null;
        }
        return [];
      })
    );
  }

  private applyBackgroundBlur(offset: number) {
    if (!this.backgroundViewRef.value || this.fullView) return;
    const max = 3
    let blur = offset * max / this.infoViewHeight;
    blur = blur > max ? max : blur
    appendStyle(this.backgroundViewRef.value, {
      ...getBackdropFilter(`blur(${blur}px)`)
    });
  }

  private applyOffsetOnContentContainer(offset: number) {
    if (!this.contentContainerRef.value) return;
    const contentContainerOffset = offset - this.infoViewHeight
    if (contentContainerOffset >= 0) {
      appendStyle(this.contentContainerRef.value, {
        transform: `translate3d(0, ${contentContainerOffset}px, 0)`
      });
    }
  }

  private applyOffsetOnShowAll(offset: number) {
    if (offset >= this.infoViewHeight && !this.fullView) {
      this.onShowAll()
    }
  }

  private applyOffsetOnHost(offset: number) {
    let hostOffset = this.infoViewHeight - offset
    hostOffset = Math.max(hostOffset, 0)
    appendStyle(this, {
      transform: hostOffset === 0 ? '' : `translate3d(0, -${hostOffset}px, 0)`
    });
  }

  private applyHostHeight(offset: number) {
    const max = window.innerHeight
    const min = this.hostHeight
    let height = offset * max / this.infoViewHeight;
    height = height > max ? max : height
    height = height < min ? min : height
    appendStyle(this, {
      height: `${height}px`
    })
  }

  private handleCloseOnShortView(offset: number) {
    if (offset < -(this.hostHeight * 0.25)) {
      this.controller.closeNotifications().catch(console.error)
    }
  }

  private handleCloseOnFullView(offset: number, fullView: boolean) {
    if (offset > (30 * window.innerHeight / 100) && fullView) {
      this.controller.closeNotifications().catch(console.error)
    }
  }

  private scrollToUp() {
    this.scrollTo({ top: -1, left: 0, behavior: 'smooth' });
  }

}

type InteractiveTouchEventConfig = {
  bounceEffect?: () => boolean
  startHandler?: () => void
  endHandler?: () => void
  maxOffset?: number
}

function getInteractiveTouchEvent(element: HTMLElement, config?: InteractiveTouchEventConfig) {
  const end$ = fromEvent(document, 'touchend');
  return fromEvent<TouchEvent>(element, 'touchstart').pipe(
    switchMap(startEvent => {
      config?.startHandler?.();
      const startPoint = startEvent.touches[0].clientY;
      return fromEvent<TouchEvent>(document, 'touchmove').pipe(
        map(event => event.touches[0].clientY - startPoint),
        switchMap(offset => end$.pipe(
          switchMap(() => {
            config?.endHandler?.();
            return interpolateTo(offset, 0, 500);
          }),
          startWith(offset)
        )),
        takeUntil(end$.pipe(debounceTime(600)))
      );
    })
  );
}

function cubicBezier(p1y: number, p2y: number) {
  return (t: number) => {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;
    return uuu * 0 + 3 * uu * t * p1y + 3 * u * tt * p2y + ttt * 1;
  }
}

function cubicBezierInterpolation(p1y: number, p2y: number) {
  const ease = cubicBezier(p1y, p2y);

  return (startValue: number, endValue: number, t: number) => {
    const bezierValue = ease(t);
    return startValue + (endValue - startValue) * bezierValue;
  };
}


const ease = cubicBezierInterpolation(0, 0.8);
function interpolateTo(fromValue: number, toValue: number, duration: number) {
  return new Observable<number>(subscriber => {
    const startTime = Date.now();
    const endTime = startTime + duration;
    let timer: number;

    const handler = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const t = Math.min(elapsedTime / duration, 1); // Обеспечиваем, что t не превышает 1
      const currentValue = ease(fromValue, toValue, t);
      subscriber.next(currentValue);

      if (currentTime < endTime) {
        timer = requestAnimationFrame(handler);
      } else {
        subscriber.complete();
      }
    };

    timer = requestAnimationFrame(handler);

    return () => {
      timer && cancelAnimationFrame(timer);
    };
  });
}

function getBackdropFilter(value: string) {
  return {
    backdropFilter: value,
    '-webkit-backdrop-filter': value
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-notifications-mobile-container': NotificationsMobileContainerElement;
  }
}
