import { BrandColors, IApplicationContext, IThemesController, MainColors } from '@one-inch-community/models';
import { themeInit } from './theme-init';
import { themeChange } from './theme-change';
import { SettingsController } from '@one-inch-community/core/settings';

export class ThemeController implements IThemesController {

  private readonly mainColorSettings = new SettingsController(
    'main-color-name',
    MainColors.systemSync
  )

  private readonly brandColorSettings = new SettingsController(
    'brand-color-name',
    BrandColors.community
  )

  getActiveMainColor(): MainColors {
    return this.mainColorSettings.value ?? MainColors.systemSync
  }

  getActiveBrandColor(): BrandColors {
    return this.brandColorSettings.value ?? BrandColors.community
  }

  async init(context: IApplicationContext): Promise<void> {
    const mainColorName = this.getActiveMainColor()
    const brandColorName = this.getActiveBrandColor()
    await themeInit(mainColorName, brandColorName)
  }

  async onChangeTheme(
    mainColorName: MainColors,
    brandColorName: BrandColors,
    event?: MouseEvent
  ): Promise<void> {
    this.mainColorSettings.setValue(mainColorName)
    this.brandColorSettings.setValue(brandColorName)
    return await themeChange(mainColorName, brandColorName, event)
  }

  async onChangeMainColor(mainColorName: MainColors, event?: MouseEvent): Promise<void> {
    const brandColorName = this.getActiveBrandColor()
    await this.onChangeTheme(mainColorName, brandColorName, event)
  }

  async onChangeBrandColor(brandColorName: BrandColors, event?: MouseEvent): Promise<void> {
    const mainColorName = this.getActiveMainColor()
    await this.onChangeTheme(mainColorName, brandColorName, event)
  }

}
