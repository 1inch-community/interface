import { Routes } from '@angular/router';
import {chainIdRedirectGuard} from "./core/guards/chain-id-redirect.guard";
import {restoreSrcToken, restoreSwapMode} from "./core/guards/restore-path-and-redirect-next.guard";
import {buildValidatePathTokenGuard} from "./core/guards/validate-path-token.guard";
import {SwapFormDataService} from "./view/swap-form/services/swap-form-data.service";
import {chainIdValidateAndSetGuard} from "./core/guards/chain-id-validate-and-set.guard";

const swapFormProviders = [
  SwapFormDataService
]

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./view/main/components/platform-container/platform-container.component').then(c => c.PlatformContainerComponent),
    canActivate: [chainIdRedirectGuard]
  },
  {
    path: ':chainId',
    loadComponent: () => import('./view/main/components/platform-container/platform-container.component').then(c => c.PlatformContainerComponent),
    canActivate: [chainIdValidateAndSetGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./view/swap-form/components/swap-form/swap-form.component').then(c => c.SwapFormComponent),
        canActivate: [restoreSwapMode()]
      },
      {
        path: 'swap',
        loadComponent: () => import('./view/swap-form/components/swap-form/swap-form.component').then(c => c.SwapFormComponent),
        providers: swapFormProviders,
        canActivate: [restoreSrcToken()],
        data: { swapModePath: 'swap' }
      },
      {
        path: 'swap/:srcToken',
        loadComponent: () => import('./view/swap-form/components/swap-form/swap-form.component').then(c => c.SwapFormComponent),
        canActivate: [buildValidatePathTokenGuard('srcToken')],
        providers: swapFormProviders,
        data: { swapModePath: 'swap' }
      },
      {
        path: 'swap/:srcToken/:dstToken',
        loadComponent: () => import('./view/swap-form/components/swap-form/swap-form.component').then(c => c.SwapFormComponent),
        canActivate: [
          buildValidatePathTokenGuard('srcToken'),
          buildValidatePathTokenGuard('dstToken'),
        ],
        providers: swapFormProviders,
        data: { swapModePath: 'swap' }
      },
      {
        path: 'swap/:srcToken/select/:tokenType',
        loadComponent: () => import('./view/swap-form/components/select-token/select-token.component').then(c => c.SelectTokenComponent),
        canActivate: [
          buildValidatePathTokenGuard('srcToken'),
        ],
        providers: swapFormProviders,
        data: { swapModePath: 'swap' }
      },
      {
        path: 'swap/:srcToken/:dstToken/select/:tokenType',
        loadComponent: () => import('./view/swap-form/components/select-token/select-token.component').then(c => c.SelectTokenComponent),
        canActivate: [
          buildValidatePathTokenGuard('srcToken'),
          buildValidatePathTokenGuard('dstToken'),
        ],
        providers: swapFormProviders,
        data: { swapModePath: 'swap' }
      },
      {
        path: ':chainId',
        redirectTo: 'swap'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
