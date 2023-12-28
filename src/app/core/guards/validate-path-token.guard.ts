import {ActivatedRoute, CanActivateFn, CanMatchFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {TokensDb} from "@1inch/v3/core/tokens";
import {getViemChainId} from "@1inch/v3/core/wallet";
import {RouteHelperService} from "@1inch/v3/core/shared";


export function buildValidatePathTokenGuard(tokenPathName: 'srcToken' | 'dstToken'): CanActivateFn {
  return async (route) => {
    const tokensDb = inject(TokensDb)
    const router = inject(Router)
    const routeHelperService = inject(RouteHelperService)
    const symbol = route.paramMap.get(tokenPathName)
    if (!symbol) {
      return router.parseUrl('/')
    }
    const chainId = Number(route.paramMap.get('chainId'))
    if (isNaN(chainId)) {
      return router.parseUrl('/')
    }
    const token = await tokensDb.findBySymbol(chainId, symbol)
    if (!token && tokenPathName === "srcToken") {
      const chain = getViemChainId(chainId)
      const symbol = chain.nativeCurrency.symbol
      return routeHelperService.updatePathAndBuildUrlTree({ srcToken: symbol, chainId })
    }
    if (!token && tokenPathName === "dstToken") {
      return routeHelperService.updatePathAndBuildUrlTree({ dstToken: '', chainId })
    }
    return true;
  };
}
