import { brandColorStyleElement, mainColorStyleElement } from './theme-elements';
import { fontStyle } from './styles/font.style';
import { bodyStyle } from './styles/body.style';
import { themeChange } from './theme-change';
import { BrandColors, MainColors } from '../../../../models/src/lib/themes/themes';
import { scrollbarStyle } from './styles/scrollbar.style';
import { createAndApplyStyle } from '@one-inch-community/core/lit';

export async function themeInit(
  mainColorName: MainColors = MainColors.light,
  brandColorName: BrandColors = BrandColors.community,
) {
  document.head.appendChild(mainColorStyleElement)
  document.head.appendChild(brandColorStyleElement)
  createAndApplyStyle(fontStyle)
  createAndApplyStyle(bodyStyle)
  createAndApplyStyle(scrollbarStyle)
  await themeChange(mainColorName, brandColorName)
}
