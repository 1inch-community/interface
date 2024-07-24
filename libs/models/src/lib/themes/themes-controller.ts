import { InitializingEntity } from '../base';
import { BrandColors, MainColors } from './themes';

export interface IThemesController extends InitializingEntity {
  onChangeTheme(mainColorName: MainColors, brandColorName: BrandColors, event?: MouseEvent): Promise<void>
  onChangeMainColor(mainColorName: MainColors, event?: MouseEvent): Promise<void>
  onChangeBrandColor(brandColorName: BrandColors, event?: MouseEvent): Promise<void>
  getActiveBrandColor(): BrandColors
  getActiveMainColor(): MainColors
}
