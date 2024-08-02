import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { notificationViewStyle } from './notification-view.style';
import { appendStyle, dispatchEvent, subscribe } from '@one-inch-community/core/lit';
import '@one-inch-community/ui-components/icon';
import '@one-inch-community/ui-components/button';
import { fromEvent, switchMap, takeUntil, tap } from 'rxjs';
import { NotificationConfig } from '@one-inch-community/models';
import { classMap } from 'lit/directives/class-map.js';

@customElement(NotificationViewElement.tagName)
export class NotificationViewElement extends LitElement {
  static readonly tagName = 'inch-notification-view' as const;

  static override styles = notificationViewStyle

  @property({ type: Object }) config?: NotificationConfig
  @property({ type: Number }) timestamp?: number

  private isClose = false

  connectedCallback() {
    super.connectedCallback();
    subscribe(this, [
      this.onTouch()
    ], { requestUpdate: false })
  }

  protected render() {
    const classes = {
      'notification-container': true,
      'warning': this.config?.warningStyle ?? false,
      'error': this.config?.errorStyle ?? false,
    }
    return html`
      <div class="${classMap(classes)}">
        <div>
          <inch-button class="close-notification-button" @click="${() => dispatchEvent(this, 'closeNotification', null)}" size="l" type="secondary">
            <inch-icon icon="cross8"></inch-icon>
          </inch-button>
        </div>
        <div class="notification-title">
          <span>${this.config?.title}</span>
          <div class="notification-time">${this.formatNotificationTime(this.timestamp!)}</div>
        </div>
        <slot></slot>
      </div>
    `
  }

  private onTouch() {
    let distance = 0
    return fromEvent<TouchEvent>(this, 'touchstart').pipe(
      switchMap((startEvent) => {
        const startPoint = startEvent.touches[0].clientX;
        return fromEvent<TouchEvent>(document, 'touchmove').pipe(
          tap(event => {
            if (this.isClose) return
            const currentPoint = event.touches[0].clientX;
            distance = currentPoint - startPoint;
            appendStyle(this, {
              transform: `translate3d(${distance}px, 0, 0)`,
            })
            if (Math.abs(distance) > (window.innerWidth * 0.30)) {
              this.onClose(distance).catch()
            }
          }),
          takeUntil(fromEvent(document, 'touchend').pipe(
            switchMap(() => this.onResetPosition(distance))
          ))
        )
      })
    )
  }

  private async onResetPosition(lastPosition: number) {
    if (this.isClose) return
    await this.animate([
      { transform: `translate3d(${lastPosition}px, 0, 0)`, },
      { transform: `translate3d(0, 0, 0)`, }
    ], { duration: 200 }).finished
    appendStyle(this, {
      transform: '',
    })
  }

  private async onClose(lastPosition: number) {
    this.isClose = true
    dispatchEvent(this, 'closeNotification', null)
    await this.animate([
      { transform: `translate3d(${lastPosition}px, 0, 0)`, },
      { transform: `translate3d(${lastPosition * 10}px, 0, 0)`, }
    ], { duration: 200 }).finished
    appendStyle(this, {
      transform: `translate3d(${lastPosition * 10}px, 0, 0)`,
    })
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

declare global {
  interface HTMLElementTagNameMap {
    'inch-notification-view': NotificationViewElement;
  }
}
