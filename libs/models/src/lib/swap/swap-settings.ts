import { ISettingsController } from "../settings";

export interface SwapSettings {
  slippage: ISettingsController<[number, 'custom' | 'preset']>
  auctionTime: ISettingsController<[number, 'custom' | 'preset']>
}
