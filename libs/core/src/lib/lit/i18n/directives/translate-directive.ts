import { AsyncDirective as LitAsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';
import { asapScheduler, observeOn, Subscription } from 'rxjs';
import { listenChangesByPath } from '../i18n';
import { objectsEqual } from '@one-inch-community/core/utils';

const stubText = ''

class TranslateDirective extends LitAsyncDirective {

  private subscription?: Subscription;
  private lastValue?: string;
  private lastPath?: string;
  private lastContext?: Record<string, unknown>;

  override render(path: string, context?: Record<string, unknown>): string {
    if (this.subscription && this.lastPath === path && objectsEqual(this.lastContext, context)) {
      return this.lastValue ?? stubText
    } else {
      this.disconnected()
    }
    this.subscription = listenChangesByPath(path, context).pipe(
      observeOn(asapScheduler)
    ).subscribe(value => {
      this.setValue(value)
      this.lastValue = value
      this.lastPath = path
      this.lastContext = context
    })
    return stubText
  }

  override disconnected() {
    this.subscription?.unsubscribe();
  }

}

export const translate = directive(TranslateDirective);
