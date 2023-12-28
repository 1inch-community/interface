import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const chainIdRedirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  if (state.url === '/') {
    return router.parseUrl('/1')
  }
  return true;
};
