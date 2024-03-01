import { brandColorStyleElement, mainColorStyleElement } from './theme-elements';
import { createAndApplyStyle } from '../../utils/dom.utils';
import { fontStyle } from './styles/font.style';
import { bodyStyle } from './styles/body.style';
import { themeChange } from './theme-change';
import { BrandColors, MainColors } from './themes/themes';

export async function themeInit(
  mainColorName: MainColors = MainColors.light,
  brandColorName: BrandColors = BrandColors.community,
) {
  document.head.appendChild(mainColorStyleElement)
  document.head.appendChild(brandColorStyleElement)
  createAndApplyStyle(fontStyle)
  createAndApplyStyle(bodyStyle)
  await themeChange(mainColorName, brandColorName)
}
