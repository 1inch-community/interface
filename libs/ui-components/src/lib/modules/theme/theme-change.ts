import { brandColorMap, mainColorMap } from './themes';
import { applyStyle } from '../../utils/dom.utils';
import { mainColorStyleElement, brandColorStyleElement } from './theme-elements';
import { MainColors, BrandColors } from './themes/themes';

let currentMainColor: MainColors
let currentBrandColor: BrandColors

export async function themeChangeMainColor(mainColorName: MainColors, event?: MouseEvent) {
  return await themeChange(mainColorName, currentBrandColor, event)
}

export async function themeChangeBrandColor(brandColorName: BrandColors, event?: MouseEvent) {
  return await themeChange(currentMainColor, brandColorName, event)
}

export async function themeChange(
  mainColorName: MainColors,
  brandColorName: BrandColors,
  event?: MouseEvent
) {
  const changeTheme = async () => {
    const mainColor = await mainColorMap[mainColorName]()
    const brandColor = await brandColorMap[brandColorName]()
    applyStyle(mainColorStyleElement, mainColor)
    applyStyle(brandColorStyleElement, brandColor)
    currentMainColor = mainColorName
    currentBrandColor = brandColorName
  }
  if (event && ('startViewTransition' in document)) {
    const x = event.clientX;
    const y = event.clientY;
    const right = window.innerWidth - y;
    const bottom = window.innerHeight - x;
    const maxRadius = Math.hypot(
      Math.max(y, right),
      Math.max(x, bottom),
    );

    (document as any).startViewTransition(() => {
      changeTheme()
    }).ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 600,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
    return
  }

  await changeTheme()
}