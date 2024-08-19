import type { CSSResult } from 'lit';
import { BrandColors, MainColors } from '@one-inch-community/models';

export const mainColorMap: Record<MainColors, (targetName?: string) => Promise<CSSResult>> = {
  [MainColors.systemSync]: (targetName?: string) => getSystemTheme(targetName),
  [MainColors.dark]: (targetName?: string) => import('./main-color-schemes/dark.style').then(m => m.themeDark(targetName)),
  [MainColors.darkBlue]: (targetName?: string) => import('./main-color-schemes/dark-blue.style').then(m => m.themeDarkBlue(targetName)),
  [MainColors.light]: (targetName?: string) => import('./main-color-schemes/light.style').then(m => m.themeLight(targetName)),
  [MainColors.lightBlue]: (targetName?: string) => import('./main-color-schemes/light-blue.style').then(m => m.themeLightBlue(targetName)),
}

export const brandColorMap: Record<BrandColors, () => Promise<CSSResult>> = {
  [BrandColors.community]: () => import('./brand-color-schemes/community.style').then(m => m.communityStyle),
  [BrandColors.rainbow]: () => import('./brand-color-schemes/rainbow.style').then(m => m.rainbowStyle),
  [BrandColors.random]: () => import('./brand-color-schemes/random.style').then(m => m.randomStyle()),
  [BrandColors.orange]: () => import('./brand-color-schemes/orange.style').then(m => m.orangeStyle),
  [BrandColors.violet]: () => import('./brand-color-schemes/violet.style').then(m => m.violetStyle),
}

function getSystemTheme(targetName?: string) {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if ((window as any)?.ethereum?.isOneInchIOSWallet) return mainColorMap[MainColors.darkBlue](targetName);
    return mainColorMap[MainColors.dark](targetName);
  }
  if ((window as any)?.ethereum?.isOneInchIOSWallet) return mainColorMap[MainColors.lightBlue](targetName);
  return mainColorMap[MainColors.light](targetName);
}
