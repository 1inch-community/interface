import type { CSSResult } from 'lit';
import { BrandColors, MainColors } from '@one-inch-community/models';

export const mainColorMap: Record<MainColors, () => Promise<CSSResult>> = {
  [MainColors.systemSync]: () => getSystemTheme(),
  [MainColors.dark]: () => import('./main-color-schemes/dark.style').then(m => m.themeDark),
  [MainColors.darkBlue]: () => import('./main-color-schemes/dark-blue.style').then(m => m.themeDarkBlue),
  [MainColors.light]: () => import('./main-color-schemes/light.style').then(m => m.themeLight),
  [MainColors.lightBlue]: () => import('./main-color-schemes/light-blue.style').then(m => m.themeLightBlue),
}

export const brandColorMap: Record<BrandColors, () => Promise<CSSResult>> = {
  [BrandColors.community]: () => import('./brand-color-schemes/community.style').then(m => m.communityStyle),
  [BrandColors.rainbow]: () => import('./brand-color-schemes/rainbow.style').then(m => m.rainbowStyle),
  [BrandColors.random]: () => import('./brand-color-schemes/random.style').then(m => m.randomStyle()),
  [BrandColors.orange]: () => import('./brand-color-schemes/orange.style').then(m => m.orangeStyle),
  [BrandColors.violet]: () => import('./brand-color-schemes/violet.style').then(m => m.violetStyle),
}

function getSystemTheme() {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if ((window as any)?.ethereum?.isOneInchIOSWallet) return mainColorMap[MainColors.darkBlue]();
    return mainColorMap[MainColors.dark]();
  }
  if ((window as any)?.ethereum?.isOneInchIOSWallet) return mainColorMap[MainColors.lightBlue]();
  return mainColorMap[MainColors.light]();
}
