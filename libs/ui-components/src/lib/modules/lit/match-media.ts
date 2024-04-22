import { css as LitCss, CSSResult, type ReactiveControllerHost, unsafeCSS } from 'lit';
import { subscribe } from './subscribe-reactive-controller';
import { fromEvent } from 'rxjs';

const mobileMediaString = 'screen and (max-width: 600px)' as const
const mobileMatchMedia = matchMedia(mobileMediaString)

export function getMobileMatchMedia() {
  return mobileMatchMedia
}

export function mobileMediaCSS(style: CSSResult) {
  return LitCss`
      @media ${unsafeCSS(mobileMediaString)} {
          ${unsafeCSS(style)}
      }
  `
}

export function changeMobileMatchMedia(context: ReactiveControllerHost) {
  subscribe(context, [
    fromEvent(getMobileMatchMedia(), 'change')
  ])
}

export function getMobileMatchMediaAndSubscribe(context: ReactiveControllerHost) {
  changeMobileMatchMedia(context)
  return getMobileMatchMedia()
}