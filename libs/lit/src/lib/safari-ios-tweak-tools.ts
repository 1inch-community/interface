import { CSSResult, ReactiveElement, unsafeCSS } from 'lit';
import { fromEvent, merge, tap } from 'rxjs';
import { subscribe } from './subscribe-reactive-controller';

export function isSafariIOS() {
  return !(window as unknown as { MSStream: unknown }).MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export function IosCss(style: CSSResult) {
  if (isSafariIOS()) {
    return unsafeCSS(style)
  }
  return unsafeCSS('')
}

export function preventIosScrollTopOverflow(element: ReactiveElement) {
  if (!isSafariIOS()) return
  subscribe(element, [
    merge(
      fromEvent(element, 'touchmove'),
      fromEvent(element, 'touchstart'),
    ).pipe(
      tap(() => {
        if (element.scrollTop < 0) {
          element.style.touchAction = 'none'
          element.style.overflow = 'hidden'
        } else {
          element.style.touchAction = ''
          element.style.overflow = ''
        }
      })
    )
  ])
}
