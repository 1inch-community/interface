import { SettingsValue } from './swap-context';
import { ISwapContextStrategyDataSnapshot } from './swap-context-strategy';

export interface SwapSnapshot<T = unknown> extends ISwapContextStrategyDataSnapshot<T> {
  slippage: SettingsValue
  auctionTime: SettingsValue
}
