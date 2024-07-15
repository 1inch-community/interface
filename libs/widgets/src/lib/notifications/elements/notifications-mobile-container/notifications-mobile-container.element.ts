import { html, render } from 'lit';
import { customElement } from 'lit/decorators.js';
import { notificationsMobileContainerStyle } from './notifications-mobile-container.style';
import { NotificationsBaseContainerElement, notificationsBaseContainerStyle } from '../notifications-base-container';
import { animationMap, appendStyle, setBrowserMetaColorColor, subscribe, transitionBrowserMetaColor } from '@one-inch-community/core/lit';
import { NotificationAnimationMapController } from './notification-animation-map-controller';
import {
  debounceTime, distinctUntilChanged,
  fromEvent,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs';
import { when } from 'lit/directives/when.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  blendColors,
  getCssValue,
  getScrollbarStyle, rgbaStrToHex,
} from '@one-inch-community/core/theme';
import { consume } from '@lit/context';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';
import { IApplicationContext } from '@one-inch-community/models';
import { getContainer } from '@one-inch-community/ui-components/overlay';
import './notifications-mobile-info.element'

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

  private isClose = false;

  private openAnimationInProgress = false;

  private readonly animationController = new NotificationAnimationMapController(this);

  private readonly ref = createRef<HTMLElement>();

  private upButtonElement: HTMLElement | null = null;


  connectedCallback() {
    super.connectedCallback();

    subscribe(this, [
      this.onOpenSwipe(),
      this.onCloseSwipe(),
      this.onShowHideUpButton()
    ], { requestUpdate: false });
  }

  protected override render() {
    return html`
      <div ${ref(this.ref)} class="scroll-content-container">
        ${when(this.fullView || this.openAnimationInProgress, () => html`
          <div class="info-view">
            <inch-notifications-mobile-info></inch-notifications-mobile-info>
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
    if (this.isClose) return;
  }

  override onShowAll() {
    super.onShowAll();
  }

  private getUpButtonTemplate() {
    return html`
      <inch-button @click="${() => this.scrollTo(0, 0)}" size="l">
        <inch-icon style="transform: rotate(180deg)" icon="arrowDown24"></inch-icon>
      </inch-button>
    `
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
          this.upButtonElement?.remove()
          this.upButtonElement = document.createElement('div')
          render(this.getUpButtonTemplate(), this.upButtonElement)
          appendStyle(this.upButtonElement, {
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            zIndex: '3010',
            transform: 'translateY(200%)',
          })
          getContainer().appendChild(this.upButtonElement)
          await this.upButtonElement?.animate([
            { transform: 'translateY(200%)' },
            { transform: 'translateY(0)' }
          ], animationOptions).finished
          if (this.upButtonElement === null) return
          appendStyle(this.upButtonElement, {
            transform: '',
          })
        } else {
          await this.upButtonElement?.animate([
            { transform: 'translateY(0)' },
            { transform: 'translateY(200%)' },
          ], animationOptions).finished
          this.upButtonElement?.remove()
          this.upButtonElement = null
        }
        return []
      })
    )
  }

  private onCloseSwipe() {
    let prevOffset = 0;
    const reset = async (offset: number) => {
      await Promise.all([
        this.ref.value!.animate([
          { transform: `translate3d(0, ${prevOffset}px, 0)` },
          { transform: `translate3d(0, 0, 0)` }
        ], { ...animationOptions, delay: 200 }).finished,
      ]);
      appendStyle(this.ref.value!, {
        transform: '',
        paddingBottom: ''
      });
      prevOffset = offset;
    };

    const close = async () => {
      this.isClose = true;
      const bgColor = getCssValue('var(--color-background-bg-body)');
      setBrowserMetaColorColor(bgColor)
      appendStyle(this.ref.value!, {
        ...getBackdropFilter('blur(3px)'),
        background: 'var(--primary-12)'
      });
      appendStyle(this, {
        ...getBackdropFilter(''),
        background: '',
      });
      await this.animate([
        { transform: `translate3d(0, 0, 0)` },
        { transform: `translate3d(0, 120%, 0)` }
      ], { ...animationOptions, duration: 2500 }).finished
      appendStyle(this, {
        transform: `translate3d(0, 120%, 0)`
      });
      await this.controller.closeNotifications();
    }

    return getInteractiveTouchEvent(this).pipe(
      tap(offset => {
        if (!this.fullView || this.openAnimationInProgress || this.isClose) return
        debugger
        if ((Math.abs(offset - prevOffset) > 10) && offset === 0) {
          reset(offset).catch(console.error);
          return;
        }
        if (offset >= 15) {
          close().catch(console.error);
          return;
        }

        appendStyle(this.ref.value!, {
          transform: `translate3d(0, ${offset}px, 0)`,
        });
        prevOffset = offset;
      })
    )
  }

  private onOpenSwipe() {
    let prevOffset = 0;

    const reset = async (offset: number) => {
      await Promise.all([
        this.ref.value!.animate([
          { transform: `translate3d(0, ${prevOffset}px, 0)` },
          { transform: `translate3d(0, 0, 0)` }
        ], { ...animationOptions, delay: 200 }).finished,
        this.animate([
          { ...getBackdropFilter(`blur(${prevOffset * 3 / 15}px)`), },
          { ...getBackdropFilter(`blur(0px)`), },
        ], { ...animationOptions, delay: 200 }).finished
      ]);
      appendStyle(this.ref.value!, {
        transform: '',
        paddingBottom: ''
      });
      appendStyle(this, {
        ...getBackdropFilter('blur(3px)'),
      });
      prevOffset = offset;
    };

    const close = async () => {
      this.isClose = true;
      appendStyle(this.ref.value!, {
        transform: `translate3d(0, 0, 0)`,
        paddingBottom: `0`
      });
      await this.animate([
        { transform: `translate3d(0, ${prevOffset}px, 0)` },
        { transform: `translate3d(0, -120%, 0)` }
      ], animationOptions).finished
      appendStyle(this, {
        transform: `translate3d(0, -120%, 0)`
      });
      await this.controller.closeNotifications();
    }

    const openFullView = async (offset: number) => {
      this.openAnimationInProgress = true;
      appendStyle(this.ref.value!, {
        transform: `translate3d(0, calc(-48px + ${offset}px), 0)`,
        paddingBottom: '',
        ...getBackdropFilter(`blur(3px)`),
      });
      appendStyle(this, {
        ...getBackdropFilter('blur(3px)'),
      });
      this.requestUpdate();
      await this.updateComplete;
      const height = this.ref.value!.clientHeight;
      this.onShowAll();
      const bgColor = getCssValue('var(--color-background-bg-body)');
      const primary12Rgba = getCssValue('var(--primary-12)');
      const primary12Hex = rgbaStrToHex(primary12Rgba);
      const toColor = blendColors(bgColor, primary12Hex);
      setBrowserMetaColorColor(toColor)
      await Promise.all([
        this.ref.value!.animate([
          {
            transform: `translate3d(0, calc(-48px + ${offset}px), 0)`,
            height: `${height}px`,
            background: 'var(--primary-12)'
          },
          {
            transform: `translate3d(0, 0, 0)`,
            height: '100dvh',
            background: 'var(--primary-12)'
          }
        ], { ...animationOptions, duration: 1200 }).finished
      ])
      appendStyle(this.ref.value!, {
        transform: ``,
        ...getBackdropFilter(''),
      });
      appendStyle(this, {
        ...getBackdropFilter(`blur(3px)`),
        background: 'var(--primary-12)',
        height: '100dvh',
      });
      this.openAnimationInProgress = false
      prevOffset = offset;
    };

    return getInteractiveTouchEvent(this).pipe(
      tap(offset => {
        if (this.fullView || this.isClose || this.openAnimationInProgress) return;
        if ((Math.abs(offset - prevOffset) > 10) && offset === 0) {
          reset(offset).catch(console.error);
          return;
        }
        if (offset >= 15) {
          openFullView(offset).catch(console.error);
          return;
        } else {
          appendStyle(this, {
            ...getBackdropFilter(`blur(${offset * 3 / 15}px)`),
          });
        }
        if ((offset * 100 / this.clientHeight) < -30) {
          close().catch(console.error)
          return;
        }

        appendStyle(this.ref.value!, {
          transform: `translate3d(0, ${offset}px, 0)`,
          paddingBottom: `${offset}px`
        });
        prevOffset = offset;
      })
    );
  }

}

function getInteractiveTouchEvent(element: HTMLElement) {
  const end$ = fromEvent(document, 'touchend');
  const initialResistance = 50000;
  const resistanceThreshold = 1;
  const maxOffset = 30;
  const applyBounceEffect = (offset: number) => {
    if (offset < 0) return offset;
    const resistance = (element.clientWidth - offset) * 0.05;
    const result = (resistanceThreshold / initialResistance) + ((offset - resistanceThreshold) / resistance);
    if (result < 0) return 0;
    if (result >= maxOffset) return maxOffset;
    return result;
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
      );
    })
  );
}

function getBackdropFilter(value: string) {
  return {
    backdropFilter: value,
    '-webkit-backdrop-filter': value,
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-notifications-mobile-container': NotificationsMobileContainerElement
  }
}
