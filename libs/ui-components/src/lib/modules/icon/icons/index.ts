import { TemplateResult } from 'lit';
import { IconContext } from './icon-context';

export type IconsRecord = {
  loader: () => Promise<TemplateResult | ((context: IconContext) => TemplateResult)>
  width: string
  height: string
}

export const icons: Record<string, IconsRecord> = {
  circle16: { width: '16px', height: '16px', loader: () => import('./circle_16.svg').then(m => m.circle16Svg) },
  chevronDown16: { width: '16px', height: '16px', loader: () => import('./chevron-down_16.svg').then(m => m.chevronDown16Svg) },
  arrowDown16: { width: '16px', height: '16px', loader: () => import('./arrow-down_16.svg').then(m => m.arrowDown16Svg) },
  circle24: { width: '24px', height: '24px', loader: () => import('./circle_24.svg').then(m => m.circle24Svg) },
  arrowDown24: { width: '24px', height: '24px', loader: () => import('./arrow-down_24.svg').then(m => m.arrowDown24Svg) },
  arrowLeft24: { width: '24px', height: '24px', loader: () => import('./arrow-left_24.svg').then(m => m.arrowLeft24Svg) },
  cross24: { width: '24px', height: '24px', loader: () => import('./cross_24.svg').then(m => m.cross24Svg) },
  search24: { width: '24px', height: '24px', loader: () => import('./search_24.svg').then(m => m.search24Svg) },
  authRefresh36: { width: '36px', height: '36px', loader: () => import('./auth-refresh_36.svg').then(m => m.authRefresh36Svg) },
  logoFull: { width: '102px', height: '40px', loader: () => import('./logo-full.svg').then(m => m.logoFullSvg) },
  unicornRun: { width: '38px', height: '24px', loader: () => import('./unicorn_run.svg').then(m => m.unicornRunSvg) },
}