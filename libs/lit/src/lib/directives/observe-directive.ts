import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';
import { asapScheduler, Observable, observeOn, Subscription } from 'rxjs';

class ObserveDirective<T> extends AsyncDirective {
  private subscription?: Subscription;
  private lastValue?: T;

  override render(observable: Observable<T>, initValue?: T): T {
    if (this.subscription) {
      return this.lastValue ?? initValue ?? ('' as T)
    }
    this.subscription = observable.pipe(observeOn(asapScheduler)).subscribe(value => {
      this.lastValue = value
      this.setValue(value)
    });
    return initValue ?? ('' as T);
  }

  override disconnected() {
    this.subscription?.unsubscribe();
  }
}

export const observe = directive(ObserveDirective);
