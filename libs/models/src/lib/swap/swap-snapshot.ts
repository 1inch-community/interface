import { SettingsValue } from './swap-context';
import { ISwapContextStrategyDataSnapshot } from './swap-context-strategy';

export interface SwapSnapshot extends ISwapContextStrategyDataSnapshot {
  slippage: SettingsValue
  auctionTime: SettingsValue
}
