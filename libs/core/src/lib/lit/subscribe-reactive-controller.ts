import { ReactiveController, ReactiveControllerHost } from 'lit';
import { combineLatest, debounceTime, Observable, OperatorFunction, Subscription } from 'rxjs';

type SubscribeReactiveControllerConfig = {
  requestUpdate?: boolean
}

const defaultConfig: SubscribeReactiveControllerConfig = {
  requestUpdate: true
}

class SubscribeReactiveController implements ReactiveController {

  private subscription?: Subscription
  private readonly config: SubscribeReactiveControllerConfig

  constructor(private readonly host: ReactiveControllerHost,
              private readonly observers: Observable<unknown> | Observable<unknown>[],
              config?: SubscribeReactiveControllerConfig) {
    host.addController(this)
    this.config = { ...defaultConfig, ...config }
    this.subscribe()
  }

  hostDisconnected() {
    this.subscription?.unsubscribe()
  }

  private subscribe() {
    const observable: Observable<unknown> = combineLatest(Array.isArray(this.observers) ? this.observers : [this.observers])
    this.subscription = observable
      .subscribe(() => {
        if (!this.config.requestUpdate) return
        this.host.requestUpdate()
      })
  }

}

export function subscribe(
  host: ReactiveControllerHost,
  observers: Observable<unknown> | Observable<unknown>[],
  config?: SubscribeReactiveControllerConfig
) {
  return new SubscribeReactiveController(host, observers, config);
}
