import { directive } from 'lit/directive.js';
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';

class SceneLazyValue<T> extends AsyncDirective {

  private controller?: SceneLazyValueReactiveController<T>

  override render(host: ReactiveControllerHost, valueFactory: () => T): T {
    if (!this.controller) {
      this.controller = new SceneLazyValueReactiveController(
        valueFactory,
        value => this.setValue(value)
      )
      host.addController(this.controller)
    }
    return valueFactory()
  }

}

class SceneLazyValueReactiveController<T> implements ReactiveController {

  private lastValue?: T

  constructor(
    private readonly valueFactory: () => T,
    private readonly update: (value: T) => void
  ) {}

  hostUpdate() {
    const nextValue = this.valueFactory()
    if (nextValue !== this.lastValue) {
      this.lastValue = nextValue
      this.update(nextValue)
    }
  }

}

export const sceneLazyValue = directive(SceneLazyValue)
