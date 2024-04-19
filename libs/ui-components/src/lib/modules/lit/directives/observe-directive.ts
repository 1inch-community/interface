import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';
import { asapScheduler, Observable, observeOn, Subscription } from 'rxjs';

class ObserveDirective<T> extends AsyncDirective {
  private subscription?: Subscription;

  override render(observable: Observable<T>, initValue?: T) {
    this.subscription = observable.pipe(observeOn(asapScheduler)).subscribe(value => this.setValue(value));
    return initValue ?? '';
  }

  override disconnected() {
    this.subscription?.unsubscribe();
  }
}

export const observe = directive(ObserveDirective);