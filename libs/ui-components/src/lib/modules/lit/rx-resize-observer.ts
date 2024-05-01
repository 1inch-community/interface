import { Observable } from 'rxjs';

export function resizeObserver(element: Element): Observable<ResizeObserverEntry> {
  return new Observable(subscriber => {
    const resize = new ResizeObserver(entries => subscriber.next(entries[0]))
    resize.observe(element)
    return () => {
      resize.unobserve(element)
    }
  })
}