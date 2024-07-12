import { IApplicationContext, IThemesController } from '@one-inch-community/models';
import { themeInit } from './theme-init';
import { BrandColors, MainColors } from './themes/themes';

export class ThemeController implements IThemesController {

  async init(context: IApplicationContext): Promise<void> {
    await themeInit(MainColors.systemSync, BrandColors.random)
  }

}
