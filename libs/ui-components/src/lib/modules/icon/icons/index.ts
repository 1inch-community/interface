import { TemplateResult } from 'lit';
import { IconContext } from './icon-context';

export type IconsRecord = {
  loader: () => Promise<TemplateResult | ((context: IconContext) => TemplateResult)>
  width: string
  height: string
}

export const icons: Record<string, IconsRecord> = {
  circle16: { width: '16px', height: '16px', loader: () => import('./circle_16.svg').then(m => m.circle16Svg) },
  cross8: { width: '8px', height: '8px', loader: () => import('./cross_8.svg').then(m => m.cross8Svg) },
  startDefault16: { width: '16px', height: '16px', loader: () => import('./start-default_16.svg').then(m => m.startDefault16Svg) },
  connect16: { width: '16px', height: '16px', loader: () => import('./connect_16.svg').then(m => m.connect16Svg) },
  cornerDownRight16: { width: '16px', height: '16px', loader: () => import('./corner-down-right_16.svg').then(m => m.cornerDownRight16Svg) },
  chevronDown16: { width: '16px', height: '16px', loader: () => import('./chevron-down_16.svg').then(m => m.chevronDown16Svg) },
  arrowDown16: { width: '16px', height: '16px', loader: () => import('./arrow-down_16.svg').then(m => m.arrowDown16Svg) },
  link16: { width: '16px', height: '16px', loader: () => import('./link_16.svg').then(m => m.link16Svg) },
  plusCircle16: { width: '16px', height: '16px', loader: () => import('./plus-circle_16.svg').then(m => m.plusCircle16Svg) },
  circle24: { width: '24px', height: '24px', loader: () => import('./circle_24.svg').then(m => m.circle24Svg) },
  arrowDown24: { width: '24px', height: '24px', loader: () => import('./arrow-down_24.svg').then(m => m.arrowDown24Svg) },
  arrowLeft24: { width: '24px', height: '24px', loader: () => import('./arrow-left_24.svg').then(m => m.arrowLeft24Svg) },
  cross24: { width: '24px', height: '24px', loader: () => import('./cross_24.svg').then(m => m.cross24Svg) },
  search24: { width: '24px', height: '24px', loader: () => import('./search_24.svg').then(m => m.search24Svg) },
  edit24: { width: '24px', height: '24px', loader: () => import('./edit_24.svg').then(m => m.edit24Svg) },
  connect24: { width: '24px', height: '24px', loader: () => import('./connect_24.svg').then(m => m.connect24Svg) },
  link24: { width: '24px', height: '24px', loader: () => import('./link_24.svg').then(m => m.link24Svg) },
  alert24: { width: '24px', height: '24px', loader: () => import('./alert_24.svg').then(m => m.alert24Svg) },
  l2Chain24: { width: '24px', height: '24px', loader: () => import('./l2-chain_24.svg').then(m => m.l2Chain24Svg) },
  authRefresh36: { width: '36px', height: '36px', loader: () => import('./auth-refresh_36.svg').then(m => m.authRefresh36Svg) },
  logoFull: { width: '102px', height: '40px', loader: () => import('./logo-full.svg').then(m => m.logoFullSvg) },
  unicornRun: { width: '38px', height: '24px', loader: () => import('./unicorn_run.svg').then(m => m.unicornRunSvg) },
  fire48: { width: '48px', height: '48px', loader: () => import('./fire_48.png').then(m => m.fire48Png) },
  // chain icons
  eth24: { width: '24px', height: '24px', loader: () => import('./chain/eth_24.svg').then(m => m.eth24Svg) },
  bnb24: { width: '24px', height: '24px', loader: () => import('./chain/bnb_24.svg').then(m => m.bnb24Svg) },
  op24: { width: '24px', height: '24px', loader: () => import('./chain/op_24.svg').then(m => m.op24Svg) },
  matic24: { width: '24px', height: '24px', loader: () => import('./chain/matic_24.svg').then(m => m.matic24Svg) },
  arbitrum24: { width: '24px', height: '24px', loader: () => import('./chain/arbitrum_24.svg').then(m => m.arbitrum24Svg) },
  gnosis24: { width: '24px', height: '24px', loader: () => import('./chain/gnosis_24.svg').then(m => m.gnosis24Svg) },
  avalanche24: { width: '24px', height: '24px', loader: () => import('./chain/avalanche_24.svg').then(m => m.avalanche24Svg) },
  fantom24: { width: '24px', height: '24px', loader: () => import('./chain/fantom_24.svg').then(m => m.fantom24Svg) },
  aurora24: { width: '24px', height: '24px', loader: () => import('./chain/aurora_24.svg').then(m => m.aurora24Svg) },
  klaytn24: { width: '24px', height: '24px', loader: () => import('./chain/klaytn_24.svg').then(m => m.klaytn24Svg) },
  zkSyncEra24: { width: '24px', height: '24px', loader: () => import('./chain/zksyncera_24.svg').then(m => m.zkSyncEra24Svg) },
  base24: { width: '24px', height: '24px', loader: () => import('./chain/base_24.svg').then(m => m.base24Svg) },
}
