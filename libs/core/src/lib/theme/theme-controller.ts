import { BrandColors, IApplicationContext, IThemesController, MainColors } from '@one-inch-community/models';
import { themeInit } from './theme-init';
import { themeChange } from './theme-change';

export class ThemeController implements IThemesController {

  async init(context: IApplicationContext): Promise<void> {
    await themeInit(MainColors.systemSync, BrandColors.random)
  }

  async themeChange(
    mainColorName: MainColors,
    brandColorName: BrandColors,
    event?: MouseEvent
  ): Promise<void> {
    return await themeChange(mainColorName, brandColorName, event)
  }

}
