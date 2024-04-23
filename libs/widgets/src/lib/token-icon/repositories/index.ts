import { Repository } from './repository.model';

export const repositories: (() => Promise<Repository>)[] = [
  () => import('./one-inch.repository').then(m => m.oneInchRepository),
  () => import('./uniswap.repository').then(m => m.uniSwapRepository),
  () => import('./trustwallet.repository').then(m => m.trustWalletRepository),
  // () => import('./sushiswap.repository').then(m => m.sushiSwapRepository),
  () => import('./pancakeswap.repository').then(m => m.pancakeSwapRepository),
]