import { css as LitCss, CSSResult, type ReactiveControllerHost, unsafeCSS } from 'lit';
import { subscribe } from './subscribe-reactive-controller';
import { Observable, defer, fromEvent, shareReplay } from 'rxjs';

const mobileMediaString = 'screen and (max-width: 610px)' as const
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

const emitter$ = defer(() => fromEvent<MediaQueryListEvent>(getMobileMatchMedia(), 'change')).pipe(
  shareReplay({ bufferSize: 0, refCount: true }),
)

export function changeMobileMatchMedia(context: ReactiveControllerHost) {
  subscribe(context, [emitter$])
}

export function getMobileMatchMediaEmitter(): Observable<MediaQueryListEvent> {
  return emitter$
}

export function getMobileMatchMediaAndSubscribe(context: ReactiveControllerHost) {
  changeMobileMatchMedia(context)
  return getMobileMatchMedia()
}
