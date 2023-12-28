import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {LocalStorageService} from "ngx-webstorage";

export function buildRestorePathAndRedirectNextGuard(
    nextPathStoreKey: string,
    nextPathRedirectDefault: string,
): CanActivateFn {
  return async (route, state) => {
    const storage = inject(LocalStorageService)
    const router = inject(Router)
    const value = storage.retrieve(nextPathStoreKey) ?? nextPathRedirectDefault
    storage.store(nextPathStoreKey, value)
    return router.parseUrl([state.url, value].join('/'))
  };
}

export function restoreSwapMode() {
  return buildRestorePathAndRedirectNextGuard(
      'swapMode',
      'swap'
  )
}

export function restoreSrcToken() {
  return buildRestorePathAndRedirectNextGuard(
      'srcToken',
      'ETH'
  )
}
