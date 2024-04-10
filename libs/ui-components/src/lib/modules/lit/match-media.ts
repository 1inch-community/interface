import { css, CSSResult, type ReactiveControllerHost, unsafeCSS } from 'lit';
import { subscribe } from './subscribe-reactive-controller';
import { fromEvent } from 'rxjs';

const mobileMediaString = 'screen and (max-width: 450px)' as const
const mobileMatchMedia = matchMedia(mobileMediaString)

export function getMobileMatchMedia() {
  return mobileMatchMedia
}

export function mobileMediaCSS(style: CSSResult) {
  return css`
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