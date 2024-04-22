import type { CSSResult } from 'lit';
import { MainColors, BrandColors } from './themes';

export const mainColorMap: Record<MainColors, () => Promise<CSSResult>> = {
  [MainColors.systemSync]: () => getSystemTheme(),
  [MainColors.dark]: () => import('./main-color-schemes/dark.style').then(m => m.themeDark),
  [MainColors.darkBlue]: () => import('./main-color-schemes/dark-blue.style').then(m => m.themeDarkBlue),
  [MainColors.light]: () => import('./main-color-schemes/light.style').then(m => m.themeLight),
  [MainColors.lightBlue]: () => import('./main-color-schemes/light-blue.style').then(m => m.themeLightBlue),
}

export const brandColorMap: Record<BrandColors, () => Promise<CSSResult>> = {
  [BrandColors.community]: () => import('./brand-color-schemes/community.style').then(m => m.communityStyle),
  [BrandColors.orange]: () => import('./brand-color-schemes/orange.style').then(m => m.orangeStyle),
  [BrandColors.violet]: () => import('./brand-color-schemes/violet.style').then(m => m.violetStyle),
}

function getSystemTheme() {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return mainColorMap[MainColors.dark]();
  }
  return mainColorMap[MainColors.light]();
}