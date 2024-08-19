import { BrandColors, IApplicationContext, IThemesController, MainColors } from '@one-inch-community/models';

export class ThemeEmbeddedController implements IThemesController {

  async init(context: IApplicationContext): Promise<void> {
    //
  }

  async onChangeTheme(mainColorName: MainColors, brandColorName: BrandColors, event?: MouseEvent): Promise<void> {
    throw new Error('ThemeEmbeddedController not support onChangeTheme')
  }

  async onChangeMainColor(mainColorName: MainColors, event?: MouseEvent): Promise<void> {
    throw new Error('ThemeEmbeddedController not support onChangeMainColor')
  }

  async onChangeBrandColor(brandColorName: BrandColors, event?: MouseEvent): Promise<void> {
    throw new Error('ThemeEmbeddedController not support onChangeBrandColor')
  }

  getActiveBrandColor(): BrandColors {
    throw new Error('ThemeEmbeddedController not support getActiveBrandColor')
  }

  getActiveMainColor(): MainColors {
    throw new Error('ThemeEmbeddedController not support getActiveMainColor')
  }
}
