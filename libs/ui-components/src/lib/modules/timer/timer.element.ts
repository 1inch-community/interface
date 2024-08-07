import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { timerStyle } from './timer.style';

const millisecondsInDay = 86400000; // 24 * 60 * 60 * 1000
const millisecondsInHour = 3600000; // 60 * 60 * 1000
const millisecondsInMinute = 60000; // 60 * 1000
const millisecondsInSecond = 1000;

@customElement(TimerElement.tagName)
export class TimerElement extends LitElement {
  static readonly tagName = 'inch-timer';

  static readonly styles = timerStyle

  @property({ type: Number }) expirationTime: number = Date.now()

  private timer?: number

  connectedCallback() {
    super.connectedCallback();
    this.viewUpdater()
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.timer && clearTimeout(this.timer)
  }

  protected render() {
    return html`
      <span>${this.calculateTimeView()}</span>
    `
  }

  private viewUpdater() {
    this.requestUpdate()
    this.timer = setTimeout(() => this.viewUpdater(), 500) as any as number
  }

  private calculateTimeView() {
    const currentTime: number = Date.now();
    const differenceInMilliseconds: number = this.expirationTime - currentTime;
    if (differenceInMilliseconds <= 0) {
      return `00:00`
    }

    if (differenceInMilliseconds < millisecondsInDay) {
      // Less than a day
      const hours = Math.floor(differenceInMilliseconds / millisecondsInHour);
      const minutes = Math.floor((differenceInMilliseconds % millisecondsInHour) / millisecondsInMinute);
      const seconds = Math.floor((differenceInMilliseconds % millisecondsInMinute) / millisecondsInSecond);

      if (hours === 0) {
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    } else {
      // More than a day
      const days = Math.floor(differenceInMilliseconds / millisecondsInDay);
      const hours = Math.floor((differenceInMilliseconds % millisecondsInDay) / millisecondsInHour);

      return `${days}D ${hours}h`;
    }

  }

}

declare global {
  interface HTMLElementTagNameMap {
    'inch-timer': TimerElement
  }
}
