import { AsyncDirective as LitAsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';

class AsyncDirective<T> extends LitAsyncDirective {
  private isDisconnected = false

  override render(pending: Promise<T>, initValue?: T) {
    pending.then(this.handler)
    return initValue ?? '';
  }

  override disconnected() {
    this.isDisconnected = true
  }

  private handler = (value: T) => {
    if (this.isDisconnected) return
    this.setValue(value)
  }
}

export const async = directive(AsyncDirective);