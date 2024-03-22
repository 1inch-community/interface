import { TemplateResult } from 'lit';

export type IconsRecord = {
  loader: () => Promise<TemplateResult>
  width: string
  height: string
}

export const icons: Record<string, IconsRecord> = {
  circle16: { width: '16px', height: '16px', loader: () => import('./circle_16.svg').then(m => m.circle16Svg) },
  chevronDown16: { width: '16px', height: '16px', loader: () => import('./chevron-down_16.svg').then(m => m.chevronDown16Svg) },
  circle24: { width: '24px', height: '24px', loader: () => import('./circle_24.svg').then(m => m.circle24Svg) },
  arrowDown24: { width: '24px', height: '24px', loader: () => import('./arrow-down_24.svg').then(m => m.arrowDown24Svg) },
}