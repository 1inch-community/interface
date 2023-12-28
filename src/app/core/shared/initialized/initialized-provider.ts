import {APP_INITIALIZER, InjectionToken, Provider, Type} from "@angular/core";
import {Initialized} from "./initialized.interface";

function initializeServices(services: Initialized[]) {
  return () => Promise.all(services.map((service) => {
    try {
      return service.initialize();
    } catch (error) {
      console.error(error);
    }
  }));
}

export function initializedProvider(initializedTypes: Type<Initialized>[]): Provider[] {
  const initializedServicesToken = new InjectionToken('__initializedServicesToken:' + Date.now());
  return [
    ...initializedTypes,
    initializedTypes.map(provider => ({
      provide: initializedServicesToken,
      useExisting: provider,
      multi: true,
    })),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeServices,
      deps: [initializedServicesToken],
      multi: true,
    }
  ]
}
