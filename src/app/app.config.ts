import {ApplicationConfig, importProvidersFrom, isDevMode} from '@angular/core';
import {provideRouter, withRouterConfig} from '@angular/router';

import {routes} from './app.routes';
import {NgxWebstorageModule} from "ngx-webstorage";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideWallet} from "@1inch/v3/core/wallet";
import {provideHttpClient} from "@angular/common/http";
import {config} from "./app.wallet-config";
import {provideTokens} from "@1inch/v3/core/tokens";
import {initializedProvider, provideRouteHelperService} from "@1inch/v3/core/shared";
import {SelectTokenService} from "./view/swap-form/services/select-token.service";
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: "always" })),
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom([
        NgxWebstorageModule.forRoot(),
    ]),
    initializedProvider([
        SelectTokenService
    ]),
    provideWallet(config),
    provideTokens(),
    provideRouteHelperService(),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
]
};
