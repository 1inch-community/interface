import { css as LitCss, CSSResult, type ReactiveControllerHost, unsafeCSS } from 'lit';
import { subscribe } from './subscribe-reactive-controller';
import { Observable, defer, fromEvent, shareReplay, startWith, map } from 'rxjs';

const mobileMediaString = 'screen and (max-width: 610px)' as const
let mobileMatchMedia: MediaQueryList;

export function getMobileMatchMedia() {
  if (!mobileMatchMedia) {
    mobileMatchMedia = matchMedia(mobileMediaString)
  }
  return mobileMatchMedia
}

export function mobileMediaCSS(style: CSSResult) {
  return LitCss`
      @media ${unsafeCSS(mobileMediaString)} {
          ${unsafeCSS(style)}
      }
  `
}

const emitter$ = defer(() => fromEvent(getMobileMatchMedia(), 'change')).pipe(
  map(() => getMobileMatchMedia()),
  startWith(getMobileMatchMedia()),
  shareReplay({ bufferSize: 0, refCount: true }),
)

export function changeMobileMatchMedia(context: ReactiveControllerHost) {
  subscribe(context, [emitter$])
}

export function getMobileMatchMediaEmitter(): Observable<MediaQueryList> {
  return emitter$
}

export function getMobileMatchMediaAndSubscribe(context: ReactiveControllerHost) {
  changeMobileMatchMedia(context)
  return getMobileMatchMedia()
}
