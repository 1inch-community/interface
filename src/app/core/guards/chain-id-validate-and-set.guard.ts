import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {ChainId, WalletConnectionHandler, WalletDataService} from "@1inch/v3/core/wallet";

let isFirst = true
export const chainIdValidateAndSetGuard: CanActivateFn = async (route) => {
  const router = inject(Router)
  const chainIdFromUrl = Number(route.paramMap.get('chainId'))
  if (!ChainId[chainIdFromUrl]) {
    isFirst = false
    return router.parseUrl('/1')
  }
  const wallet = inject(WalletConnectionHandler)
  const walletData = inject(WalletDataService)
  const chainId = await walletData.getChainId()
  if (chainId === chainIdFromUrl) {
    isFirst = false
    return true
  }
  if (isFirst) {
    isFirst = false
    wallet.setChainId(chainIdFromUrl).catch()
    return true
  }
  isFirst = false
  return await wallet.setChainId(chainIdFromUrl).catch((error) => {
    console.error('routing error', error)
    return false
  })
};
