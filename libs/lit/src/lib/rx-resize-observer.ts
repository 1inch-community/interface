import { Observable } from 'rxjs';

const storage = new WeakMap<Element, Observable<ResizeObserverEntry>>()

export function resizeObserver(element: Element): Observable<ResizeObserverEntry> {
  if (storage.has(element)) {
    return storage.get(element)!
  }
  const observer = new Observable<ResizeObserverEntry>(subscriber => {
    const resize = new ResizeObserver(entries => subscriber.next(entries[0]))
    resize.observe(element)
    return () => {
      resize.unobserve(element)
    }
  })
  storage.set(element, observer)
  return observer
}
