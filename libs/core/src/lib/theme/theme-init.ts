import { brandColorStyleElement, mainColorStyleElement } from './theme-elements';
import { fontStyle } from './styles/font.style';
import { bodyStyle } from './styles/body.style';
import { themeChange } from './theme-change';
import { scrollbarStyle } from './styles/scrollbar.style';
import { createAndApplyStyle } from '@one-inch-community/core/lit';
import { BrandColors, MainColors } from '@one-inch-community/models';

export async function themeInit(
  mainColorName: MainColors = MainColors.light,
  brandColorName: BrandColors = BrandColors.community,
) {
  document.head.appendChild(mainColorStyleElement)
  document.head.appendChild(brandColorStyleElement)
  createAndApplyStyle(fontStyle())
  createAndApplyStyle(bodyStyle)
  createAndApplyStyle(scrollbarStyle)
  await themeChange(mainColorName, brandColorName)
}
