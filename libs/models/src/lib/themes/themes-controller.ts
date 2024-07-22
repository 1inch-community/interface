import { InitializingEntity } from '../base';
import { BrandColors, MainColors } from './themes';

export interface IThemesController extends InitializingEntity {
  themeChange(mainColorName: MainColors, brandColorName: BrandColors, event?: MouseEvent): Promise<void>
}
